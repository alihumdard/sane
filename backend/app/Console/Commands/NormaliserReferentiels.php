<?php

namespace App\Console\Commands;

use App\Support\Referentiels;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

/**
 * Rewrites sectors and nationalities onto the shared lists.
 *
 * Until these lists were shared, each form had invented its own wording: a
 * registration said "Informatique et numérique" while a job offer said
 * "Informatique & Digital". MoteurMatching compares the two as text and awards
 * 30 of its 100 points — the single largest weight — for an exact match, so
 * every such pair scored zero for the strongest signal it has.
 *
 * Only values this map names are touched; anything else is left alone and
 * reported, because guessing at a value nobody recognises is how data gets
 * quietly destroyed. Run with --dry-run first.
 */
class NormaliserReferentiels extends Command
{
    protected $signature = 'sanem:normaliser-referentiels {--dry-run : Affiche les changements sans les appliquer}';

    protected $description = 'Aligne les secteurs et nationalités enregistrés sur les listes partagées';

    /** Old wording => its entry in Referentiels::SECTEURS. */
    private const SECTEURS = [
        'Informatique & Digital' => 'Informatique & Numérique',
        'Informatique et numérique' => 'Informatique & Numérique',
        'Administration & Gestion' => 'Administration publique',
        'Projets & Développement' => 'Humanitaire & ONG',
        'Agriculture & Environnement' => 'Agriculture & Élevage',
        'Agriculture' => 'Agriculture & Élevage',
        'Communication' => 'Communication, Médias & Culture',
        'Santé' => 'Santé & Action sociale',
        'Éducation' => 'Éducation & Formation',
        'Éducation & Formation' => 'Éducation & Formation',
        'Gestion et finance' => 'Banque, Assurance & Microfinance',
    ];

    /** Country names => the demonym the list now uses. */
    private const NATIONALITES = [
        'Niger' => 'Nigérienne',
        'Nigeria' => 'Nigériane',
        'Mali' => 'Malienne',
        'Burkina Faso' => 'Burkinabè',
        'Sénégal' => 'Sénégalaise',
        'Bénin' => 'Béninoise',
        'Togo' => 'Togolaise',
        'Tchad' => 'Tchadienne',
        "Côte d'Ivoire" => 'Ivoirienne',
        'France' => 'Française',
    ];

    /** Every column holding one of these values. */
    private const COLONNES = [
        ['offres_emploi', 'secteur', 'secteurs'],
        ['entreprises', 'secteur', 'secteurs'],
        ['profils_demandeur', 'secteur', 'secteurs'],
        ['inscriptions', 'domaine', 'secteurs'],
        ['inscriptions', 'nationalite', 'nationalites'],
    ];

    public function handle(): int
    {
        $simulation = (bool) $this->option('dry-run');
        $total = 0;
        $inconnus = [];

        foreach (self::COLONNES as [$table, $colonne, $type]) {
            $carte = $type === 'secteurs' ? self::SECTEURS : self::NATIONALITES;
            $connus = $type === 'secteurs' ? Referentiels::SECTEURS : Referentiels::nationalites();

            $valeurs = DB::table($table)
                ->select($colonne, DB::raw('count(*) as n'))
                ->whereNotNull($colonne)
                ->groupBy($colonne)
                ->get();

            foreach ($valeurs as $ligne) {
                $ancienne = $ligne->{$colonne};

                if (in_array($ancienne, $connus, true)) {
                    continue;
                }

                $nouvelle = $carte[$ancienne] ?? null;

                if ($nouvelle === null) {
                    // Left as it is: a value nobody mapped may be something a
                    // user typed, and overwriting it would lose information.
                    $inconnus[] = "{$table}.{$colonne} : « {$ancienne} » ({$ligne->n})";

                    continue;
                }

                $this->line(sprintf(
                    '  %-28s %-34s → %s  (%d)',
                    "{$table}.{$colonne}",
                    $ancienne,
                    $nouvelle,
                    $ligne->n,
                ));

                if (! $simulation) {
                    DB::table($table)->where($colonne, $ancienne)->update([$colonne => $nouvelle]);
                }

                $total += $ligne->n;
            }
        }

        if ($inconnus !== []) {
            $this->newLine();
            $this->warn('Valeurs non reconnues, laissées telles quelles :');
            foreach ($inconnus as $v) {
                $this->line("  {$v}");
            }
        }

        $this->newLine();
        $this->info($simulation
            ? "{$total} ligne(s) seraient modifiées. Relancez sans --dry-run pour appliquer."
            : "{$total} ligne(s) mises à jour.");

        return self::SUCCESS;
    }
}
