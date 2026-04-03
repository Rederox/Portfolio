"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiFolder, FiBriefcase, FiBookOpen, FiCode, FiArrowRight } from "react-icons/fi";
import { getProjects, getExperience, getEducation } from "@/lib/firestore";

const sections = [
  {
    label: "Projets",
    href: "/admin/projects",
    icon: FiFolder,
    color: "emerald",
    desc: "Ajoute, modifie et supprime tes projets avec images et vidéos.",
  },
  {
    label: "Expérience",
    href: "/admin/experience",
    icon: FiBriefcase,
    color: "blue",
    desc: "Gère ton parcours professionnel et tes missions.",
  },
  {
    label: "Formation",
    href: "/admin/education",
    icon: FiBookOpen,
    color: "violet",
    desc: "Mets à jour ton cursus académique et tes diplômes.",
  },
  {
    label: "Compétences",
    href: "/admin/skills",
    icon: FiCode,
    color: "amber",
    desc: "Organise tes compétences techniques par catégorie.",
  },
];

const colorMap: Record<string, { bg: string; border: string; text: string }> = {
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects: 0, experience: 0, education: 0 });

  useEffect(() => {
    Promise.all([getProjects(), getExperience(), getEducation()]).then(
      ([projects, experience, education]) => {
        setStats({
          projects: projects.length,
          experience: experience.length,
          education: education.length,
        });
      }
    ).catch(() => {});
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-white mb-1">
          Tableau de bord
        </h1>
        <p className="text-slate-400 text-sm">
          Gérez le contenu de votre portfolio depuis ici.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Projets", value: stats.projects, color: "emerald" },
          { label: "Expériences", value: stats.experience, color: "blue" },
          { label: "Formations", value: stats.education, color: "violet" },
        ].map((stat) => {
          const c = colorMap[stat.color];
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-[#111] border border-[#1e1e1e] rounded-xl p-5`}
            >
              <p className="text-slate-500 text-xs font-medium mb-1">{stat.label}</p>
              <p className={`font-display font-bold text-3xl ${c.text}`}>{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Section cards */}
      <div className="grid grid-cols-2 gap-4">
        {sections.map((section, i) => {
          const c = colorMap[section.color];
          return (
            <motion.a
              key={section.href}
              href={section.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="group bg-[#111] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-2xl p-6 flex flex-col gap-4 transition-all"
            >
              <div className={`w-10 h-10 ${c.bg} border ${c.border} rounded-xl flex items-center justify-center`}>
                <section.icon size={18} className={c.text} />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">{section.label}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{section.desc}</p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${c.text} group-hover:gap-2 transition-all`}>
                Gérer <FiArrowRight size={12} />
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
