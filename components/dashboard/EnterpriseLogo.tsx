const logos: Record<string, { text: string; color: string }> = {
  giz: { text: "giz", color: "#003068" },
  bm: { text: "BM", color: "#002244" },
  enabel: { text: "Enabel", color: "#E30613" },
  pnud: { text: "PNUD", color: "#0468B1" },
  afd: { text: "AFD", color: "#E30613" },
  unicef: { text: "UNICEF", color: "#00AEEF" },
  sane: { text: "SANE", color: "#10632D" },
};

interface Props {
  code: string;
  size?: number;
}

export default function EnterpriseLogo({ code, size = 28 }: Props) {
  const fs = size < 30 ? 8 : 9;
  const l = logos[code] || { text: code, color: "#61756B" };
  return (
    <div className="shrink-0 flex items-center justify-center rounded-full border border-[#DDE8E0] overflow-hidden bg-white" style={{ width: size, height: size }}>
      <span className="font-extrabold leading-none" style={{ fontSize: fs, color: l.color }}>{l.text}</span>
    </div>
  );
}
