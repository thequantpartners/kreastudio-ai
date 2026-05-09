import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
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
    <ClerkProvider>
      <html lang="es" data-scroll-behavior="smooth">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
