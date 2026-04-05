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
    <footer
      className="px-4 sm:px-6 py-8"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">

        {/* Left — logo + copyright */}
        <div className="flex items-center gap-4 sm:gap-5">
          <a
            href="#home"
            className="font-display font-extrabold text-base hover:opacity-70 transition-opacity"
            style={{ color: "var(--text-primary)" }}
          >
            TT<span style={{ color: "var(--accent)" }}>.</span>
          </a>
          <span className="font-mono text-[0.65rem]" style={{ color: "var(--text-secondary)" }}>
            © {new Date().getFullYear()} {personal.name}
          </span>
        </div>

        {/* Center — nav links */}
        <div className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[0.72rem] transition-colors"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
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
              className="transition-colors p-1"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              <Icon size={15} />
            </a>
          ))}
          <div className="w-px h-4 mx-1" style={{ backgroundColor: "var(--border-subtle)" }} />
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Retour en haut"
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all"
            style={{
              border: "1px solid var(--card-border)",
              color:  "var(--text-secondary)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--card-border)"; }}
          >
            <FiArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}
