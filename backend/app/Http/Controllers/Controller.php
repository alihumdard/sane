<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

abstract class Controller
{
    // Lets controllers call $this->authorize(), which the Phase 6 policies
    // (OffrePolicy, CandidaturePolicy) rely on for cross-company isolation.
    use AuthorizesRequests;
}
