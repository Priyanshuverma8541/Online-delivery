import { motion } from "framer-motion";
import { Loader2, PackageOpen } from "lucide-react";

// ── Button ─────────────────────────────────────────────────────
export const Button = ({
  children, variant = "gold", size = "md",
  loading = false, disabled, className = "", onClick, type = "button", ...props
}) => {
  const base = "inline-flex items-center justify-center gap-2 font-body font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2";
  const variants = {
    gold:    "bg-gold-gradient text-obsidian-900 shadow-gold hover:shadow-gold-lg hover:scale-[1.03] active:scale-[0.98]",
    outline: "border-2 border-gold-500 text-gold-700 hover:bg-gold-500 hover:text-obsidian-900",
    ghost:   "text-obsidian-700 hover:bg-obsidian-100",
    danger:  "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    dark:    "bg-obsidian-900 text-cream hover:bg-obsidian-800 shadow-sm",
  };
  const sizes = {
    sm:  "px-4 py-2 text-xs",
    md:  "px-6 py-2.5 text-sm",
    lg:  "px-8 py-3.5 text-base",
    xl:  "px-10 py-4 text-lg",
  };
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled || loading ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

// ── Input ──────────────────────────────────────────────────────
export const Input = ({ label, error, icon: Icon, className = "", ...props }) => (
  <div className="space-y-1">
    {label && <label className="label">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />}
      <input
        className={`input ${Icon ? "pl-10" : ""} ${error ? "border-red-400 focus:ring-red-300" : ""} ${className}`}
        {...props}
      />
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// ── Spinner ────────────────────────────────────────────────────
export const Spinner = ({ size = "md", className = "" }) => {
  const sizes = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizes[size]} text-gold-500 animate-spin`} />
    </div>
  );
};

// ── Full page loader ──────────────────────────────────────────
export const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-500 rounded-full animate-spin" />
    <p className="font-body text-obsidian-400 text-sm tracking-widest uppercase">Loading</p>
  </div>
);

// ── Skeleton card ─────────────────────────────────────────────
export const SkeletonCard = () => (
  <div className="card p-4 space-y-3">
    <div className="skeleton h-52 w-full rounded-xl" />
    <div className="skeleton h-4 w-3/4 rounded" />
    <div className="skeleton h-4 w-1/2 rounded" />
    <div className="skeleton h-9 w-full rounded-full" />
  </div>
);

// ── Empty state ───────────────────────────────────────────────
export const EmptyState = ({ title, message, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 text-center"
  >
    <PackageOpen className="w-16 h-16 text-obsidian-200 mb-4" />
    <h3 className="font-display text-2xl text-obsidian-700 mb-2">{title}</h3>
    <p className="text-obsidian-400 text-sm mb-6 max-w-xs">{message}</p>
    {action}
  </motion.div>
);

// ── Section wrapper ────────────────────────────────────────────
export const Section = ({ tag, title, subtitle, children, className = "" }) => (
  <section className={`py-20 px-4 ${className}`}>
    <div className="max-w-7xl mx-auto">
      {(tag || title) && (
        <div className="text-center mb-14">
          {tag    && <p className="section-tag">{tag}</p>}
          {title  && <h2 className="section-title">{title}</h2>}
          {subtitle && <p className="mt-4 text-obsidian-500 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  </section>
);

// ── Status badge ──────────────────────────────────────────────
export const StatusBadge = ({ status }) => {
  const map = {
    ordered:    "badge-gray",
    processing: "badge-gold",
    shipped:    "bg-blue-100 text-blue-800 badge",
    delivered:  "badge-green",
    cancelled:  "badge-red",
    pending:    "badge-gray",
    paid:       "badge-green",
    failed:     "badge-red",
  };
  return <span className={map[status] || "badge-gray"}>{status}</span>;
};
