"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { AlertCircle, Check, Copy, Download } from "lucide-react";
import { AdminPage } from "@/components/dashboard/AdminPage";
import { SITE_CONFIG } from "@/lib/constants";

const CIBLES = [
  { label: "Inscription", url: `${SITE_CONFIG.url}/inscription?source=qr` },
  { label: "Programme", url: `${SITE_CONFIG.url}/programme` },
  { label: "Offres d'emploi", url: `${SITE_CONFIG.url}/emploi` },
  { label: "Accueil", url: SITE_CONFIG.url },
];

/*
 * Le même réglage pour l'aperçu et pour les deux fichiers, pour qu'ils ne
 * puissent pas s'écarter.
 *
 * Presque noir sur blanc pur, et non le vert du salon : un lecteur seuille sur
 * la luminance, et le vert, correct à l'écran, devient limite sous l'encre
 * d'un flyer bon marché. Jamais inversé — beaucoup de lecteurs refusent.
 * La marge de quatre modules est celle que la norme exige : un code collé
 * contre l'illustration d'une affiche ne se lit plus.
 */
const REGLAGE = { level: "M", marginSize: 4, fgColor: "#0f2419", bgColor: "#ffffff" } as const;

/** Largeur du PNG : de quoi imprimer environ 17 cm à 300 dpi. */
const LARGEUR_PNG = 2048;

const champ =
  "w-full rounded-lg border border-[var(--sane-border)] px-3 py-2.5 text-[13px] outline-none transition-colors focus:border-[var(--sane-green)] focus:ring-2 focus:ring-[var(--sane-green)]/10";
const bouton =
  "inline-flex items-center gap-2 rounded-lg border border-[var(--sane-border)] bg-white px-4 py-2 text-[13px] font-semibold hover:border-[var(--sane-green)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-[var(--sane-border)]";

/**
 * Remet au navigateur un fichier calculé ici.
 *
 * `telecharger()` de lib/api.ts ne convient pas : il va chercher le fichier
 * sur l'API avec le jeton d'authentification, alors que ce code n'existe
 * nulle part sur le serveur. Le geste est le même — l'URL objet est révoquée
 * aussitôt pour ne pas fuir pendant toute la vie de la page.
 */
function enregistrer(blob: Blob, nomFichier: string) {
  const url = URL.createObjectURL(blob);

  try {
    const lien = document.createElement("a");
    lien.href = url;
    lien.download = nomFichier;
    document.body.appendChild(lien);
    lien.click();
    lien.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}

function Contenu() {
  const [lien, setLien] = useState(CIBLES[0].url);
  const [copie, setCopie] = useState(false);
  const svg = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);

  const adresse = lien.trim();
  // Un code qui encode une adresse sans http(s) s'ouvre en recherche, ou ne
  // s'ouvre pas : on refuse de le fabriquer plutôt que de le laisser partir.
  const valide = /^https?:\/\/\S+$/i.test(adresse);

  function telechargerPng() {
    canvas.current?.querySelector("canvas")?.toBlob((blob) => {
      if (blob) enregistrer(blob, "sanem-code-qr.png");
    }, "image/png");
  }

  function telechargerSvg() {
    const noeud = svg.current?.querySelector("svg");

    if (!noeud) return;

    // XMLSerializer et non outerHTML : seul lui écrit l'espace de noms, sans
    // lequel le fichier ne s'ouvre pas hors d'une page HTML.
    const texte = new XMLSerializer().serializeToString(noeud);

    enregistrer(new Blob([texte], { type: "image/svg+xml;charset=utf-8" }), "sanem-code-qr.svg");
  }

  async function copier() {
    try {
      await navigator.clipboard.writeText(adresse);
      setCopie(true);
      setTimeout(() => setCopie(false), 2000);
    } catch {
      // Presse-papiers refusé : le lien reste lisible dans le champ.
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-5">
        <section className="rounded-2xl border border-[var(--sane-border)] bg-white p-5 sm:p-6">
          <h2 className="mb-1 text-[14px] font-bold text-[var(--sane-text)]">Adresse du code</h2>
          <p className="mb-4 text-[12px] text-[var(--sane-text-light)]">
            La page que le téléphone ouvrira après avoir scanné.
          </p>

          <div className="mb-4 flex flex-wrap gap-2">
            {CIBLES.map((c) => {
              const actif = lien === c.url;

              return (
                <button
                  key={c.label}
                  type="button"
                  aria-pressed={actif}
                  onClick={() => setLien(c.url)}
                  className={`rounded-full border px-3.5 py-1.5 text-[12px] font-semibold transition-colors ${
                    actif
                      ? "border-[var(--sane-green)] bg-[var(--sane-green-light)] text-[var(--sane-green)]"
                      : "border-[var(--sane-border)] bg-white text-[var(--sane-text)] hover:border-[var(--sane-green)]/40"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <label htmlFor="adresse" className="mb-1.5 block text-[12px] font-semibold text-[var(--sane-text)]">
            Adresse complète
          </label>
          <input
            id="adresse"
            type="url"
            inputMode="url"
            maxLength={500}
            value={lien}
            onChange={(e) => setLien(e.target.value)}
            className={champ}
          />

          <p
            role="alert"
            className={`mt-2 items-start gap-1.5 text-[12px] text-[var(--sane-red-dark)] ${valide ? "hidden" : "flex"}`}
          >
            <AlertCircle size={14} className="mt-0.5 shrink-0" />
            L&apos;adresse doit commencer par https:// — sinon le téléphone ne saura pas l&apos;ouvrir.
          </p>

          <p className="mt-3 text-[12px] text-[var(--sane-text-light)]">
            Les inscriptions arrivées par le lien « Inscription » sont rangées sous « Code QR » dans{" "}
            <Link href="/dashboard/admin/rapports" className="font-semibold text-[var(--sane-green)]">
              les rapports
            </Link>
            .
          </p>
        </section>

        <section className="rounded-2xl border border-[var(--sane-border)] bg-white p-5 sm:p-6">
          <h2 className="mb-3 text-[14px] font-bold text-[var(--sane-text)]">À imprimer</h2>
          <ul className="flex list-disc flex-col gap-1.5 pl-5 text-[12px] text-[var(--sane-text-light)]">
            <li>Le SVG pour l&apos;imprimeur : il reste net à toutes les tailles, d&apos;un flyer à une banderole.</li>
            <li>Le PNG pour les réseaux sociaux et les documents.</li>
            <li>Au moins 2 cm de côté sur un flyer, 8 cm sur une affiche lue à un ou deux mètres.</li>
            <li>Garder le bord blanc autour du code. Ne pas le poser sur une photo, ne pas l&apos;étirer.</li>
            <li>Scanner l&apos;épreuve imprimée avec un téléphone avant le tirage.</li>
          </ul>
        </section>
      </div>

      <section className="h-fit rounded-2xl border border-[var(--sane-border)] bg-white p-5 sm:p-6">
        <h2 className="mb-4 text-[14px] font-bold text-[var(--sane-text)]">Aperçu</h2>

        <div
          ref={svg}
          className={`mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-xl border border-[var(--sane-border)] bg-white transition-opacity ${
            valide ? "" : "opacity-30"
          }`}
        >
          <QRCodeSVG
            value={valide ? adresse : SITE_CONFIG.url}
            size={280}
            style={{ width: "100%", height: "100%" }}
            {...REGLAGE}
          />
        </div>

        <p className="mt-3 break-all text-center text-[11px] text-[var(--sane-text-light)]">{adresse || "—"}</p>

        <div className="mt-5 flex flex-col gap-2">
          <button type="button" onClick={telechargerPng} disabled={!valide} className={bouton}>
            <Download size={15} /> Télécharger en PNG
          </button>
          <button type="button" onClick={telechargerSvg} disabled={!valide} className={bouton}>
            <Download size={15} /> Télécharger en SVG
          </button>
          <button type="button" onClick={copier} disabled={!valide} className={bouton}>
            <Copy size={15} className={copie ? "hidden" : "block"} />
            <Check size={15} className={copie ? "block text-[var(--sane-green)]" : "hidden"} />
            Copier le lien
          </button>
        </div>

        {/* Toujours dans l'arbre, jamais vu : c'est lui qui fournit le PNG en pleine résolution. */}
        <div ref={canvas} className="hidden" aria-hidden>
          <QRCodeCanvas value={valide ? adresse : SITE_CONFIG.url} size={LARGEUR_PNG} {...REGLAGE} />
        </div>
      </section>
    </div>
  );
}

export default function QrCodeAdminPage() {
  return (
    <AdminPage
      section="Code QR"
      titre="Code QR du salon"
      description="Le code à imprimer sur les affiches et les flyers, qui ouvre une page du site"
    >
      <Contenu />
    </AdminPage>
  );
}
