<?php

namespace Tests\Feature\Admin;

use App\Enums\RoleUtilisateur;
use App\Models\Edition;
use App\Models\Formation;
use App\Models\User;
use App\Services\GestionImages;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ImageAdminTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private Formation $formation;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake(GestionImages::DISQUE);

        $this->admin = User::factory()->create(['role' => RoleUtilisateur::Administrateur]);
        $this->formation = Formation::factory()->for(Edition::factory()->active())->create(['image' => null]);
    }

    public function test_ladmin_televerse_une_image(): void
    {
        $reponse = $this->actingAs($this->admin)
            ->postJson("/api/admin/images/formations/{$this->formation->id}", [
                'image' => UploadedFile::fake()->image('portrait.jpg'),
            ])
            ->assertOk()
            ->assertJsonStructure(['message', 'chemin', 'url']);

        $chemin = $reponse->json('chemin');

        Storage::disk(GestionImages::DISQUE)->assertExists($chemin);
        $this->assertSame($chemin, $this->formation->refresh()->image);
    }

    public function test_le_nom_du_fichier_envoye_ninfluence_pas_le_chemin(): void
    {
        // A crafted name must never reach the filesystem: the stored name is
        // random and the extension comes from the file's own bytes.
        $reponse = $this->actingAs($this->admin)
            ->postJson("/api/admin/images/formations/{$this->formation->id}", [
                'image' => UploadedFile::fake()->image('../../evil.jpg'),
            ])
            ->assertOk();

        $chemin = $reponse->json('chemin');

        $this->assertStringNotContainsString('..', $chemin);
        $this->assertStringNotContainsString('evil', $chemin);
        $this->assertStringStartsWith('formations/', $chemin);
    }

    public function test_remplacer_une_image_supprime_lancienne(): void
    {
        $premier = $this->actingAs($this->admin)
            ->postJson("/api/admin/images/formations/{$this->formation->id}", [
                'image' => UploadedFile::fake()->image('un.jpg'),
            ])->json('chemin');

        $second = $this->actingAs($this->admin)
            ->postJson("/api/admin/images/formations/{$this->formation->id}", [
                'image' => UploadedFile::fake()->image('deux.jpg'),
            ])->json('chemin');

        // Otherwise every correction leaves a file nobody will ever delete.
        Storage::disk(GestionImages::DISQUE)->assertMissing($premier);
        Storage::disk(GestionImages::DISQUE)->assertExists($second);
    }

    public function test_un_pdf_est_refuse(): void
    {
        $this->actingAs($this->admin)
            ->postJson("/api/admin/images/formations/{$this->formation->id}", [
                'image' => UploadedFile::fake()->create('cv.pdf', 100, 'application/pdf'),
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('image');
    }

    public function test_un_fichier_trop_lourd_est_refuse(): void
    {
        $this->actingAs($this->admin)
            ->postJson("/api/admin/images/formations/{$this->formation->id}", [
                'image' => UploadedFile::fake()->image('enorme.jpg')->size(GestionImages::TAILLE_MAX_KO + 1),
            ])
            ->assertStatus(422)
            ->assertJsonValidationErrors('image');
    }

    public function test_un_type_inconnu_est_refuse(): void
    {
        // The type picks a model and a column, so it cannot be free text.
        $this->actingAs($this->admin)
            ->postJson('/api/admin/images/utilisateurs/1', [
                'image' => UploadedFile::fake()->image('portrait.jpg'),
            ])
            ->assertStatus(422);
    }

    public function test_un_non_administrateur_ne_peut_pas_televerser(): void
    {
        $demandeur = User::factory()->create(['role' => RoleUtilisateur::Demandeur]);

        $this->actingAs($demandeur)
            ->postJson("/api/admin/images/formations/{$this->formation->id}", [
                'image' => UploadedFile::fake()->image('portrait.jpg'),
            ])
            ->assertForbidden();
    }

    public function test_supprimer_une_image_vide_la_colonne(): void
    {
        $chemin = $this->actingAs($this->admin)
            ->postJson("/api/admin/images/formations/{$this->formation->id}", [
                'image' => UploadedFile::fake()->image('portrait.jpg'),
            ])->json('chemin');

        $this->actingAs($this->admin)
            ->deleteJson("/api/admin/images/formations/{$this->formation->id}")
            ->assertOk();

        Storage::disk(GestionImages::DISQUE)->assertMissing($chemin);
        $this->assertNull($this->formation->refresh()->image);
    }

    public function test_supprimer_une_image_livree_avec_le_site_ne_casse_rien(): void
    {
        // Seeded content points at files shipped with the frontend; unlinking
        // those is not this service's business.
        $this->formation->forceFill(['image' => '/images/formation-1.webp'])->save();

        $this->actingAs($this->admin)
            ->deleteJson("/api/admin/images/formations/{$this->formation->id}")
            ->assertOk();

        $this->assertNull($this->formation->refresh()->image);
    }
}
