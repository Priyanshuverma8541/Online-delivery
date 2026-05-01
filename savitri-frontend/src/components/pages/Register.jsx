import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, AtSign, Gem, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export default function Register() {
  const [form,    setForm]    = useState({ fullName:"", userId:"", email:"", password:"", confirm:"" });
  const [errors,  setErrors]  = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const { register, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (isAuthenticated) navigate("/dashboard"); }, [isAuthenticated]);

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())   e.fullName = "Full name is required";
    if (!form.userId.trim())     e.userId   = "User ID is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!PWD_REGEX.test(form.password)) e.password = "Must be 8+ chars with uppercase, number & special character";
    if (form.password !== form.confirm)  e.confirm  = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const res = await register({ fullName: form.fullName, userId: form.userId, email: form.email, password: form.password });
    if (res.success) navigate("/login");
  };

  const field = (name) => ({
    value: form[name],
    onChange: (e) => { setForm(f => ({ ...f, [name]: e.target.value })); if (errors[name]) setErrors(er => ({ ...er, [name]: "" })); },
  });

  const inputCls = (name) =>
    `w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-800 border ${errors[name] ? "border-red-500" : "border-obsidian-700"} text-white placeholder:text-obsidian-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent font-body text-sm transition-all`;

  return (
    <div className="min-h-screen bg-obsidian-950 flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold-500/8 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity:0, y:32 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }} className="w-full max-w-md relative">
        <div className="bg-obsidian-900 border border-obsidian-700 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="flex items-center gap-2 justify-center mb-8">
            <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
              <Gem className="w-4 h-4 text-obsidian-900" />
            </div>
            <span className="font-display text-2xl text-white">Savitri <span className="text-gold-400">Jewels</span></span>
          </div>

          <h1 className="font-display text-3xl text-white text-center mb-1">Create account</h1>
          <p className="text-obsidian-400 text-sm text-center mb-8">Join our community of jewellery lovers</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="label text-obsidian-400">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
                <input type="text" placeholder="Priya Sharma" className={inputCls("fullName")} {...field("fullName")} />
              </div>
              {errors.fullName && <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>}
            </div>

            {/* User ID */}
            <div>
              <label className="label text-obsidian-400">User ID</label>
              <div className="relative">
                <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
                <input type="text" placeholder="priya123" className={inputCls("userId")} {...field("userId")} />
              </div>
              {errors.userId && <p className="text-xs text-red-400 mt-1">{errors.userId}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="label text-obsidian-400">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
                <input type="email" placeholder="priya@example.com" className={inputCls("email")} {...field("email")} />
              </div>
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="label text-obsidian-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
                <input type={showPwd?"text":"password"} placeholder="Aa1@strong" className={`${inputCls("password")} pr-10`} {...field("password")} />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-obsidian-400 hover:text-white">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm */}
            <div>
              <label className="label text-obsidian-400">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
                <input type={showPwd?"text":"password"} placeholder="Repeat password" className={inputCls("confirm")} {...field("confirm")} />
              </div>
              {errors.confirm && <p className="text-xs text-red-400 mt-1">{errors.confirm}</p>}
            </div>

            <Button type="submit" variant="gold" size="lg" loading={loading} className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-obsidian-800 text-center">
            <p className="text-obsidian-400 text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-gold-400 hover:text-gold-300 font-medium transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
