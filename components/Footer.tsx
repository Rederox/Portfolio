"use client";

import { FiGithub, FiLinkedin, FiInstagram, FiArrowUp } from "react-icons/fi";
import { personal } from "@/data/portfolio";
import { trackEvent, type EventType } from "@/lib/analytics";

const socials: { icon: React.ElementType; href: string; label: string; event: EventType }[] = [
  { icon: FiGithub,    href: personal.github,    label: "GitHub",    event: "github_click" },
  { icon: FiLinkedin,  href: personal.linkedin,  label: "LinkedIn",  event: "linkedin_click" },
  { icon: FiInstagram, href: personal.instagram, label: "Instagram", event: "instagram_click" },
];

const navLinks = [
  { label: "Profil",     href: "#about" },
  { label: "Skills",     href: "#skills" },
  { label: "Expérience", href: "#experience" },
  { label: "Projets",    href: "#projects" },
  { label: "Contact",    href: "#contact" },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#111] px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">

        {/* Left — logo + copyright */}
        <div className="flex items-center gap-5">
          <a
            href="#home"
            className="font-display font-extrabold text-base text-white hover:opacity-70 transition-opacity"
          >
            TT<span style={{ color: "var(--accent)" }}>.</span>
          </a>
          <span className="text-slate-700 text-[0.65rem] font-mono">
            © {new Date().getFullYear()} {personal.name}
          </span>
        </div>

        {/* Center — nav links */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.72rem] text-slate-600 hover:text-slate-300 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right — socials + back to top */}
        <div className="flex items-center gap-3">
          {socials.map(({ icon: Icon, href, label, event }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              onClick={() => trackEvent(event)}
              className="text-slate-700 hover:text-slate-300 transition-colors p-1"
            >
              <Icon size={15} />
            </a>
          ))}
          <div className="w-px h-4 bg-[#1a1a1a] mx-1" />
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Retour en haut"
            className="w-7 h-7 border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-full flex items-center justify-center text-slate-600 hover:text-slate-300 transition-all"
          >
            <FiArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}
