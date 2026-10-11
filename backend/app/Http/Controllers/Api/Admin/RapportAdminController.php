<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\StatutCandidature;
use App\Enums\StatutInscription;
use App\Enums\StatutOffre;
use App\Enums\TypeParticipation;
use App\Http\Controllers\Controller;
use App\Models\Candidature;
use App\Models\Edition;
use App\Models\Entreprise;
use App\Models\Entretien;
use App\Models\Formation;
use App\Models\Inscription;
use App\Models\OffreEmploi;
use App\Models\ProfilDemandeur;
use App\Models\User;
use App\Services\ExportCsv;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\StreamedResponse;

/** Platform-wide statistics and CSV exports. */
class RapportAdminController extends Controller
{
    public function __construct(
        private readonly ExportCsv $export,
    ) {}

    /**
     * Dashboard figures.
     *
     * Each block is one grouped query rather than a count per status, so the
     * page costs a fixed handful of queries however much data accumulates.
     */
    public function statistiques(Request $request): JsonResponse
    {
        $edition = $request->integer('edition_id')
            ? Edition::find($request->integer('edition_id'))
            : Edition::active();

        return response()->json([
            'edition' => $edition ? [
                'id' => $edition->id,
                'annee' => $edition->annee,
                'nom' => $edition->nom,
            ] : null,

            'inscriptions' => $this->inscriptions($edition?->id),
            'formations' => $this->formations($edition?->id),
            'emploi' => $this->emploi(),
            'utilisateurs' => $this->utilisateurs(),
            'activite' => $this->activite($edition?->id),
        ]);
    }

    private function inscriptions(?int $editionId): array
    {
        $base = Inscription::when($editionId, fn ($q) => $q->where('edition_id', $editionId));

        $parStatut = (clone $base)->selectRaw('statut, count(*) as total')
            ->groupBy('statut')->pluck('total', 'statut');

        $parType = (clone $base)->selectRaw('type_participation, count(*) as total')
            ->groupBy('type_participation')->pluck('total', 'type_participation');

        return [
            'total' => (int) $parStatut->sum(),
            ...collect(StatutInscription::cases())
                ->mapWithKeys(fn ($s) => [$s->value => (int) ($parStatut[$s->value] ?? 0)])->all(),
            'par_type' => collect(TypeParticipation::cases())
                ->map(fn ($t) => [
                    'valeur' => $t->value,
                    'label' => $t->label(),
                    'total' => (int) ($parType[$t->value] ?? 0),
                ])->values(),
            'par_ville' => (clone $base)
                ->selectRaw('ville, count(*) as total')
                ->whereNotNull('ville')
                ->groupBy('ville')->orderByDesc('total')->limit(10)
                ->get()->map(fn ($l) => ['valeur' => $l->ville, 'total' => (int) $l->total]),
        ];
    }

    private function formations(?int $editionId): array
    {
        $base = Formation::when($editionId, fn ($q) => $q->where('edition_id', $editionId));

        return [
            'total' => (clone $base)->count(),
            'publiees' => (clone $base)->where('publiee', true)->count(),
            'places_totales' => (int) (clone $base)->sum('max_inscriptions'),
            'places_prises' => (int) (clone $base)->sum('inscriptions_count'),
            'les_plus_demandees' => (clone $base)
                ->select('titre', 'inscriptions_count', 'max_inscriptions')
                ->orderByDesc('inscriptions_count')->limit(5)
                ->get()->map(fn ($f) => [
                    'titre' => $f->titre,
                    'inscrits' => (int) $f->inscriptions_count,
                    'places' => (int) $f->max_inscriptions,
                ]),
        ];
    }

    private function emploi(): array
    {
        $offresParStatut = OffreEmploi::selectRaw('statut, count(*) as total')
            ->groupBy('statut')->pluck('total', 'statut');

        $candidaturesParStatut = Candidature::selectRaw('statut, count(*) as total')
            ->groupBy('statut')->pluck('total', 'statut');

        return [
            'offres' => [
                'total' => (int) $offresParStatut->sum(),
                'publiees' => (int) ($offresParStatut[StatutOffre::Publiee->value] ?? 0),
                'vues' => (int) OffreEmploi::sum('vues'),
            ],
            'candidatures' => [
                'total' => (int) $candidaturesParStatut->sum(),
                ...collect(StatutCandidature::cases())
                    ->mapWithKeys(fn ($s) => [$s->value => (int) ($candidaturesParStatut[$s->value] ?? 0)])->all(),
            ],
            'entreprises' => [
                'total' => Entreprise::count(),
                'verifiees' => Entreprise::where('verifiee', true)->count(),
            ],
            'demandeurs' => [
                'total' => ProfilDemandeur::count(),
                'visibles' => ProfilDemandeur::where('visible', true)->count(),
            ],
            'entretiens' => Entretien::count(),
        ];
    }

    private function utilisateurs(): array
    {
        $parRole = User::selectRaw('role, count(*) as total')->groupBy('role')->pluck('total', 'role');

        return [
            'total' => (int) $parRole->sum(),
            'actifs' => User::where('statut', 'actif')->count(),
            'par_role' => $parRole->map(fn ($t) => (int) $t),
        ];
    }

    /** Registrations per day over the last 30 days, for the trend chart. */
    private function activite(?int $editionId): array
    {
        return Inscription::when($editionId, fn ($q) => $q->where('edition_id', $editionId))
            ->where('created_at', '>=', now()->subDays(30))
            ->selectRaw('date(created_at) as jour, count(*) as total')
            ->groupBy(DB::raw('date(created_at)'))
            ->orderBy('jour')
            ->get()
            ->map(fn ($l) => ['jour' => (string) $l->jour, 'total' => (int) $l->total])
            ->all();
    }

    /* ─── Exports ─── */

    public function exporterInscriptions(Request $request): StreamedResponse
    {
        $query = Inscription::query()
            ->with(['edition:id,annee', 'formations:id,titre'])
            ->when($request->integer('edition_id'), fn ($q, $id) => $q->where('edition_id', $id))
            ->when($request->string('statut')->value(), fn ($q, $s) => $q->where('statut', $s))
            ->orderBy('id');

        return $this->export->telecharger(
            $query,
            [
                'Référence' => 'reference',
                'Nom' => 'nom',
                'Email' => 'email',
                'Téléphone' => 'telephone',
                'Ville' => 'ville',
                'Niveau' => 'niveau',
                'Statut professionnel' => 'statut_pro',
                'Domaine' => 'domaine',
                'Type de participation' => 'type_participation',
                'Statut' => 'statut',
                'Formations' => 'formations',
                'Inscrit le' => 'created_at',
            ],
            'inscriptions-'.now()->format('Y-m-d').'.csv',
            fn (Inscription $i) => [
                ...$i->toArray(),
                'type_participation' => $i->type_participation->label(),
                'statut' => $i->statut->label(),
                'formations' => $i->formations->pluck('titre')->all(),
                'created_at' => $i->created_at->format('d/m/Y H:i'),
            ],
        );
    }

    public function exporterCandidatures(Request $request): StreamedResponse
    {
        $query = Candidature::query()
            ->with(['offre:id,titre,entreprise_id', 'offre.entreprise:id,nom', 'profil.user:id,name,email'])
            ->when($request->string('statut')->value(), fn ($q, $s) => $q->where('statut', $s))
            ->orderBy('id');

        return $this->export->telecharger(
            $query,
            [
                'Référence' => 'reference',
                'Candidat' => 'candidat',
                'Email' => 'email',
                'Offre' => 'offre.titre',
                'Entreprise' => 'offre.entreprise.nom',
                'Statut' => 'statut',
                'Postulé le' => 'created_at',
            ],
            'candidatures-'.now()->format('Y-m-d').'.csv',
            fn (Candidature $c) => [
                ...$c->toArray(),
                'candidat' => $c->profil?->user?->name,
                'email' => $c->profil?->user?->email,
                'statut' => $c->statut->label(),
                'created_at' => $c->created_at->format('d/m/Y H:i'),
            ],
        );
    }

    public function exporterOffres(Request $request): StreamedResponse
    {
        $query = OffreEmploi::query()
            ->with('entreprise:id,nom')
            ->when($request->string('statut')->value(), fn ($q, $s) => $q->where('statut', $s))
            ->orderBy('id');

        return $this->export->telecharger(
            $query,
            [
                'Titre' => 'titre',
                'Entreprise' => 'entreprise.nom',
                'Secteur' => 'secteur',
                'Ville' => 'ville',
                'Contrat' => 'type_contrat',
                'Statut' => 'statut',
                'Candidatures' => 'candidatures_count',
                'Vues' => 'vues',
                'Publiée le' => 'publiee_le',
            ],
            'offres-'.now()->format('Y-m-d').'.csv',
            fn (OffreEmploi $o) => [
                ...$o->toArray(),
                'type_contrat' => $o->type_contrat?->label(),
                'statut' => $o->statut?->label(),
                'publiee_le' => $o->publiee_le?->format('d/m/Y'),
            ],
        );
    }

    /** Attendee list for one course — what an organiser prints on the day. */
    public function exporterInscritsFormation(Formation $formation): StreamedResponse
    {
        $query = $formation->inscriptions()->orderBy('nom');

        return $this->export->telecharger(
            $query,
            [
                'Référence' => 'reference',
                'Nom' => 'nom',
                'Email' => 'email',
                'Téléphone' => 'telephone',
                'Ville' => 'ville',
                'Statut' => 'statut',
            ],
            'inscrits-'.$formation->slug.'.csv',
            fn (Inscription $i) => [...$i->toArray(), 'statut' => $i->statut->label()],
        );
    }
}
