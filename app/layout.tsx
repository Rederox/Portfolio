import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/lib/theme-context";
import { ModeProvider } from "@/lib/mode-context";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export const metadata: Metadata = {
  title: "Theivathan Thevaraj — Full Stack Developer",
  description:
    "Développeur Full Stack passionné basé à Argenteuil, France. Spécialisé en React, Next.js, Node.js et TypeScript. Disponible pour un poste.",
  keywords: [
    "Full Stack Developer",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "Développeur Web",
    "France",
    "Argenteuil",
  ],
  authors: [{ name: "Theivathan Thevaraj" }],
  openGraph: {
    title: "Theivathan Thevaraj — Full Stack Developer",
    description:
      "Développeur Full Stack passionné basé à Argenteuil, France.",
    type: "website",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Theivathan Thevaraj — Full Stack Developer",
    description:
      "Développeur Full Stack passionné basé à Argenteuil, France.",
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
