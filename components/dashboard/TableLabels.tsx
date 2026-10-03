"use client";

import { useEffect } from "react";

/**
 * Copies each <th> text onto the matching <td> as data-label so the
 * mobile card layout in globals.css can show the column names.
 */
export default function TableLabels() {
  useEffect(() => {
    const apply = () => {
      document.querySelectorAll(".overflow-x-auto > table").forEach((table) => {
        const heads = Array.from(table.querySelectorAll("thead th")).map((th) => th.textContent?.trim() ?? "");
        table.querySelectorAll("tbody tr").forEach((tr) => {
          Array.from(tr.children).forEach((td, i) => {
            const label = heads[i] ?? "";
            if (td.getAttribute("data-label") !== label) td.setAttribute("data-label", label);
          });
        });
      });
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
