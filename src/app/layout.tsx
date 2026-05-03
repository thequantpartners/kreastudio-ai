import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KreaStudio AI",
  description: "Genera imágenes, copys y posts listos para redes sociales.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
