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
  title: "Theivathan Thevaraj — Tech Lead & Développeur Full Stack",
  description:
    "Portfolio de Theivathan Thevaraj, Tech Lead et développeur full stack (React, Next.js, Go, Python). Expériences, projets et contact.",
  authors: [{ name: "Theivathan Thevaraj", url: BASE_URL }],
  creator: "Theivathan Thevaraj",
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    title: "Theivathan Thevaraj — Tech Lead & Développeur Full Stack",
    description: "Tech Lead et développeur full stack (React, Next.js, Go, Python). Expériences, projets et contact.",
    url: BASE_URL,
    siteName: "Theivathan Thevaraj",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Theivathan Thevaraj — Tech Lead & Développeur Full Stack",
    description: "Tech Lead et développeur full stack (React, Next.js, Go, Python). Expériences, projets et contact.",
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
