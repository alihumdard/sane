import Image from "next/image";

export function Hero() {
  return (
    <section aria-label="Salon National de l’Emploi 2026" className="bg-white">
      <Image
        src="/carré-affiche-sane-1080-x1080.jpg.jpeg"
        alt="Affiche du 4e Salon National de l’Emploi, du 10 au 12 décembre 2026 à Niamey"
        width={1080}
        height={1080}
        priority
        className="mx-auto h-auto w-full max-w-[1080px]"
      />
    </section>
  );
}
