<?php

namespace App\Exceptions;

use App\Models\Formation;
use Exception;

class PlacesEpuiseesException extends Exception
{
    public function __construct(public readonly Formation $formation)
    {
        parent::__construct("La formation « {$formation->titre} » n'a plus de places disponibles.");
    }
}
