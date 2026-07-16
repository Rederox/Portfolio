import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/lib/theme-context";
import { ModeProvider } from "@/lib/mode-context";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const BASE_URL = "https://www.theivathan.fr";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Theivathan Thevaraj — Développeur Full Stack · React, Next.js, IA & DevOps",
  description:
    "Développeur Full Stack (React, Next.js, TypeScript, Node.js) spécialisé IA & DevOps. Marketplace créée de A à Z, 3 000+ clics SEO/mois, automatisations IA. Basé à Argenteuil (95) — disponible.",
  keywords: [
    "développeur full stack", "React", "Next.js", "TypeScript", "Node.js",
    "IA", "DevOps", "Docker", "développeur Argenteuil", "développeur Île-de-France",
  ],
  authors: [{ name: "Theivathan Thevaraj", url: BASE_URL }],
  creator: "Theivathan Thevaraj",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Theivathan Thevaraj — Développeur Full Stack · IA & DevOps",
    description:
      "Marketplace créée de A à Z, 3 000+ clics SEO/mois, automatisations IA qui économisent 3 h/jour. React, Next.js, TypeScript, Docker. Disponible.",
    url: BASE_URL,
    siteName: "Theivathan Thevaraj — Portfolio",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Theivathan Thevaraj — Développeur Full Stack · IA & DevOps",
    description:
      "Marketplace créée de A à Z, 3 000+ clics SEO/mois, automatisations IA. React, Next.js, TypeScript. Disponible.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={`scroll-smooth ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body>
        <ModeProvider>
          <ThemeProvider>
            <AnalyticsTracker />
            {children}
          </ThemeProvider>
        </ModeProvider>
        <Analytics />
      </body>
    </html>
  );
}
