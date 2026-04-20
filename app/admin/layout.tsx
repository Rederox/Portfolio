"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import Sidebar from "@/components/admin/Sidebar";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isKanban = pathname.startsWith("/admin/jobs");

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored === "true") setSidebarCollapsed(true);
  }, []);

  const toggleCollapsed = () => {
    setSidebarCollapsed((c) => {
      const next = !c;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, loading, pathname, router]);

  if (pathname === "/admin/login") return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#333] rounded-full animate-spin"
          style={{ borderTopColor: "var(--accent)" }} />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-[#0a0a0a] flex" style={{ height: "100dvh", overflow: "hidden" }}>
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={toggleCollapsed}
      />

      <main
        className={`flex flex-col flex-1 min-w-0 overflow-hidden transition-all duration-300 ${
          sidebarCollapsed ? "md:ml-14" : "md:ml-60"
        }`}
      >
        {/* Mobile top bar */}
        <div className="md:hidden flex-shrink-0 flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a] bg-[#0a0a0a] z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-[#1a1a1a]"
          >
            <FiMenu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ backgroundColor: "rgba(var(--accent-rgb), 0.15)", border: "1px solid rgba(var(--accent-rgb), 0.25)" }}>
              <span className="font-display font-bold text-[0.6rem]" style={{ color: "var(--accent)" }}>TT</span>
            </div>
            <span className="font-semibold text-white text-sm">Admin</span>
          </div>
        </div>

        {/* Content */}
        {isKanban ? (
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">{children}</div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8">{children}</div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}
