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
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 md:ml-60 min-h-screen">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-[#1a1a1a] sticky top-0 z-20 bg-[#0a0a0a]">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-[#1a1a1a]"
            aria-label="Menu"
          >
            <FiMenu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ backgroundColor: "rgba(var(--accent-rgb), 0.15)", border: "1px solid rgba(var(--accent-rgb), 0.25)" }}>
              <span className="font-display font-bold text-[0.6rem]" style={{ color: "var(--accent)" }}>TT</span>
            </div>
            <span className="font-semibold text-white text-sm">
              Admin
            </span>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-6 sm:py-8">{children}</div>
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}
