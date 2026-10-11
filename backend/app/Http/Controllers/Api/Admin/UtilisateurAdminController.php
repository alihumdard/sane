<?php

namespace App\Http\Controllers\Api\Admin;

use App\Enums\RoleUtilisateur;
use App\Http\Concerns\FiltreLesListes;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

/** User, role and access management. */
class UtilisateurAdminController extends Controller
{
    use FiltreLesListes;

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

        $user = User::create([...$valide, 'statut' => 'actif']);

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

        $utilisateur->update($valide);

        // A suspended account must not keep working through an existing token.
        if (($valide['statut'] ?? null) === 'suspendu') {
            $utilisateur->tokens()->delete();
        }

        return response()->json([
            'message' => 'Utilisateur mis à jour.',
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
