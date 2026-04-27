"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiGithub, FiLinkedin, FiInstagram, FiSend, FiArrowUpRight, FiCheck, FiAlertCircle } from "react-icons/fi";
import { personal } from "@/data/portfolio";
import { trackEvent, type EventType } from "@/lib/analytics";

const socials: { icon: React.ElementType; href: string; label: string; event: EventType }[] = [
  { icon: FiGithub,    href: personal.github,    label: "GitHub",    event: "github_click" },
  { icon: FiLinkedin,  href: personal.linkedin,  label: "LinkedIn",  event: "linkedin_click" },
  { icon: FiInstagram, href: personal.instagram, label: "Instagram", event: "instagram_click" },
];

// Floating label input
function FloatField({
  label, type = "text", value, onChange, required, placeholder,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="input-float-wrap">
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? " "}
        className="input-float"
      />
      <label className="input-float-label">{label}</label>
    </div>
  );
}

function FloatTextarea({
  label, value, onChange, rows = 5,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="input-float-wrap">
      <textarea
        required
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className="input-float resize-none"
      />
      <label className="input-float-label">{label}</label>
    </div>
  );
}

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number,number,number,number], delay } },
});

export default function Contact() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", message: "" });
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
          <h2 className="font-display font-bold text-xs tracking-[0.3em] uppercase"
            style={{ color: "var(--text-primary)" }}>
            Contact
          </h2>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--card-border)" }} />
          <span className="font-mono-jb text-[0.7rem]" style={{ color: "var(--accent)" }}>06</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Left ─────────────────────────────────────────────────────── */}
          <div>
            <motion.h2
              variants={fadeUp(0.05)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="font-display font-bold text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.0] mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Travaillons<br />ensemble.
            </motion.h2>

            <motion.p
              variants={fadeUp(0.15)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-sm leading-relaxed mb-8 max-w-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              Une opportunité, une mission freelance, ou juste envie d&apos;échanger ?
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
              className="group inline-flex items-center gap-3 mb-10"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="font-display font-bold text-base sm:text-xl group-hover:opacity-70 transition-opacity break-all"
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
              className="mb-8"
            >
              <p className="text-[0.62rem] tracking-widest uppercase font-semibold mb-1"
                style={{ color: "var(--text-secondary)" }}>
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
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  onClick={() => trackEvent(event)}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.93 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border:     "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                    color:      "var(--text-secondary)",
                    transition: "border-color 0.2s ease, color 0.2s ease",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* ── Right — glass form ────────────────────────────────────────── */}
          <motion.div
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="rounded-2xl p-6 sm:p-8"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              backdropFilter: "blur(16px)",
            }}
          >
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-4 py-12 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(var(--accent-rgb),0.15)", border: "1px solid rgba(var(--accent-rgb),0.3)" }}
                  >
                    <FiCheck size={24} style={{ color: "var(--accent)" }} />
                  </motion.div>
                  <h3 className="font-display font-bold text-xl" style={{ color: "var(--text-primary)" }}>
                    Message envoyé !
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    Je vous répondrai dans les plus brefs délais.
                  </p>
                  <button
                    onClick={() => setStatus("idle")}
                    className="mt-2 text-xs underline underline-offset-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Envoyer un autre message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-4"
                >
                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FloatField
                      label="Prénom"
                      value={form.firstName}
                      onChange={(v) => setForm({ ...form, firstName: v })}
                      required
                      placeholder=" "
                    />
                    <FloatField
                      label="Nom"
                      value={form.lastName}
                      onChange={(v) => setForm({ ...form, lastName: v })}
                      required
                      placeholder=" "
                    />
                  </div>

                  <FloatField
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    required
                    placeholder=" "
                  />

                  <FloatTextarea
                    label="Message"
                    value={form.message}
                    onChange={(v) => setForm({ ...form, message: v })}
                    rows={5}
                  />

                  {status === "error" && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                      style={{
                        color: "#ef4444",
                        background: "rgba(239,68,68,0.08)",
                        border: "1px solid rgba(239,68,68,0.2)",
                      }}
                    >
                      <FiAlertCircle size={14} />
                      Échec de l&apos;envoi. Réessayez ou contactez-moi par email.
                    </motion.p>
                  )}

                  <motion.button
                    type="submit"
                    disabled={status === "sending"}
                    whileHover={{ scale: status === "idle" || status === "error" ? 1.02 : 1 }}
                    whileTap={{ scale: status === "idle" || status === "error" ? 0.97 : 1 }}
                    className="mt-1 w-full flex items-center justify-center gap-2 text-white font-bold py-4 rounded-2xl text-sm accent-glow disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "var(--accent)", transition: "opacity 0.2s ease" }}
                  >
                    {status === "sending" ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        <FiSend size={14} />
                        Envoyer le message
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
