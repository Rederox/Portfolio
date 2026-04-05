"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiLock, FiMail, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { useAuth } from "@/lib/auth-context";

export default function AdminLogin() {
  const { signIn } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      document.cookie = "admin-session=1; path=/; SameSite=Strict";
      router.push("/admin");
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ backgroundColor: "rgba(var(--accent-rgb), 0.05)" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="font-display font-bold text-3xl text-white">
            T<span style={{ color: "var(--accent)" }}>T</span>
            <span style={{ color: "var(--accent)" }}>.</span>
          </p>
          <p className="text-slate-500 text-sm mt-1">Administration</p>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-7">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "rgba(var(--accent-rgb), 0.10)", border: "1px solid rgba(var(--accent-rgb), 0.20)" }}>
              <FiLock size={14} style={{ color: "var(--accent)" }} />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Connexion sécurisée</p>
              <p className="text-slate-500 text-xs">Accès réservé à l'administrateur</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">Email</label>
              <div className="relative">
                <FiMail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="theivathan14@gmail.com"
                  className="admin-input w-full bg-[#161616] border border-[#252525] text-white placeholder-slate-600 rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs text-slate-500 font-medium mb-1.5">Mot de passe</label>
              <div className="relative">
                <FiLock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="admin-input w-full bg-[#161616] border border-[#252525] text-white placeholder-slate-600 rounded-xl pl-9 pr-10 py-3 text-sm outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2 text-sm"
              >
                <FiAlertCircle size={14} />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 rounded-xl text-sm mt-1 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "var(--accent)" }}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Se connecter"
              )}
            </motion.button>
          </form>
        </div>

        <p className="text-center text-slate-600 text-xs mt-6">
          ← <a href="/" className="hover:text-slate-400 transition-colors">Retour au portfolio</a>
        </p>
      </motion.div>
    </div>
  );
}
