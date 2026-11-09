<?php

namespace App\Http\Controllers\Api;

use App\Enums\StatutInscription;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInscriptionRequest;
use App\Http\Resources\InscriptionResource;
use App\Mail\InscriptionRecue;
use App\Mail\VerifierInscription;
use App\Models\Edition;
use App\Models\Inscription;
use App\Services\GestionPlaces;
use App\Services\Notificateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class InscriptionController extends Controller
{
    public function __construct(
        private readonly GestionPlaces $places,
        private readonly Notificateur $notificateur,
    ) {}

    public function store(StoreInscriptionRequest $request): JsonResponse
    {
        $edition = Edition::active();

        if (! $edition || ! $edition->inscriptions_ouvertes) {
            return response()->json([
                'message' => 'Les inscriptions ne sont pas ouvertes actuellement.',
            ], 422);
        }

        $donnees = $request->validated();
        $formationIds = $donnees['formations'] ?? [];
        unset($donnees['formations'], $donnees[config('antiabus.piege.champ', 'site_web')], $donnees['_ouvert_le']);

        /*
         * Les places ne sont pas réservées ici — elles le seront à la
         * confirmation, dans verifier().
         *
         * C'est le cœur de la protection contre le faux trafic : un robot qui
         * remplit le formulaire mille fois avec des adresses inventées ne
         * retire plus une seule place à personne. Le prix à payer est que la
         * place peut partir entre l'envoi du courrier et le clic ; l'email le
         * dit, et verifier() traite le cas proprement plutôt que d'échouer.
         *
         * Les formations choisies attendent dans formations_demandees :
         * sans cela le choix serait perdu entre le formulaire et le lien.
         */
        $jetonClair = Str::random(64);

        $inscription = DB::transaction(function () use ($donnees, $formationIds, $edition, $jetonClair, $request) {
            $inscription = Inscription::create([
                ...$donnees,
                'edition_id' => $edition->id,
                'user_id' => auth()->id(),
                // Placeholder: the real reference needs the row's own id,
                // which only exists once the insert has run.
                'reference' => (string) Str::uuid(),
                'statut' => StatutInscription::EnAttente,
                'formations_demandees' => $formationIds,
                // Haché, jamais en clair : une fuite de la table ne doit pas
                // permettre de confirmer l'inscription d'autrui.
                'jeton_verification' => hash('sha256', $jetonClair),
                'jeton_expire_le' => now()->addHours((int) config('antiabus.verification.heures', 48)),
                'ip_creation' => $request->ip(),
                'envois_verification' => 1,
            ]);

            $inscription->setRelation('edition', $edition);
            $inscription->update(['reference' => $inscription->construireReference()]);

            return $inscription;
        });

        /*
         * Un seul email part ici : la demande de confirmation. Le
         * récapitulatif (InscriptionRecue) attend la confirmation — sinon le
         * participant reçoit deux messages contradictoires à une minute
         * d'intervalle, dont l'un lui annonce une inscription qui n'est pas
         * encore acquise.
         */
        $this->notificateur->envoyer(
            new VerifierInscription($inscription, $jetonClair),
            ['inscription' => $inscription->reference],
        );

        return response()->json([
            'message' => 'Votre demande a bien été enregistrée. '
                .'Consultez votre boîte mail pour confirmer votre inscription.',
            'verification_requise' => true,
            'reference' => $inscription->reference,
            'email' => $inscription->email,
        ], 201);
    }

    /**
     * La confirmation, suivie de la réservation des places.
     *
     * L'ordre compte : on ne décompte un quota qu'une fois qu'une vraie
     * personne a ouvert une vraie boîte mail.
     */
    public function verifier(string $jeton): JsonResponse
    {
        $inscription = Inscription::where('jeton_verification', hash('sha256', $jeton))->first();

        if (! $inscription) {
            return response()->json([
                'message' => "Ce lien de confirmation n'est plus valable.",
            ], 404);
        }

        // Idempotent : on clique souvent deux fois, ou le lien est rouvert
        // depuis l'historique du courrier.
        if ($inscription->estVerifiee()) {
            $inscription->load(['formations.categorie', 'formations.formateur', 'edition']);

            return response()->json([
                'message' => 'Votre inscription était déjà confirmée.',
                'deja_confirme' => true,
                'data' => new InscriptionResource($inscription),
            ]);
        }

        if ($inscription->jeton_expire_le?->isPast()) {
            return response()->json([
                'message' => 'Ce lien a expiré. Demandez-en un nouveau depuis la page d\'inscription.',
                'expire' => true,
            ], 410);
        }

        $complets = [];

        DB::transaction(function () use ($inscription, &$complets) {
            $inscription->update([
                'email_verifie_le' => now(),
                // Le jeton a servi : le garder permettrait de rejouer le lien.
                'jeton_verification' => null,
                'jeton_expire_le' => null,
            ]);

            /*
             * Les places, maintenant seulement.
             *
             * Une formation remplie entre-temps ne fait pas échouer la
             * confirmation : l'inscription au salon reste valide et les autres
             * formations sont réservées. Rejeter l'ensemble punirait la
             * personne pour une lenteur qui n'est pas la sienne.
             */
            $complets = $this->places->reserverCeQuiReste(
                $inscription,
                $inscription->formations_demandees ?? [],
            );

            $inscription->update(['formations_demandees' => null]);
        });

        $inscription->load(['formations.categorie', 'formations.formateur', 'edition']);

        // Le récapitulatif complet, celui que la personne gardera.
        $this->notificateur->envoyer(
            new InscriptionRecue($inscription),
            ['inscription' => $inscription->reference],
        );

        return response()->json([
            'message' => 'Votre inscription est confirmée.',
            'deja_confirme' => false,
            'formations_completes' => $complets,
            'data' => new InscriptionResource($inscription),
        ]);
    }

    /**
     * Renvoie la demande de confirmation.
     *
     * Réponse identique que l'adresse corresponde à une inscription ou non :
     * autrement, ce formulaire dirait qui s'est inscrit au salon.
     */
    public function renvoyerVerification(Request $request): JsonResponse
    {
        $valide = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $reponse = response()->json([
            'message' => 'Si une inscription attend une confirmation à cette adresse, '
                .'un nouvel email vient de partir.',
        ]);

        $inscription = Inscription::nonVerifiees()
            ->whereRaw('lower(email) = ?', [mb_strtolower($valide['email'])])
            ->latest('id')
            ->first();

        if (! $inscription) {
            return $reponse;
        }

        // Un plafond par inscription, en plus du throttle par IP : sans lui,
        // une adresse ciblée pourrait recevoir un email toutes les heures
        // jusqu'à l'événement.
        if ($inscription->envois_verification >= (int) config('antiabus.verification.envois_max', 5)) {
            Log::info('Plafond de renvois atteint', ['inscription' => $inscription->reference]);

            return $reponse;
        }

        $jetonClair = Str::random(64);

        $inscription->update([
            'jeton_verification' => hash('sha256', $jetonClair),
            'jeton_expire_le' => now()->addHours((int) config('antiabus.verification.heures', 48)),
            'envois_verification' => $inscription->envois_verification + 1,
        ]);

        $this->notificateur->envoyer(
            new VerifierInscription($inscription, $jetonClair),
            ['inscription' => $inscription->reference, 'motif' => 'renvoi'],
        );

        return $reponse;
    }

    /** Public recap, reachable with the reference the participant was given. */
    public function show(string $reference): JsonResponse
    {
        $inscription = Inscription::where('reference', $reference)
            ->with(['formations.categorie', 'formations.formateur', 'documents', 'edition'])
            ->firstOrFail();

        return response()->json(['data' => new InscriptionResource($inscription)]);
    }
}
