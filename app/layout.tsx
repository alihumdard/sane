import type { Metadata } from "next";
import { Caveat, Montserrat } from "next/font/google";
import "./globals.css";
import TableLabels from "@/components/dashboard/TableLabels";

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
  icons: {
    icon: "/new-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${montserrat.variable} ${caveat.variable}`} suppressHydrationWarning>
        {children}
        <TableLabels />
      </body>
    </html>
  );
}
