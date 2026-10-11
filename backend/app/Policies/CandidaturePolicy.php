<?php

namespace App\Policies;

use App\Models\Candidature;
use App\Models\User;

/**
 * An application is visible to the candidate who sent it and to the company
 * that received it — nobody else, including other recruiters.
 */
class CandidaturePolicy
{
    public function before(User $user): ?bool
    {
        return $user->role->estAdministratif() ? true : null;
    }

    public function view(User $user, Candidature $candidature): bool
    {
        return $this->estCandidat($user, $candidature)
            || $this->estDestinataire($user, $candidature);
    }

    /** Only the receiving company moves an application through its statuses. */
    public function update(User $user, Candidature $candidature): bool
    {
        return $this->estDestinataire($user, $candidature);
    }

    /** The CV travels with the application, so the same rule governs it. */
    public function downloadCv(User $user, Candidature $candidature): bool
    {
        return $this->view($user, $candidature);
    }

    private function estCandidat(User $user, Candidature $candidature): bool
    {
        return $user->profilDemandeur?->id === $candidature->profil_id;
    }

    private function estDestinataire(User $user, Candidature $candidature): bool
    {
        $entreprise = $user->entrepriseActive();

        if ($entreprise === null) {
            return false;
        }

        return $candidature->offre()->where('entreprise_id', $entreprise->id)->exists();
    }
}
