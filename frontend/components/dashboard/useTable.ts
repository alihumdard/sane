"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type TableRow<T> = T & { _uid: string };
export type ModalState<T> = { mode: "view" | "edit" | "add"; row?: TableRow<T> } | null;

/** Keys that hold styling / media info and are never shown as form fields. */
export const STYLE_KEY = /(color|bg|img|image|photo|logo|flag|icon|pct|avatar|^id$|^_uid$)/i;

type Rec = Record<string, unknown>;

interface Options {
  /** filter label -> row key, e.g. { "Catégorie": "categorie" } */
  filterKeys?: Record<string, string>;
  pageSize?: number;
  /** sortable columns: key -> value used to compare rows */
  sortGetters?: Record<string, (row: any) => string | number>; // eslint-disable-line @typescript-eslint/no-explicit-any
}

function nextId(rows: Rec[]): unknown {
  const ids = rows.map((r) => r.id).filter((v) => v !== undefined);
  if (!ids.length) return undefined;
  if (ids.every((v) => typeof v === "number")) return Math.max(...(ids as number[])) + 1;
  let max = 0;
  let prefix = "";
  let width = 0;
  for (const v of ids) {
    const m = /^(.*?)(\d+)$/.exec(String(v));
    if (m) {
      prefix = m[1];
      width = m[2].length;
      max = Math.max(max, parseInt(m[2], 10));
    }
  }
  return prefix + String(max + 1).padStart(width, "0");
}

export function useTable<T extends object>(initial: T[], options: Options = {}) {
  const { filterKeys = {}, pageSize: initialSize = 10, sortGetters = {} } = options;
  const counter = useRef(initial.length);
  const [rows, setRows] = useState<TableRow<T>[]>(() =>
    initial.map((r, i) => ({ ...r, _uid: `r${i}` }))
  );
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialSize);
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [modal, setModal] = useState<ModalState<T>>(null);
  const [confirm, setConfirm] = useState<string[] | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // sidebar "Ajouter ..." entries open the add form (?add=1 or custom event)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (new URLSearchParams(window.location.search).get("add") === "1") setModal({ mode: "add" });
    const open = () => setModal({ mode: "add" });
    window.addEventListener("admin:add", open);
    return () => window.removeEventListener("admin:add", open);
  }, []);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = rows.filter((r) => {
      const rec = r as Rec;
      if (q) {
        const hay = Object.entries(rec)
          .filter(([k, v]) => !STYLE_KEY.test(k) && (typeof v === "string" || typeof v === "number"))
          .map(([, v]) => String(v))
          .join(" ")
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      for (const [label, value] of Object.entries(filters)) {
        const key = filterKeys[label];
        if (value && key && String(rec[key]) !== value) return false;
      }
      return true;
    });
    const get = sort ? sortGetters[sort.key] : undefined;
    if (!sort || !get) return list;
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) => {
      const x = get(a);
      const y = get(b);
      if (typeof x === "number" && typeof y === "number") return (x - y) * dir;
      return String(x).localeCompare(String(y), "fr", { numeric: true }) * dir;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, query, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, totalPages);
  const pageRows = filtered.slice((current - 1) * pageSize, current * pageSize);

  const options_ = (label: string): string[] => {
    const key = filterKeys[label];
    if (!key) return [];
    return Array.from(new Set(rows.map((r) => String((r as Rec)[key] ?? "")).filter(Boolean)));
  };

  /** copy style siblings (e.g. catColor for categorie) from a row sharing the same value */
  const syncStyles = (rec: Rec, all: Rec[]): Rec => {
    const out = { ...rec };
    for (const key of Object.keys(rec)) {
      if (STYLE_KEY.test(key) || typeof rec[key] !== "string") continue;
      const sample = all.find((o) => o._uid !== rec._uid && o[key] === rec[key]);
      if (!sample) continue;
      const prefix = key.slice(0, 3).toLowerCase();
      for (const sk of Object.keys(sample)) {
        if (STYLE_KEY.test(sk) && sk.toLowerCase().startsWith(prefix) && /color|bg/i.test(sk)) out[sk] = sample[sk];
      }
    }
    if ("inscPct" in out && typeof out.inscriptions === "number" && typeof out.maxInscriptions === "number" && out.maxInscriptions > 0) {
      out.inscPct = Math.min(100, Math.round((out.inscriptions / out.maxInscriptions) * 100));
    }
    return out;
  };

  const save = (data: Rec) => {
    if (modal?.mode === "edit" && modal.row) {
      const uid = modal.row._uid;
      setRows((rs) => {
        const merged = syncStyles({ ...(rs.find((r) => r._uid === uid) as Rec), ...data, _uid: uid }, rs as Rec[]);
        return rs.map((r) => (r._uid === uid ? (merged as TableRow<T>) : r));
      });
      notify("Modifications enregistrées");
    } else if (modal?.mode === "add") {
      counter.current += 1;
      const uid = `r${counter.current}-${Date.now()}`;
      setRows((rs) => {
        const base: Rec = { ...(rs[0] as Rec), ...data, _uid: uid };
        const id = nextId(rs as Rec[]);
        if (id !== undefined) base.id = id;
        return [syncStyles(base, rs as Rec[]) as TableRow<T>, ...rs];
      });
      setPage(1);
      notify("Élément ajouté");
    }
    setModal(null);
  };

  const duplicate = (row: TableRow<T>) => {
    counter.current += 1;
    const uid = `r${counter.current}-${Date.now()}`;
    setRows((rs) => {
      const copy: Rec = { ...(row as Rec), _uid: uid };
      const id = nextId(rs as Rec[]);
      if (id !== undefined) copy.id = id;
      const idx = rs.findIndex((r) => r._uid === row._uid);
      const next = [...rs];
      next.splice(idx + 1, 0, copy as TableRow<T>);
      return next;
    });
    notify("Élément dupliqué");
  };

  /** patch one row in place (e.g. change a status) */
  const update = (uid: string, patch: Rec, message?: string) => {
    setRows((rs) =>
      rs.map((r) => (r._uid === uid ? (syncStyles({ ...(r as Rec), ...patch }, rs as Rec[]) as TableRow<T>) : r))
    );
    if (message) notify(message);
  };

  const askDelete = (uids: string[]) => uids.length && setConfirm(uids);
  const doDelete = () => {
    if (!confirm) return;
    setRows((rs) => rs.filter((r) => !confirm.includes(r._uid)));
    setSelected((s) => s.filter((u) => !confirm.includes(u)));
    notify(confirm.length > 1 ? `${confirm.length} éléments supprimés` : "Élément supprimé");
    setConfirm(null);
  };

  const toggle = (uid: string) =>
    setSelected((s) => (s.includes(uid) ? s.filter((u) => u !== uid) : [...s, uid]));
  const allSelected = pageRows.length > 0 && pageRows.every((r) => selected.includes(r._uid));
  const toggleAll = () =>
    setSelected((s) =>
      allSelected
        ? s.filter((u) => !pageRows.some((r) => r._uid === u))
        : Array.from(new Set([...s, ...pageRows.map((r) => r._uid)]))
    );

  return {
    rows,
    pageRows,
    total: filtered.length,
    query,
    setQuery: (v: string) => { setQuery(v); setPage(1); },
    filters,
    setFilter: (label: string, v: string) => { setFilters((f) => ({ ...f, [label]: v })); setPage(1); },
    options: options_,
    reset: () => { setQuery(""); setFilters({}); setPage(1); },
    page: current,
    totalPages,
    setPage,
    sort,
    toggleSort: (key: string) =>
      setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null)),
    pageSize,
    setPageSize: (n: number) => { setPageSizeState(n); setPage(1); },
    selected,
    toggle,
    allSelected,
    toggleAll,
    modal,
    openView: (row: TableRow<T>) => setModal({ mode: "view", row }),
    openEdit: (row: TableRow<T>) => setModal({ mode: "edit", row }),
    openAdd: () => setModal({ mode: "add" }),
    closeModal: () => setModal(null),
    save,
    duplicate,
    update,
    askDelete,
    confirm,
    cancelDelete: () => setConfirm(null),
    doDelete,
    toast,
    notify,
  };
}

export type TableApi<T extends object = Rec> = ReturnType<typeof useTable<T>>;
