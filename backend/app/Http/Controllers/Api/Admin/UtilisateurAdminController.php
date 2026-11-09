<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\RoleUtilisateur;
use App\Http\Concerns\FiltreLesListes;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Mail\BienvenueCompte;
use App\Mail\VerifierEmail;
use App\Services\Notificateur;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

/** User, role and access management. */
class UtilisateurAdminController extends Controller
{
    use FiltreLesListes;

    public function __construct(private readonly Notificateur $notificateur) {}

    public function index(Request $request): JsonResponse
    {
        $page = $this->listePaginee(
            User::query()->withCount('inscriptions'),
            $request,
            recherchables: ['name', 'email', 'telephone'],
            filtrables: ['role', 'statut'],
            triables: ['name', 'email', 'role', 'statut', 'derniere_connexion_le', 'created_at'],
        );

        return response()->json([
            'data' => collect($page->items())->map(fn (User $u) => $this->presenter($u)),
            'meta' => $this->meta($page),
            'filtres' => [
                'role' => collect(RoleUtilisateur::cases())
                    ->map(fn ($r) => ['value' => $r->value, 'label' => $r->label()]),
                'statut' => [
                    ['value' => 'actif', 'label' => 'Actif'],
                    ['value' => 'suspendu', 'label' => 'Suspendu'],
                ],
            ],
            'resume' => $this->resume(),
        ]);
    }

    public function show(User $utilisateur): JsonResponse
    {
        $utilisateur->loadCount('inscriptions');

        return response()->json(['data' => $this->presenter($utilisateur)]);
    }

    public function store(Request $request): JsonResponse
    {
        $valide = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'telephone' => ['nullable', 'string', 'max:20'],
            'password' => ['required', Password::min(8)->letters()->numbers()],
            // An administrator may grant any role, unlike public signup.
            'role' => ['required', Rule::enum(RoleUtilisateur::class)],
        ]);

        /*
         * Créé non vérifié, comme une inscription publique — demande du client.
         *
         * Une adresse mal tapée par l'administrateur donnerait sinon un compte
         * actif rattaché à une boîte que personne ne lit. Si l'intéressé ne
         * reçoit pas le lien, le bouton « Confirmer » du back-office reste la
         * clé de secours.
         */
        $user = User::create([
            ...$valide,
            'statut' => 'actif',
        ]);

        $this->notificateur->envoyer(
            new VerifierEmail($user),
            ['user_id' => $user->id, 'motif' => 'creation back-office'],
        );

        /*
         * Même accueil que pour une inscription publique.
         *
         * Un compte ouvert depuis le back-office ne prévenait personne : son
         * titulaire ignorait qu'il existait. Le mot de passe n'y figure pas —
         * il est choisi par l'administrateur, qui le transmet autrement.
         */
        $this->notificateur->envoyer(
            new BienvenueCompte($user),
            ['user_id' => $user->id],
        );

        return response()->json([
            'message' => 'Utilisateur créé.',
            'data' => $this->presenter($user),
        ], 201);
    }

    public function update(Request $request, User $utilisateur): JsonResponse
    {
        $valide = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($utilisateur->id)],
            'telephone' => ['nullable', 'string', 'max:20'],
            'role' => ['sometimes', Rule::enum(RoleUtilisateur::class)],
            'statut' => ['sometimes', Rule::in(['actif', 'suspendu'])],
            'password' => ['nullable', Password::min(8)->letters()->numbers()],
        ]);

        if (blank($valide['password'] ?? null)) {
            unset($valide['password']);
        }

        if ($refus = $this->refuserAutoDestruction($request, $utilisateur, $valide)) {
            return response()->json(['message' => $refus], 422);
        }

        /*
         * Changer l'adresse annule la confirmation, et en redemande une.
         *
         * Sans cela le verrou serait décoratif : il suffirait de créer un
         * compte avec sa propre adresse, de la confirmer, puis de la remplacer
         * par n'importe quelle autre — qui hériterait d'un statut « vérifié »
         * que personne n'a jamais prouvé. C'est aussi la bonne réponse au cas
         * honnête, celui de la faute de frappe corrigée : la nouvelle adresse
         * est inconnue, elle doit faire ses preuves comme la première.
         *
         * La comparaison est insensible à la casse, sinon une simple majuscule
         * déclencherait un cycle de vérification pour la même adresse.
         */
        $nouvelEmail = isset($valide['email'])
            && mb_strtolower($valide['email']) !== mb_strtolower($utilisateur->email);

        if ($nouvelEmail) {
            $valide['email_verified_at'] = null;

            // Un jeton délivré pour l'ancienne adresse ne doit pas survivre au
            // changement : la session en cours appartenait à l'autre adresse.
            $utilisateur->tokens()->delete();
        }

        $utilisateur->update($valide);

        if ($nouvelEmail) {
            $this->notificateur->envoyer(
                new VerifierEmail($utilisateur->fresh()),
                ['user_id' => $utilisateur->id, 'motif' => 'changement d\'adresse'],
            );

            Log::info('Adresse changée, vérification redemandée', [
                'user' => $utilisateur->id,
                'par' => $request->user()?->id,
            ]);
        }

        // A suspended account must not keep working through an existing token.
        if (($valide['statut'] ?? null) === 'suspendu') {
            $utilisateur->tokens()->delete();
        }

        return response()->json([
            'message' => 'Utilisateur mis à jour.',
            'data' => $this->presenter($utilisateur->refresh()),
        ]);
    }

    /**
     * Confirme une adresse à la place de son titulaire.
     *
     * Indispensable dès le premier jour. Un verrou sans clé de secours finit
     * toujours par enfermer quelqu'un : l'email part en indésirables chez un
     * fournisseur local, la boîte est pleine, l'adresse a été mal tapée à
     * l'inscription. Sans ce bouton, la seule issue serait une intervention en
     * base de données — c'est-à-dire nous, un dimanche.
     *
     * Le geste est tracé : qui a confirmé, pour qui.
     */
    public function verifierEmail(Request $request, User $utilisateur): JsonResponse
    {
        if ($utilisateur->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Cette adresse était déjà confirmée.',
                'data' => $this->presenter($utilisateur),
            ]);
        }

        $utilisateur->markEmailAsVerified();

        Log::info('Adresse confirmée par un administrateur', [
            'user' => $utilisateur->id,
            'par' => $request->user()?->id,
        ]);

        return response()->json([
            'message' => 'Adresse confirmée. Cette personne peut maintenant se connecter.',
            'data' => $this->presenter($utilisateur->refresh()),
        ]);
    }

    public function destroy(Request $request, User $utilisateur): JsonResponse
    {
        if ($utilisateur->id === $request->user()->id) {
            return response()->json([
                'message' => 'Vous ne pouvez pas supprimer votre propre compte.',
            ], 422);
        }

        if ($this->dernierAdministrateur($utilisateur)) {
            return response()->json([
                'message' => 'Impossible de supprimer le dernier administrateur.',
            ], 422);
        }

        $utilisateur->delete();

        return response()->json(['message' => 'Utilisateur supprimé.']);
    }

    /**
     * Stops an administrator locking everyone out of the back office by
     * demoting or suspending themselves, or the last remaining admin.
     *
     * Returns the refusal message, or null when the change is allowed.
     */
    private function refuserAutoDestruction(Request $request, User $cible, array $valide): ?string
    {
        $seDegrade = $cible->id === $request->user()->id
            && (($valide['role'] ?? $cible->role->value) !== RoleUtilisateur::Administrateur->value
                || ($valide['statut'] ?? 'actif') === 'suspendu');

        if ($seDegrade && $cible->role === RoleUtilisateur::Administrateur) {
            return 'Vous ne pouvez pas retirer vos propres droits administrateur.';
        }

        $perdLesDroits = ($valide['role'] ?? null) !== null
            && $valide['role'] !== RoleUtilisateur::Administrateur->value;

        if ($perdLesDroits && $this->dernierAdministrateur($cible)) {
            return 'Impossible de retirer les droits du dernier administrateur.';
        }

        return null;
    }

    private function dernierAdministrateur(User $user): bool
    {
        return $user->role === RoleUtilisateur::Administrateur
            && User::where('role', RoleUtilisateur::Administrateur->value)->count() <= 1;
    }

    private function presenter(User $user): array
    {
        return [
            'id' => $user->id,
            'nom' => $user->name,
            'email' => $user->email,
            'telephone' => $user->telephone,
            'role' => $user->role->value,
            'role_label' => $user->role->label(),
            'statut' => $user->statut,
            'photo' => $user->photo,
            'email_verifie' => $user->hasVerifiedEmail(),
            'email_verifie_le' => $user->email_verified_at?->toIso8601String(),
            'inscriptions_count' => $user->inscriptions_count ?? 0,
            'derniere_connexion_le' => $user->derniere_connexion_le?->toIso8601String(),
            'created_at' => $user->created_at->toIso8601String(),
        ];
    }

    private function resume(): array
    {
        $parRole = User::selectRaw('role, count(*) as total')->groupBy('role')->pluck('total', 'role');

        return [
            'total' => (int) $parRole->sum(),
            'actifs' => User::where('statut', 'actif')->count(),
            'suspendus' => User::where('statut', 'suspendu')->count(),
            ...collect(RoleUtilisateur::cases())
                ->mapWithKeys(fn ($r) => [$r->value => (int) ($parRole[$r->value] ?? 0)])
                ->all(),
        ];
    }
}
