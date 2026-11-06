import type { Metadata } from "next";
import { Caveat, Montserrat } from "next/font/google";
import "./globals.css";
import TranslateGuard from "@/components/dashboard/TranslateGuard";
import { AuthProvider } from "@/lib/auth";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SANEM — Salon National de l'Emploi",
    template: "%s | SANEM",
  },
  description:
    "Salon National de l'Emploi — Connectons les talents aux opportunités.",
  /*
   * Le logo long du site ne tient pas dans un onglet : reduit a 16 pixels il
   * devenait un trait, et le navigateur affichait son globe par defaut. Les
   * icones viennent donc du logo carre de l'ANPE — app/favicon.ico porte les
   * tailles de 16 a 256, et les PNG servent aux ecrans d'accueil mobiles,
   * qui ignorent le .ico.
   */
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body className={`${montserrat.variable} ${caveat.variable}`} suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
        <TranslateGuard />
      </body>
    </html>
  );
}
