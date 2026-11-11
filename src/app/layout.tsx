import type { Metadata } from "next";
import { Space_Mono, Megrim, Inter } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

const megrim = Megrim({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-megrim",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "OVNISTUDIO | Desarrollo de Software e IA para Sitios Web y Sistemas Privados",
  description:
    "Desarrollo de software a medida e integración de agentes de inteligencia artificial en sitios web y sistemas privados.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${spaceMono.variable} ${megrim.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gris-oscuro text-texto-main">
        {children}
      </body>
    </html>
  );
}
