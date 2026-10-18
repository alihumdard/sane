<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Owns where editorial images live and how they are named.
 *
 * Deliberately not GestionDocuments: a speaker's portrait or a partner's logo
 * is published material, meant to be fetched by any visitor's browser from a
 * plain URL. Identity papers and CVs are the opposite — private disk, no URL,
 * streamed through an authorised route — and sharing one service would invite
 * someone to put a diploma on the public disk by passing the wrong constant.
 *
 * Stored names are random. The original is not kept: nothing displays it, and
 * a crafted filename must never influence the path written to.
 */
class GestionImages
{
    public const DISQUE = 'public';

    /** Matches the `image` validation rule, and what browsers render reliably. */
    public const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

    public const TAILLE_MAX_KO = 2048;

    /**
     * Store an image under the given folder and return its public path.
     *
     * The previous file, if any, is deleted after the new one is written, so a
     * failure part-way leaves the record pointing at a file that exists rather
     * than at nothing.
     */
    public function enregistrer(UploadedFile $fichier, string $dossier, ?string $ancien = null): string
    {
        $chemin = $fichier->storeAs(
            $dossier,
            $this->nomDeFichier($fichier),
            ['disk' => self::DISQUE],
        );

        if ($ancien) {
            $this->supprimer($ancien);
        }

        return $chemin;
    }

    /**
     * Remove an image previously stored here.
     *
     * Paths that do not come from this service are ignored: the seeded content
     * points at files shipped with the frontend (/images/...), and deleting a
     * record must not try to unlink those.
     */
    public function supprimer(?string $chemin): void
    {
        if (! $chemin || ! Storage::disk(self::DISQUE)->exists($chemin)) {
            return;
        }

        Storage::disk(self::DISQUE)->delete($chemin);
    }

    /**
     * The extension is taken from the file's own bytes rather than its name:
     * a browser will happily send "portrait.png" for a JPEG, and the stored
     * name should say what the file actually is.
     */
    private function nomDeFichier(UploadedFile $fichier): string
    {
        $extension = $fichier->guessExtension() ?: $fichier->getClientOriginalExtension();

        return Str::uuid().'.'.Str::lower($extension);
    }
}
