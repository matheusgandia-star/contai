import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Contaí — Controle Financeiro",
  description: "Controle financeiro pessoal simples e rápido",
};

export const viewport: Viewport = {
  themeColor: "#0F3D3E",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
