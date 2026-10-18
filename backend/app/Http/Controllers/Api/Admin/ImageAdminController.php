<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Actualite;
use App\Models\Formateur;
use App\Models\Formation;
use App\Models\Partenaire;
use App\Services\GestionImages;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

/**
 * Uploads the one image an editorial record carries.
 *
 * One endpoint for all four rather than four near-identical ones: a speaker's
 * portrait, a course's banner, a news image and a partner's logo differ only
 * in which column holds the path. The type is matched against this map, so a
 * caller cannot name an arbitrary model or column.
 */
class ImageAdminController extends Controller
{
    /** type => [model, column, folder] */
    private const CIBLES = [
        'formateurs' => [Formateur::class, 'photo', 'intervenants'],
        'formations' => [Formation::class, 'image', 'formations'],
        'actualites' => [Actualite::class, 'image', 'actualites'],
        'partenaires' => [Partenaire::class, 'logo', 'partenaires'],
    ];

    public function __construct(private readonly GestionImages $images) {}

    public function store(Request $request, string $type, int $id): JsonResponse
    {
        $request->validate([
            'image' => [
                'required',
                'image',
                'mimes:'.implode(',', GestionImages::EXTENSIONS),
                'max:'.GestionImages::TAILLE_MAX_KO,
            ],
        ]);

        [$modele, $colonne, $dossier] = $this->cible($type);

        /** @var Model $enregistrement */
        $enregistrement = $modele::findOrFail($id);

        $chemin = $this->images->enregistrer(
            $request->file('image'),
            $dossier,
            $enregistrement->{$colonne},
        );

        $enregistrement->forceFill([$colonne => $chemin])->save();

        return response()->json([
            'message' => 'Image enregistrée.',
            'chemin' => $chemin,
            'url' => Storage::disk(GestionImages::DISQUE)->url($chemin),
        ]);
    }

    public function destroy(string $type, int $id): JsonResponse
    {
        [$modele, $colonne] = $this->cible($type);

        /** @var Model $enregistrement */
        $enregistrement = $modele::findOrFail($id);

        $this->images->supprimer($enregistrement->{$colonne});
        $enregistrement->forceFill([$colonne => null])->save();

        return response()->json(['message' => 'Image supprimée.']);
    }

    /** @return array{0: class-string<Model>, 1: string, 2: string} */
    private function cible(string $type): array
    {
        validator(['type' => $type], ['type' => [Rule::in(array_keys(self::CIBLES))]])->validate();

        return self::CIBLES[$type];
    }
}
