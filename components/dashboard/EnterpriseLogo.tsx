const logos: Record<string, { text: string; color: string }> = {
  giz: { text: "giz", color: "var(--sane-c-003068)" },
  bm: { text: "BM", color: "var(--sane-c-002244)" },
  enabel: { text: "Enabel", color: "var(--sane-c-e30613)" },
  pnud: { text: "PNUD", color: "var(--sane-c-0468b1)" },
  afd: { text: "AFD", color: "var(--sane-c-e30613)" },
  unicef: { text: "UNICEF", color: "var(--sane-c-00aeef)" },
  sane: { text: "SANEM", color: "var(--sane-green)" },
};

interface Props {
  code: string;
  size?: number;
}

export default function EnterpriseLogo({ code, size = 28 }: Props) {
  const fs = size < 30 ? 8 : 9;
  const l = logos[code] || { text: code, color: "var(--sane-text-light)" };
  return (
    <div className="shrink-0 flex items-center justify-center rounded-full border border-[var(--sane-border)] overflow-hidden bg-white" style={{ width: size, height: size }}>
      <span className="font-extrabold leading-none" style={{ fontSize: fs, color: l.color }}>{l.text}</span>
    </div>
  );
}
