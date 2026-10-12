<?php

namespace App\Services;

use App\Enums\TypeDocument;
use App\Models\DocumentInscription;
use App\Models\Inscription;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class GestionDocuments
{
    /** Identity papers and CVs are not public files; they are served through the API. */
    public const DISQUE = 'local';

    /**
     * Store a file in one of the registration's four slots, replacing whatever
     * was there. The old file is deleted only after the new row is committed,
     * so a failure mid-way cannot leave the record pointing at nothing.
     */
    public function enregistrer(
        Inscription $inscription,
        TypeDocument $type,
        UploadedFile $fichier,
    ): DocumentInscription {
        $chemin = $fichier->store("inscriptions/{$inscription->id}", self::DISQUE);

        $ancien = null;

        try {
            $document = DB::transaction(function () use ($inscription, $type, $fichier, $chemin, &$ancien) {
                $ancien = $inscription->documents()->where('type', $type->value)->first();
                $ancien?->delete();

                return $inscription->documents()->create([
                    'type' => $type,
                    'nom_original' => $fichier->getClientOriginalName(),
                    'chemin' => $chemin,
                    'mime' => $fichier->getClientMimeType(),
                    'taille' => $fichier->getSize(),
                ]);
            });
        } catch (\Throwable $e) {
            Storage::disk(self::DISQUE)->delete($chemin);
            throw $e;
        }

        if ($ancien) {
            Storage::disk(self::DISQUE)->delete($ancien->chemin);
        }

        return $document;
    }

    public function supprimer(DocumentInscription $document): void
    {
        $chemin = $document->chemin;
        $document->delete();
        Storage::disk(self::DISQUE)->delete($chemin);
    }

    /** Which of the required slots are still empty. */
    public function manquants(Inscription $inscription): array
    {
        $fournis = $inscription->documents->pluck('type.value')->all();

        return collect(TypeDocument::cases())
            ->filter(fn (TypeDocument $t) => $t->obligatoire() && ! in_array($t->value, $fournis, true))
            ->map(fn (TypeDocument $t) => ['type' => $t->value, 'label' => $t->label()])
            ->values()
            ->all();
    }
}
