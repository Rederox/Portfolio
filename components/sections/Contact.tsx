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
    <section id="contact" className="pt-20 sm:pt-24 pb-20 sm:pb-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Section label ────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-8 sm:mb-12"
        >
          <h2 className="font-display font-medium text-xl sm:text-2xl"
            style={{ color: "var(--text-primary)" }}>
            Contact
          </h2>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--card-border)" }} />
          <span className="font-mono-jb text-xs tabular-nums" style={{ color: "var(--text-secondary)" }}>06</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Left ─────────────────────────────────────────────────────── */}
          <div>
            <motion.h2
              variants={fadeUp(0.05)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="font-display font-medium text-4xl sm:text-5xl leading-[1.05] tracking-[-0.02em] mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Travaillons<br />ensemble
            </motion.h2>

            <motion.p
              variants={fadeUp(0.15)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-[15px] leading-relaxed mb-8 max-w-sm"
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
            >
              <span
                className="font-display font-medium text-base sm:text-xl group-hover:opacity-70 transition-opacity duration-150 break-all"
                style={{ color: "var(--text-primary)" }}
              >
                {personal.email}
              </span>
              <FiArrowUpRight
                size={20}
                className="flex-shrink-0 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
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
              <p className="text-sm mb-1"
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
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  onClick={() => trackEvent(event)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-150 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[var(--card-border)] bg-[var(--tint-1)]"
                >
                  <Icon size={16} />
                </a>
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
              background: "var(--tint-1)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center gap-4 py-12 text-center"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ border: "1px solid var(--card-border)" }}
                  >
                    <FiCheck size={20} style={{ color: "#4cc38a" }} />
                  </div>
                  <h3 className="font-display font-medium text-xl" style={{ color: "var(--text-primary)" }}>
                    Message envoyé
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
                        color: "#e5484d",
                        background: "rgba(229,72,77,0.06)",
                        border: "1px solid rgba(229,72,77,0.2)",
                      }}
                    >
                      <FiAlertCircle size={14} />
                      Échec de l&apos;envoi. Réessayez ou contactez-moi par email.
                    </motion.p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="mt-1 w-full flex items-center justify-center gap-2 font-semibold h-12 rounded-xl text-sm transition-[opacity,transform] duration-150 hover:opacity-90 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "var(--accent)", color: "#0A0806" }}
                  >
                    {status === "sending" ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-black/20 border-t-black/70 rounded-full"
                        />
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        <FiSend size={14} />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
