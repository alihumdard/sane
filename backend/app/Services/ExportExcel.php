<?php

namespace App\Services;

use App\Exports\GenericExport;
use Illuminate\Database\Eloquent\Builder;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

/**
 * Excel (.xlsx) export via maatwebsite/excel — the package the contract
 * names, producing a real spreadsheet (multiple sheets, column widths,
 * native types) rather than a CSV that merely opens in Excel.
 *
 * Shares ExportCsv's call shape (same column-map + transformer convention)
 * so RapportAdminController only changes which service it hands the query
 * to, not how it describes what to export.
 */
class ExportExcel
{
    /**
     * @param  array<string, string>  $colonnes  header label => attribute path
     * @param  (callable(object): array<string, mixed>)|null  $transformer
     */
    public function telecharger(
        Builder $query,
        array $colonnes,
        string $nomFichier,
        ?callable $transformer = null,
    ): BinaryFileResponse {
        return Excel::download(
            new GenericExport($query, $colonnes, $transformer),
            $nomFichier,
        );
    }
}
