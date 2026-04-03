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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent("contact_click");
    const subject = encodeURIComponent(`Contact portfolio — ${form.firstName} ${form.lastName}`);
    const body    = encodeURIComponent(`Bonjour Thevaraj,\n\n${form.message}\n\n---\nDe : ${form.firstName} ${form.lastName}\nEmail : ${form.email}`);
    window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`;
  };

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 24 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut", delay } },
  });

  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Section label ────────────────────────────────────────────────── */}
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-14"
        >
          <span className="text-white font-display font-bold text-[0.7rem] tracking-[0.3em] uppercase">
            Contact
          </span>
          <div className="flex-1 h-px bg-[#1a1a1a]" />
          <span className="font-mono text-[0.7rem]" style={{ color: "var(--accent)" }}>06</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── Left — big headline + email CTA ──────────────────────────── */}
          <div>
            <motion.h2
              variants={fadeUp(0.05)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="font-display font-extrabold text-5xl sm:text-6xl text-white leading-[1.0] mb-6"
            >
              Travaillons<br />ensemble.
            </motion.h2>

            <motion.p
              variants={fadeUp(0.15)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="text-slate-500 text-sm leading-relaxed mb-10 max-w-sm"
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
            className="group inline-flex items-center gap-3 mb-12"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <span className="font-display font-bold text-xl text-white group-hover:opacity-80 transition-opacity break-all">
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
              className="mb-10"
            >
              <p className="text-slate-700 text-[0.65rem] tracking-widest uppercase font-semibold mb-1">Téléphone</p>
              <a href={`tel:${personal.phone.replace(/\s/g, "")}`} className="text-slate-300 text-sm hover:text-white transition-colors font-medium">
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
                  className="w-10 h-10 bg-[#0f0f0f] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-200 transition-all"
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
            className="flex flex-col gap-6"
          >
            {/* Name row */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[0.65rem] text-slate-600 font-semibold tracking-widest uppercase mb-1">Prénom</label>
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
                <label className="block text-[0.65rem] text-slate-600 font-semibold tracking-widest uppercase mb-1">Nom</label>
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
              <label className="block text-[0.65rem] text-slate-600 font-semibold tracking-widest uppercase mb-1">Email</label>
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
              <label className="block text-[0.65rem] text-slate-600 font-semibold tracking-widest uppercase mb-1">Message</label>
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
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="mt-2 w-full flex items-center justify-center gap-2 accent-bg accent-glow text-white font-bold py-4 rounded-full text-sm transition-all hover:opacity-90"
            >
              <FiSend size={14} />
              Envoyer
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
