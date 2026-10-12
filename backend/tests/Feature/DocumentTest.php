<?php

namespace Tests\Feature;

use App\Enums\TypeDocument;
use App\Models\DocumentInscription;
use App\Models\Edition;
use App\Models\Inscription;
use App\Models\User;
use App\Services\GestionDocuments;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentTest extends TestCase
{
    use RefreshDatabase;

    private Inscription $inscription;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake(GestionDocuments::DISQUE);

        $this->inscription = Inscription::factory()
            ->for(Edition::factory()->active()->create())
            ->create();
    }

    private function url(string $suffixe = ''): string
    {
        return "/api/inscriptions/{$this->inscription->reference}/documents{$suffixe}";
    }

    private function pdf(string $nom = 'cv.pdf', int $ko = 100): UploadedFile
    {
        return UploadedFile::fake()->create($nom, $ko, 'application/pdf');
    }

    // --- Upload ------------------------------------------------------------

    public function test_un_cv_pdf_est_accepte(): void
    {
        $this->postJson($this->url(), [
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf(),
        ])
            ->assertCreated()
            ->assertJsonPath('data.type', TypeDocument::Cv->value)
            ->assertJsonPath('data.nom_original', 'cv.pdf');

        $this->assertDatabaseCount('documents_inscription', 1);

        $document = DocumentInscription::first();
        Storage::disk(GestionDocuments::DISQUE)->assertExists($document->chemin);
    }

    public function test_une_photo_jpg_est_acceptee(): void
    {
        $this->postJson($this->url(), [
            'type' => TypeDocument::Photo->value,
            'fichier' => UploadedFile::fake()->image('moi.jpg'),
        ])->assertCreated();
    }

    public function test_un_fichier_trop_lourd_est_refuse(): void
    {
        $this->postJson($this->url(), [
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf('gros.pdf', 3000),
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('fichier');

        $this->assertDatabaseCount('documents_inscription', 0);
    }

    public function test_un_cv_au_mauvais_format_est_refuse(): void
    {
        // The CV slot takes PDF only, so an image must be rejected even though
        // images are fine for the photo slot.
        $this->postJson($this->url(), [
            'type' => TypeDocument::Cv->value,
            'fichier' => UploadedFile::fake()->image('cv.png'),
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('fichier');
    }

    public function test_une_photo_pdf_est_refusee(): void
    {
        $this->postJson($this->url(), [
            'type' => TypeDocument::Photo->value,
            'fichier' => $this->pdf('photo.pdf'),
        ])->assertStatus(422);
    }

    public function test_un_type_inconnu_est_refuse(): void
    {
        $this->postJson($this->url(), [
            'type' => 'passeport_secret',
            'fichier' => $this->pdf(),
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('type');
    }

    public function test_une_reference_inconnue_renvoie_404(): void
    {
        $this->postJson('/api/inscriptions/INS9999-0001/documents', [
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf(),
        ])->assertNotFound();
    }

    // --- Replacing ---------------------------------------------------------

    public function test_reenvoyer_un_document_remplace_le_precedent(): void
    {
        $this->postJson($this->url(), [
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf('ancien.pdf'),
        ])->assertCreated();

        $ancienChemin = DocumentInscription::first()->chemin;

        $this->postJson($this->url(), [
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf('nouveau.pdf'),
        ])->assertCreated();

        // One row per slot, and the superseded file is gone from disk.
        $this->assertDatabaseCount('documents_inscription', 1);
        $this->assertSame('nouveau.pdf', DocumentInscription::first()->nom_original);
        Storage::disk(GestionDocuments::DISQUE)->assertMissing($ancienChemin);
    }

    public function test_les_quatre_emplacements_coexistent(): void
    {
        $fichiers = [
            [TypeDocument::PieceIdentite, $this->pdf('cni.pdf')],
            [TypeDocument::Cv, $this->pdf('cv.pdf')],
            [TypeDocument::LettreMotivation, $this->pdf('lettre.pdf')],
            [TypeDocument::Photo, UploadedFile::fake()->image('photo.jpg')],
        ];

        foreach ($fichiers as [$type, $fichier]) {
            $this->postJson($this->url(), ['type' => $type->value, 'fichier' => $fichier])
                ->assertCreated();
        }

        $this->assertDatabaseCount('documents_inscription', 4);
    }

    // --- Listing -----------------------------------------------------------

    public function test_la_liste_indique_les_documents_manquants(): void
    {
        $this->getJson($this->url())
            ->assertOk()
            ->assertJsonCount(0, 'data')
            // The cover letter is optional, so only three are owed.
            ->assertJsonCount(3, 'manquants')
            ->assertJsonCount(4, 'attendus');
    }

    public function test_un_document_fourni_sort_de_la_liste_des_manquants(): void
    {
        $this->postJson($this->url(), [
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf(),
        ])->assertCreated();

        $this->getJson($this->url())
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonCount(2, 'manquants');
    }

    public function test_la_lettre_de_motivation_nest_jamais_manquante(): void
    {
        $manquants = $this->getJson($this->url())->json('manquants');

        $this->assertNotContains(
            TypeDocument::LettreMotivation->value,
            array_column($manquants, 'type')
        );
    }

    // --- Deletion ----------------------------------------------------------

    public function test_un_document_peut_etre_supprime(): void
    {
        $this->postJson($this->url(), [
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf(),
        ])->assertCreated();

        $document = DocumentInscription::first();

        $this->deleteJson($this->url("/{$document->id}"))->assertOk();

        $this->assertDatabaseCount('documents_inscription', 0);
        Storage::disk(GestionDocuments::DISQUE)->assertMissing($document->chemin);
    }

    public function test_on_ne_peut_pas_supprimer_le_document_dune_autre_inscription(): void
    {
        $autre = Inscription::factory()->for($this->inscription->edition)->create();

        $this->postJson("/api/inscriptions/{$autre->reference}/documents", [
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf(),
        ])->assertCreated();

        $document = DocumentInscription::first();

        // Same document id, but reached through the wrong registration.
        $this->deleteJson($this->url("/{$document->id}"))->assertNotFound();

        $this->assertDatabaseCount('documents_inscription', 1);
    }

    // --- Download ----------------------------------------------------------

    public function test_le_telechargement_exige_une_authentification(): void
    {
        $this->postJson($this->url(), [
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf(),
        ])->assertCreated();

        $document = DocumentInscription::first();

        $this->get("/api/admin/inscriptions/{$this->inscription->id}/documents/{$document->id}")
            ->assertUnauthorized();
    }

    public function test_un_participant_ne_peut_pas_telecharger_les_documents(): void
    {
        $this->postJson($this->url(), [
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf(),
        ])->assertCreated();

        $document = DocumentInscription::first();

        $this->actingAs(User::factory()->create())
            ->get("/api/admin/inscriptions/{$this->inscription->id}/documents/{$document->id}")
            ->assertForbidden();
    }

    public function test_ladmin_peut_telecharger_un_document(): void
    {
        $this->postJson($this->url(), [
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf('mon-cv.pdf'),
        ])->assertCreated();

        $document = DocumentInscription::first();

        $this->actingAs(User::factory()->administrateur()->create())
            ->get("/api/admin/inscriptions/{$this->inscription->id}/documents/{$document->id}")
            ->assertOk()
            ->assertDownload('mon-cv.pdf');
    }

    public function test_un_document_dune_autre_inscription_nest_pas_telechargeable(): void
    {
        $autre = Inscription::factory()->for($this->inscription->edition)->create();

        $this->postJson("/api/inscriptions/{$autre->reference}/documents", [
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf(),
        ])->assertCreated();

        $document = DocumentInscription::first();

        $this->actingAs(User::factory()->administrateur()->create())
            ->get("/api/admin/inscriptions/{$this->inscription->id}/documents/{$document->id}")
            ->assertNotFound();
    }
}
