"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiInstagram, FiSend, FiArrowUpRight } from "react-icons/fi";
import { personal } from "@/data/portfolio";
import { trackEvent, type EventType } from "@/lib/analytics";

const socials: { icon: React.ElementType; href: string; label: string; event: EventType }[] = [
  { icon: FiGithub,    href: personal.github,    label: "GitHub",    event: "github_click" },
  { icon: FiLinkedin,  href: personal.linkedin,  label: "LinkedIn",  event: "linkedin_click" },
  { icon: FiInstagram, href: personal.instagram, label: "Instagram", event: "instagram_click" },
];

export default function Contact() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    trackEvent("contact_click");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setForm({ firstName: "", lastName: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut", delay } },
  });

  return (
    <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Section label ────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-10 sm:mb-14"
        >
          <span
            className="font-display font-bold text-[0.7rem] tracking-[0.3em] uppercase"
            style={{ color: "var(--text-primary)" }}
          >
            Contact
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
          <span className="font-mono text-[0.7rem]" style={{ color: "var(--accent)" }}>06</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Left — big headline + email CTA ──────────────────────────── */}
          <div>
            <motion.h2
              variants={fadeUp(0.05)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.0] mb-5 sm:mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Travaillons<br />ensemble.
            </motion.h2>

            <motion.p
              variants={fadeUp(0.15)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-sm leading-relaxed mb-8 sm:mb-10 max-w-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Une opportunité, une mission freelance, ou juste envie d'échanger ?
              Mon inbox est ouvert.
            </motion.p>

            {/* Giant email link */}
            <motion.a
              href={`mailto:${personal.email}`}
              variants={fadeUp(0.25)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              onClick={() => trackEvent("email_click")}
              className="group inline-flex items-center gap-3 mb-10 sm:mb-12"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="font-display font-bold text-base sm:text-xl group-hover:opacity-80 transition-opacity break-all"
                style={{ color: "var(--text-primary)" }}
              >
                {personal.email}
              </span>
              <FiArrowUpRight
                size={20}
                className="flex-shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                style={{ color: "var(--accent)" }}
              />
            </motion.a>

            {/* Phone */}
            <motion.div
              variants={fadeUp(0.3)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="mb-8 sm:mb-10"
            >
              <p
                className="text-[0.65rem] tracking-widest uppercase font-semibold mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Téléphone
              </p>
              <a
                href={`tel:${personal.phone.replace(/\s/g, "")}`}
                className="text-sm font-medium transition-colors"
                style={{ color: "var(--text-primary)" }}
              >
                {personal.phone}
              </a>
            </motion.div>

            {/* Socials */}
            <motion.div
              variants={fadeUp(0.35)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="flex items-center gap-2"
            >
              {socials.map(({ icon: Icon, href, label, event }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  onClick={() => trackEvent(event)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    backgroundColor: "var(--surface)",
                    border:          "1px solid var(--card-border)",
                    color:           "var(--text-secondary)",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--card-border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* ── Right — minimal form ──────────────────────────────────────── */}
          <motion.form
            onSubmit={handleSubmit}
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col gap-5 sm:gap-6"
          >
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label
                  className="block text-[0.65rem] font-semibold tracking-widest uppercase mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Prénom
                </label>
                <input
                  type="text"
                  required
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="Théo"
                  className="input-underline"
                />
              </div>
              <div>
                <label
                  className="block text-[0.65rem] font-semibold tracking-widest uppercase mb-1"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Nom
                </label>
                <input
                  type="text"
                  required
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Martin"
                  className="input-underline"
                />
              </div>
            </div>

            <div>
              <label
                className="block text-[0.65rem] font-semibold tracking-widest uppercase mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="theo@exemple.com"
                className="input-underline"
              />
            </div>

            <div>
              <label
                className="block text-[0.65rem] font-semibold tracking-widest uppercase mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Message
              </label>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Bonjour Thevaraj…"
                className="input-underline resize-none"
              />
            </div>

            <motion.button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              whileHover={{ scale: status === "idle" || status === "error" ? 1.01 : 1 }}
              whileTap={{ scale: status === "idle" || status === "error" ? 0.98 : 1 }}
              className="mt-2 w-full flex items-center justify-center gap-2 accent-bg accent-glow text-white font-bold py-4 rounded-full text-sm transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <FiSend size={14} />
              {status === "sending" ? "Envoi…" : status === "sent" ? "Message envoyé ✓" : "Envoyer"}
            </motion.button>

            {status === "error" && (
              <p className="text-center text-sm" style={{ color: "#ef4444" }}>
                Échec de l&apos;envoi. Réessayez ou contactez-moi par email.
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
