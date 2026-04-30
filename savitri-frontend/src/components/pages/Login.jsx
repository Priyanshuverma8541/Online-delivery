import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Gem, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button, Input } from "../ui";

export default function Login() {
  const [form,    setForm]    = useState({ identifier: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const { login, loading, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = location.state?.from?.pathname || "/dashboard";

  useEffect(() => { if (isAuthenticated) navigate(from, { replace: true }); }, [isAuthenticated]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.identifier, form.password);
    if (res.success) navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold-500/8 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        {/* Card */}
        <div className="bg-obsidian-900 border border-obsidian-700 rounded-3xl p-8 md:p-10 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-2 justify-center mb-8">
            <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
              <Gem className="w-4.5 h-4.5 text-obsidian-900" />
            </div>
            <span className="font-display text-2xl text-white">Savitri <span className="text-gold-400">Jewels</span></span>
          </div>

          <h1 className="font-display text-3xl text-white text-center mb-1">Welcome back</h1>
          <p className="text-obsidian-400 text-sm text-center mb-8">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="label text-obsidian-400">Email or User ID</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
                <input
                  type="text"
                  required
                  placeholder="you@example.com or userid"
                  value={form.identifier}
                  onChange={(e) => setForm(f => ({ ...f, identifier: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white placeholder:text-obsidian-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent font-body text-sm transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="label text-obsidian-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-obsidian-800 border border-obsidian-700 text-white placeholder:text-obsidian-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent font-body text-sm transition-all"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-obsidian-400 hover:text-white transition-colors">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full mt-2">
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-obsidian-800 text-center">
            <p className="text-obsidian-400 text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
