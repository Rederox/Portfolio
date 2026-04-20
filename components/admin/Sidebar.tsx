"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiGrid, FiFolder, FiBriefcase, FiBookOpen, FiCode,
  FiDroplet, FiBarChart2, FiLogOut, FiExternalLink, FiX,
  FiClipboard, FiChevronsLeft, FiChevronsRight,
} from "react-icons/fi";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { label: "Dashboard",     href: "/admin",            icon: FiGrid },
  { label: "Projets",       href: "/admin/projects",   icon: FiFolder },
  { label: "Expérience",    href: "/admin/experience", icon: FiBriefcase },
  { label: "Formation",     href: "/admin/education",  icon: FiBookOpen },
  { label: "Compétences",   href: "/admin/skills",     icon: FiCode },
  { label: "Thème",         href: "/admin/theme",      icon: FiDroplet },
  { label: "Analytics",     href: "/admin/analytics",  icon: FiBarChart2 },
  { label: "Candidatures",  href: "/admin/jobs",       icon: FiClipboard },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function Sidebar({
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    document.cookie = "admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/admin/login");
  };

  return (
    <aside
      className={`
        min-h-screen bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col
        fixed top-0 left-0 z-40
        transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        ${isCollapsed ? "w-14" : "w-60"}
      `}
    >
      {/* Logo */}
      <div className={`border-b border-[#1a1a1a] flex items-center transition-all duration-300 ${isCollapsed ? "px-0 py-5 justify-center" : "px-5 py-5 justify-between"}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "rgba(var(--accent-rgb), 0.15)", border: "1px solid rgba(var(--accent-rgb), 0.25)" }}>
              <span className="font-display font-bold text-sm" style={{ color: "var(--accent)" }}>TT</span>
            </div>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm leading-none truncate">Portfolio</p>
              <p className="text-slate-500 text-xs mt-0.5">Admin</p>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: "rgba(var(--accent-rgb), 0.15)", border: "1px solid rgba(var(--accent-rgb), 0.25)" }}>
            <span className="font-display font-bold text-sm" style={{ color: "var(--accent)" }}>TT</span>
          </div>
        )}

        {/* Close button — mobile only */}
        {!isCollapsed && (
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-slate-500 hover:text-white transition-colors rounded-lg hover:bg-[#1a1a1a]"
            aria-label="Fermer"
          >
            <FiX size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 overflow-hidden">
        {!isCollapsed && (
          <p className="text-slate-600 text-[10px] font-semibold uppercase tracking-widest px-2 mb-3">
            Contenu
          </p>
        )}
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={onClose}
                  title={isCollapsed ? item.label : undefined}
                  className={`flex items-center gap-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative ${
                    isCollapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
                  } ${active ? "border" : "text-slate-400 hover:text-white hover:bg-[#1a1a1a]"}`}
                  style={active ? {
                    backgroundColor: "rgba(var(--accent-rgb), 0.10)",
                    color: "var(--accent)",
                    borderColor: "rgba(var(--accent-rgb), 0.20)",
                  } : {}}
                >
                  <item.icon size={15} className="flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}

                  {/* Tooltip when collapsed */}
                  {isCollapsed && (
                    <span className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                      {item.label}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className={`px-2 py-3 border-t border-[#1a1a1a] space-y-0.5 ${isCollapsed ? "items-center" : ""}`}>
        {/* Toggle collapse — desktop only */}
        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? "Développer" : "Réduire"}
          className={`hidden md:flex items-center gap-2.5 w-full rounded-xl text-sm text-slate-500 hover:text-white hover:bg-[#1a1a1a] transition-all group relative ${
            isCollapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
          }`}
        >
          {isCollapsed ? <FiChevronsRight size={15} /> : <FiChevronsLeft size={15} />}
          {!isCollapsed && <span>Réduire</span>}
          {isCollapsed && (
            <span className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
              Développer
            </span>
          )}
        </button>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title={isCollapsed ? "Voir le portfolio" : undefined}
          className={`flex items-center gap-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-[#1a1a1a] transition-all group relative ${
            isCollapsed ? "px-0 py-2.5 justify-center w-full" : "px-3 py-2.5"
          }`}
        >
          <FiExternalLink size={15} className="flex-shrink-0" />
          {!isCollapsed && "Voir le portfolio"}
          {isCollapsed && (
            <span className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
              Voir le portfolio
            </span>
          )}
        </a>

        <button
          onClick={handleSignOut}
          title={isCollapsed ? "Déconnexion" : undefined}
          className={`w-full flex items-center gap-2.5 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-400/5 transition-all group relative ${
            isCollapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
          }`}
        >
          <FiLogOut size={15} className="flex-shrink-0" />
          {!isCollapsed && "Déconnexion"}
          {isCollapsed && (
            <span className="absolute left-full ml-2 px-2.5 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
              Déconnexion
            </span>
          )}
        </button>

        {!isCollapsed && user && (
          <p className="text-slate-600 text-xs px-3 pt-1 truncate">{user.email}</p>
        )}
      </div>
    </aside>
  );
}
