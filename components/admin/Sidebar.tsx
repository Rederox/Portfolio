"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiGrid,
  FiFolder,
  FiBriefcase,
  FiBookOpen,
  FiCode,
  FiDroplet,
  FiBarChart2,
  FiLogOut,
  FiExternalLink,
} from "react-icons/fi";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: FiGrid },
  { label: "Projets", href: "/admin/projects", icon: FiFolder },
  { label: "Expérience", href: "/admin/experience", icon: FiBriefcase },
  { label: "Formation", href: "/admin/education", icon: FiBookOpen },
  { label: "Compétences", href: "/admin/skills", icon: FiCode },
  { label: "Thème",      href: "/admin/theme",     icon: FiDroplet },
  { label: "Analytics",  href: "/admin/analytics", icon: FiBarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    document.cookie = "admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login");
  };

  return (
    <aside className="w-60 min-h-screen bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col fixed top-0 left-0 z-40">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-emerald-500/15 border border-emerald-500/25 rounded-lg flex items-center justify-center">
            <span className="font-display font-bold text-emerald-400 text-sm">TT</span>
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">Portfolio</p>
            <p className="text-slate-500 text-xs mt-0.5">Admin</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-2 mb-3">
          Contenu
        </p>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "text-slate-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  <item.icon size={15} />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-[#1a1a1a] space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-[#1a1a1a] transition-all"
        >
          <FiExternalLink size={15} />
          Voir le portfolio
        </a>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all"
        >
          <FiLogOut size={15} />
          Déconnexion
        </button>
        {user && (
          <p className="text-slate-600 text-xs px-3 pt-1 truncate">{user.email}</p>
        )}
      </div>
    </aside>
  );
}
