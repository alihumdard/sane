<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;

/**
 * A daily copy of what cannot be rebuilt.
 *
 * Two things: the database, and everything under storage/app — the logos,
 * portraits and course visuals on the public disk, and on the private one
 * the identity papers and CVs attached to registrations. Everything else on
 * this server comes back from git and a build.
 *
 * The archive is written outside the application directory so a careless
 * `rm -rf` on the deploy folder cannot take the backups with it, and it is
 * readable by its owner alone: it holds a full dump of personal data.
 *
 * Old archives are removed by age rather than by count, so a week when the
 * scheduler did not run cannot silently shorten the history.
 */
class SauvegarderLaPlateforme extends Command
{
    protected $signature = 'sanem:sauvegarder
        {--dossier= : Où écrire les archives (défaut : SAUVEGARDE_DOSSIER ou storage/sauvegardes)}
        {--jours=14 : Combien de jours d\'archives conserver}';

    protected $description = 'Archive la base de données et les fichiers téléversés';

    public function handle(): int
    {
        $dossier = $this->option('dossier')
            ?: config('sauvegarde.dossier');

        if (! is_dir($dossier) && ! @mkdir($dossier, 0700, true) && ! is_dir($dossier)) {
            $this->error("Dossier de sauvegarde inaccessible : {$dossier}");

            return self::FAILURE;
        }

        @chmod($dossier, 0700);

        $horodatage = now()->format('Y-m-d_His');
        $base = rtrim($dossier, '/\\').DIRECTORY_SEPARATOR.'sanem_'.$horodatage;

        $sql = $base.'.sql';
        $archive = $base.'.tar.gz';

        if (! $this->viderLaBase($sql)) {
            return self::FAILURE;
        }

        if (! $this->empaqueter($sql, $archive)) {
            @unlink($sql);

            return self::FAILURE;
        }

        // The plain dump only existed to be packed; it is the archive that is
        // kept, and leaving the .sql beside it doubles the personal data at
        // rest for no benefit.
        @unlink($sql);
        @chmod($archive, 0600);

        $taille = $this->lisible((int) filesize($archive));
        $this->info("Sauvegarde écrite : {$archive} ({$taille})");

        Log::info('Sauvegarde effectuée', ['archive' => $archive, 'taille' => $taille]);

        $this->purger($dossier, max(1, (int) $this->option('jours')));

        return self::SUCCESS;
    }

    /** pg_dump into a plain file, with the credentials passed out of band. */
    private function viderLaBase(string $destination): bool
    {
        $processus = new Process(
            [
                'pg_dump',
                '--host='.config('database.connections.pgsql.host'),
                '--port='.config('database.connections.pgsql.port'),
                '--username='.config('database.connections.pgsql.username'),
                '--no-password',
                '--format=plain',
                '--file='.$destination,
                config('database.connections.pgsql.database'),
            ],
            env: ['PGPASSWORD' => (string) config('database.connections.pgsql.password')] + $_ENV,
            timeout: 600,
        );

        $processus->run();

        if (! $processus->isSuccessful()) {
            $this->error('pg_dump a échoué : '.trim($processus->getErrorOutput()));
            Log::error('Sauvegarde : pg_dump a échoué', ['erreur' => $processus->getErrorOutput()]);

            return false;
        }

        return true;
    }

    /**
     * The dump and every uploaded file, in one compressed archive.
     *
     * `storage/app` whole, not the public disk alone: the files that matter
     * most sit on the private one — the CVs and identity papers attached to
     * registrations, deliberately unreachable over the web, and therefore
     * exactly the ones a public-disk backup left behind.
     */
    private function empaqueter(string $sql, string $archive): bool
    {
        $uploads = storage_path('app');

        $arguments = [
            'tar',
            '--create',
            '--gzip',
            '--file='.$archive,
            '--directory='.dirname($sql),
            basename($sql),
        ];

        // A fresh installation has nothing uploaded yet, and tar refuses a
        // path that is not there rather than skipping it.
        if (is_dir($uploads)) {
            $arguments[] = '--directory='.dirname($uploads);
            $arguments[] = basename($uploads);
        }

        $processus = new Process($arguments, timeout: 600);
        $processus->run();

        if (! $processus->isSuccessful()) {
            $this->error('tar a échoué : '.trim($processus->getErrorOutput()));
            Log::error('Sauvegarde : tar a échoué', ['erreur' => $processus->getErrorOutput()]);

            return false;
        }

        return true;
    }

    /** Archives older than `$jours` days go. */
    private function purger(string $dossier, int $jours): void
    {
        $limite = now()->subDays($jours)->getTimestamp();
        $retirees = 0;

        foreach (glob(rtrim($dossier, '/\\').DIRECTORY_SEPARATOR.'sanem_*.tar.gz') ?: [] as $fichier) {
            if (filemtime($fichier) < $limite) {
                @unlink($fichier);
                $retirees++;
            }
        }

        if ($retirees > 0) {
            $this->line("{$retirees} archive(s) de plus de {$jours} jours retirée(s).");
        }
    }

    private function lisible(int $octets): string
    {
        foreach (['o', 'Ko', 'Mo', 'Go'] as $unite) {
            if ($octets < 1024) {
                return round($octets, 1).' '.$unite;
            }

            $octets /= 1024;
        }

        return round($octets, 1).' To';
    }
}
