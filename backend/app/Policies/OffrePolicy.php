<?php

namespace App\Policies;

use App\Models\OffreEmploi;
use App\Models\User;

/**
 * Cross-tenant isolation for job offers.
 *
 * Expressed as a policy rather than a `where` in each query: a forgotten
 * clause silently leaks another company's data, whereas a forgotten
 * authorize() call fails closed on the very first request that hits it.
 */
class OffrePolicy
{
    /** Organisers moderate the whole board; everything else is per-company. */
    public function before(User $user): ?bool
    {
        return $user->role->estAdministratif() ? true : null;
    }

    public function view(User $user, OffreEmploi $offre): bool
    {
        return $this->appartient($user, $offre);
    }

    public function update(User $user, OffreEmploi $offre): bool
    {
        return $this->appartient($user, $offre);
    }

    public function delete(User $user, OffreEmploi $offre): bool
    {
        return $this->appartient($user, $offre);
    }

    /**
     * Publishing is gated on verification: an unvetted company may draft
     * offers but not put them in front of jobseekers.
     */
    public function publish(User $user, OffreEmploi $offre): bool
    {
        return $this->appartient($user, $offre) && $offre->entreprise->verifiee;
    }

    /** Reading the applications sent to one of the company's own offers. */
    public function viewCandidatures(User $user, OffreEmploi $offre): bool
    {
        return $this->appartient($user, $offre);
    }

    private function appartient(User $user, OffreEmploi $offre): bool
    {
        $entreprise = $user->entrepriseActive();

        return $entreprise !== null && $entreprise->id === $offre->entreprise_id;
    }
}
