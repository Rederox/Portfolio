import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/lib/theme-context";
import { ModeProvider } from "@/lib/mode-context";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const BASE_URL = "https://theivathan.fr";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Theivathan Thevaraj — Développeur Lead Full Stack",
  description:
    "Développeur Lead Full Stack basé à Argenteuil (95), France. Spécialisé en React, Next.js, Node.js, TypeScript, IA et DevOps. 3 ans d'expérience. Disponible pour un poste.",
  keywords: [
    "Theivathan Thevaraj",
    "Thevaraj",
    "Theivathan",
    "Développeur Full Stack",
    "Full Stack Developer",
    "Développeur Lead",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "DevOps",
    "Intelligence Artificielle",
    "IA",
    "Docker",
    "Développeur Web",
    "France",
    "Argenteuil",
    "Ile-de-France",
    "Portfolio",
    "Alternance",
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
    title: "Theivathan Thevaraj — Développeur Lead Full Stack",
    description:
      "Développeur Lead Full Stack basé à Argenteuil, France. Spécialisé en React, Next.js, Node.js, TypeScript, IA et DevOps. Disponible pour un poste.",
    url: BASE_URL,
    siteName: "Theivathan Thevaraj — Portfolio",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/me.jpg",
        width: 800,
        height: 1067,
        alt: "Theivathan Thevaraj — Développeur Lead Full Stack",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Theivathan Thevaraj — Développeur Lead Full Stack",
    description:
      "Développeur Lead Full Stack basé à Argenteuil, France. React, Next.js, IA, DevOps. Disponible pour un poste.",
    images: ["/me.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth" suppressHydrationWarning>
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
