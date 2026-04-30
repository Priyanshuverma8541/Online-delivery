import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Gem, Lock, User, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form,    setForm]    = useState({ identifier: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const { login, loading, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (isAuthenticated && isAdmin) navigate("/", { replace: true }); }, [isAuthenticated, isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.identifier, form.password);
    if (res.success) navigate("/", { replace: true });
  };

  const inp = "w-full pl-10 pr-4 py-3 rounded-xl bg-ink-900 border border-ink-700 text-sm text-white placeholder:text-ink-500 focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:border-gold-500/50 transition-all";

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gold-500/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(212,168,42,0.05)_0%,transparent_60%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        <div className="bg-ink-800 border border-ink-700 rounded-3xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold">
              <Gem className="w-7 h-7 text-ink-900" />
            </div>
            <h1 className="font-display text-3xl text-white mb-1">Admin Panel</h1>
            <p className="text-ink-400 text-sm">Savitri Jewellers Control Centre</p>
          </div>

          {/* Admin badge */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500/8 border border-gold-500/15 mb-6">
            <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
            <p className="text-xs text-gold-400">Restricted to administrator accounts only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Admin ID or Email</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input
                  type="text" required placeholder="admin@savitrijewels.com"
                  className={inp}
                  value={form.identifier}
                  onChange={(e) => setForm(f => ({ ...f, identifier: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" />
                <input
                  type={showPwd ? "text" : "password"} required placeholder="••••••••"
                  className={`${inp} pr-10`}
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500 hover:text-white transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-gold w-full justify-center py-3 text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-ink-900/30 border-t-ink-900 rounded-full animate-spin" />Signing in…</span>
              ) : "Sign In to Admin"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-ink-600 mt-4">
          © {new Date().getFullYear()} Savitri Jewellers Admin
        </p>
      </motion.div>
    </div>
  );
}
