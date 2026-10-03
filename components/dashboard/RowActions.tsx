import { Copy, Download, Eye, Link2, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { TableApi, TableRow } from "./useTable";

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: TableApi<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  row: TableRow<any>;
  /** optional extra button: duplicate the row or copy a link */
  extra?: "duplicate" | "link" | "download";
}

export default function RowActions({ table, row, extra }: Props) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <button type="button" title="Voir" onClick={() => table.openView(row)} className="text-[#2563EB] hover:opacity-80"><Eye size={13} /></button>
      <button type="button" title="Modifier" onClick={() => table.openEdit(row)} className="text-[#10632D] hover:opacity-80"><Pencil size={13} /></button>
      {extra === "duplicate" && (
        <button type="button" title="Dupliquer" onClick={() => table.duplicate(row)} className="text-[#61756B] hover:opacity-80"><Copy size={13} /></button>
      )}
      {extra === "download" && (
        <button
          type="button"
          title="Télécharger"
          onClick={() => {
            const rec = row as Record<string, unknown>;
            const lines = Object.entries(rec)
              .filter(([k, v]) => k !== "_uid" && (typeof v === "string" || typeof v === "number"))
              .map(([k, v]) => `"${k}";"${String(v).replace(/"/g, '""')}"`);
            const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `${String(rec.title ?? rec.nom ?? "export").replace(/[^\w-]+/g, "_")}.csv`;
            a.click();
            URL.revokeObjectURL(a.href);
            table.notify("Téléchargement lancé");
          }}
          className="text-[#61756B] hover:opacity-80"
        >
          <Download size={13} />
        </button>
      )}
      {extra === "link" && (
        <button
          type="button"
          title="Copier le lien"
          onClick={() => {
            navigator.clipboard?.writeText(`${window.location.origin}${window.location.pathname}#${row._uid}`);
            table.notify("Lien copié");
          }}
          className="text-[#61756B] hover:opacity-80"
        >
          <Link2 size={13} />
        </button>
      )}
      <button type="button" title="Supprimer" onClick={() => table.askDelete([row._uid])} className="text-[#DC2626] hover:opacity-80"><Trash2 size={13} /></button>
      <button type="button" title="Détails" onClick={() => table.openView(row)} className="text-[#61756B] hover:opacity-80"><MoreVertical size={13} /></button>
    </div>
  );
}
