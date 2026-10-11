<?php

namespace Tests\Feature;

use App\Enums\StatutInscription;
use App\Enums\TypeDocument;
use App\Models\DocumentInscription;
use App\Models\Edition;
use App\Models\Inscription;
use App\Services\GestionDocuments;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class DocumentApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake(GestionDocuments::DISQUE);
    }

    private function inscription(array $surcharges = []): Inscription
    {
        $edition = Edition::factory()->active()->create();

        return Inscription::factory()->for($edition)->create([
            'email' => 'aminata@example.com',
            'statut' => StatutInscription::EnAttente,
            ...$surcharges,
        ]);
    }

    private function url(Inscription $inscription): string
    {
        return '/api/inscriptions/'.rawurlencode($inscription->reference).'/documents';
    }

    private function pdf(string $nom = 'cv.pdf', int $ko = 100): UploadedFile
    {
        return UploadedFile::fake()->create($nom, $ko, 'application/pdf');
    }

    public function test_un_document_valide_est_enregistre(): void
    {
        $inscription = $this->inscription();

        $response = $this->postJson($this->url($inscription), [
            'email' => $inscription->email,
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf(),
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.type', 'cv')
            ->assertJsonPath('data.nom_original', 'cv.pdf');

        $document = $inscription->documents()->sole();

        $this->assertSame(TypeDocument::Cv, $document->type);
        Storage::disk(GestionDocuments::DISQUE)->assertExists($document->chemin);
    }

    public function test_un_email_different_est_refuse(): void
    {
        $inscription = $this->inscription();

        $this->postJson($this->url($inscription), [
            'email' => 'intrus@example.com',
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf(),
        ])->assertForbidden();

        $this->assertSame(0, $inscription->documents()->count());
    }

    public function test_lemail_est_compare_sans_tenir_compte_de_la_casse(): void
    {
        $inscription = $this->inscription();

        $this->postJson($this->url($inscription), [
            'email' => 'AMINATA@EXAMPLE.COM',
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf(),
        ])->assertCreated();
    }

    public function test_un_fichier_deguise_en_pdf_est_refuse(): void
    {
        $inscription = $this->inscription();

        // A real file on disk, not UploadedFile::fake(): the fake helper reports
        // its mime from the name it was given, so it could never exercise the
        // content sniffing this test exists to cover.
        $chemin = tempnam(sys_get_temp_dir(), 'piege').'.pdf';
        file_put_contents($chemin, "MZ\x90\x00\x03 charge utile windows");

        $this->postJson($this->url($inscription), [
            'email' => $inscription->email,
            'type' => TypeDocument::Cv->value,
            'fichier' => new UploadedFile($chemin, 'piege.pdf', 'application/pdf', null, true),
        ])->assertStatus(422)->assertJsonValidationErrors('fichier');

        @unlink($chemin);

        $this->assertSame(0, $inscription->documents()->count());
    }

    public function test_un_fichier_trop_volumineux_est_refuse(): void
    {
        $inscription = $this->inscription();

        $this->postJson($this->url($inscription), [
            'email' => $inscription->email,
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf('gros.pdf', TypeDocument::TAILLE_MAX_KO + 1),
        ])->assertStatus(422)->assertJsonValidationErrors('fichier');
    }

    public function test_un_type_inconnu_est_refuse(): void
    {
        $inscription = $this->inscription();

        $this->postJson($this->url($inscription), [
            'email' => $inscription->email,
            'type' => 'passeport_diplomatique',
            'fichier' => $this->pdf(),
        ])->assertStatus(422)->assertJsonValidationErrors('type');
    }

    public function test_un_renvoi_remplace_le_document_et_son_fichier(): void
    {
        $inscription = $this->inscription();

        $this->postJson($this->url($inscription), [
            'email' => $inscription->email,
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf('premier.pdf'),
        ])->assertCreated();

        $premier = $inscription->documents()->sole();

        $this->postJson($this->url($inscription), [
            'email' => $inscription->email,
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf('second.pdf'),
        ])->assertCreated();

        $document = $inscription->documents()->sole();

        $this->assertSame($premier->id, $document->id);
        $this->assertSame('second.pdf', $document->nom_original);

        // The superseded file must not be left behind on disk.
        Storage::disk(GestionDocuments::DISQUE)->assertMissing($premier->chemin);
        Storage::disk(GestionDocuments::DISQUE)->assertExists($document->chemin);
    }

    public function test_aucun_envoi_sur_une_inscription_deja_traitee(): void
    {
        $inscription = $this->inscription(['statut' => StatutInscription::Confirmee]);

        $this->postJson($this->url($inscription), [
            'email' => $inscription->email,
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf(),
        ])->assertStatus(409);
    }

    public function test_le_nom_de_fichier_ne_decide_pas_du_chemin(): void
    {
        $inscription = $this->inscription();

        $this->postJson($this->url($inscription), [
            'email' => $inscription->email,
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf('../../../../evil.pdf'),
        ])->assertCreated();

        $chemin = $inscription->documents()->sole()->chemin;

        $this->assertStringStartsWith('documents/inscriptions/'.$inscription->id.'/', $chemin);
        $this->assertStringNotContainsString('..', $chemin);
    }

    public function test_la_liste_exige_le_bon_email(): void
    {
        $inscription = $this->inscription();

        $this->getJson($this->url($inscription).'?email=intrus@example.com')
            ->assertForbidden();

        $this->getJson($this->url($inscription).'?email='.$inscription->email)
            ->assertOk()
            ->assertJsonCount(count(TypeDocument::cases()), 'requis');
    }

    public function test_la_reponse_publique_nexpose_jamais_le_chemin(): void
    {
        $inscription = $this->inscription();

        $this->postJson($this->url($inscription), [
            'email' => $inscription->email,
            'type' => TypeDocument::Cv->value,
            'fichier' => $this->pdf(),
        ])->assertCreated()->assertJsonMissingPath('data.chemin');
    }

    public function test_le_telechargement_admin_exige_une_authentification(): void
    {
        $inscription = $this->inscription();

        $document = DocumentInscription::factory()->for($inscription)->create();

        $this->getJson('/api/admin/documents/'.$document->id.'/telecharger')
            ->assertUnauthorized();

        $this->deleteJson('/api/admin/documents/'.$document->id)
            ->assertUnauthorized();
    }
}
