<?php

namespace App\Services;

use App\Enums\TypeDocument;
use App\Models\DocumentCandidature;
use App\Models\DocumentInscription;
use App\Models\Inscription;
use App\Models\ProfilDemandeur;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Owns where participant documents live and how they are named.
 *
 * Identity papers and CVs are personal data, so they are kept on the private
 * disk (storage/app/private) and never exposed by URL — reading one goes
 * through an authenticated route that streams it. Stored names are random:
 * the original name is kept in the database for display only, so a crafted
 * filename can never influence the path written to.
 */
class GestionDocuments
{
    public const DISQUE = 'local';

    /**
     * Replaces any document the inscription already has of this type — the
     * table is unique on (inscription_id, type), and a participant correcting
     * a bad scan should not be blocked by their first attempt.
     */
    public function enregistrer(
        Inscription $inscription,
        TypeDocument $type,
        UploadedFile $fichier,
    ): DocumentInscription {
        $chemin = $fichier->storeAs(
            $this->dossier($inscription),
            $this->nomDeFichier($fichier),
            ['disk' => self::DISQUE]
        );

        $document = DB::transaction(function () use ($inscription, $type, $fichier, $chemin) {
            $ancien = $inscription->documents()->where('type', $type->value)->first();

            $document = $inscription->documents()->updateOrCreate(
                ['type' => $type->value],
                [
                    'nom_original' => $this->nomPropre($fichier->getClientOriginalName()),
                    'chemin' => $chemin,
                    'mime' => $fichier->getClientMimeType(),
                    'taille' => $fichier->getSize(),
                ],
            );

            // Only once the row is safely pointing at the new file.
            if ($ancien && $ancien->chemin !== $chemin) {
                Storage::disk(self::DISQUE)->delete($ancien->chemin);
            }

            return $document;
        });

        return $document;
    }

    /**
     * Same storage guarantees for a jobseeker's CV, but kept as history rather
     * than replaced: a candidate may hold several CVs and pick one per
     * application, and an older one must stay readable by the recruiters who
     * already received it.
     */
    public function enregistrerPourProfil(
        ProfilDemandeur $profil,
        TypeDocument $type,
        UploadedFile $fichier,
    ): DocumentCandidature {
        $chemin = $fichier->storeAs(
            'documents/profils/'.$profil->id,
            $this->nomDeFichier($fichier),
            ['disk' => self::DISQUE]
        );

        return DB::transaction(function () use ($profil, $type, $fichier, $chemin) {
            // Newest upload of a type becomes the default one offered.
            $profil->documents()->where('type', $type->value)->update(['principal' => false]);

            return $profil->documents()->create([
                'type' => $type->value,
                'nom_original' => $this->nomPropre($fichier->getClientOriginalName()),
                'chemin' => $chemin,
                'mime' => $fichier->getClientMimeType(),
                'taille' => $fichier->getSize(),
                'principal' => true,
            ]);
        });
    }

    public function supprimerDocument(DocumentCandidature $document): void
    {
        $chemin = $document->chemin;

        $document->delete();

        Storage::disk(self::DISQUE)->delete($chemin);
    }

    public function supprimer(DocumentInscription $document): void
    {
        $chemin = $document->chemin;

        $document->delete();

        Storage::disk(self::DISQUE)->delete($chemin);
    }

    /** One folder per inscription, keyed by id rather than the printable reference. */
    private function dossier(Inscription $inscription): string
    {
        return 'documents/inscriptions/'.$inscription->id;
    }

    private function nomDeFichier(UploadedFile $fichier): string
    {
        $extension = $fichier->guessExtension() ?: 'bin';

        return Str::uuid().'.'.$extension;
    }

    /** Kept for display and for the download filename, so it must stay inert. */
    private function nomPropre(string $nom): string
    {
        return Str::limit(basename(str_replace('\\', '/', $nom)), 180, '');
    }
}
