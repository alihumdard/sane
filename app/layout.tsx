import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import TableLabels from "@/components/dashboard/TableLabels";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SANE — Salon National de l'Emploi",
    template: "%s | SANE",
  },
  description:
    "Salon National de l'Emploi — Connectons les talents aux opportunités.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={montserrat.variable} suppressHydrationWarning>
        {children}
        <TableLabels />
      </body>
    </html>
  );
}
