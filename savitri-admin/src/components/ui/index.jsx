import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertTriangle, X, PackageOpen } from "lucide-react";

/* ── Spinner ─────────────────────────────────────────── */
export const Spinner = ({ size = "md", className = "" }) => {
  const s = { sm: "w-4 h-4", md: "w-7 h-7", lg: "w-10 h-10" };
  return <Loader2 className={`${s[size]} text-gold-500 animate-spin ${className}`} />;
};

/* ── Page loader ─────────────────────────────────────── */
export const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
    <div className="w-10 h-10 border-2 border-ink-700 border-t-gold-500 rounded-full animate-spin" />
    <p className="text-xs text-ink-500 font-mono tracking-widest uppercase">Loading</p>
  </div>
);

/* ── Skeleton ────────────────────────────────────────── */
export const Skeleton = ({ className = "" }) => <div className={`skeleton ${className}`} />;

export const SkeletonRow = () => (
  <tr>
    {Array(5).fill(0).map((_, i) => (
      <td key={i} className="px-4 py-3.5"><Skeleton className="h-4 rounded" /></td>
    ))}
  </tr>
);

/* ── Empty state ─────────────────────────────────────── */
export const Empty = ({ title = "No data", message = "", action }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <PackageOpen className="w-14 h-14 text-ink-700 mb-3" />
    <p className="font-display text-2xl text-ink-400 mb-1">{title}</p>
    {message && <p className="text-ink-600 text-sm mb-5">{message}</p>}
    {action}
  </div>
);

/* ── Confirm dialog ──────────────────────────────────── */
export const ConfirmDialog = ({ open, title, message, onConfirm, onCancel, danger = true }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .9 }}
          className="bg-ink-800 border border-ink-700 rounded-2xl p-6 w-full max-w-sm shadow-xl"
        >
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${danger ? "text-rose-400" : "text-amber-400"}`} />
            <div>
              <h3 className="font-display text-xl text-white mb-1">{title}</h3>
              <p className="text-ink-400 text-sm">{message}</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-6">
            <button onClick={onCancel} className="btn-ghost">Cancel</button>
            <button
              onClick={onConfirm}
              className={danger ? "btn btn-danger px-5 py-2 text-sm bg-rose-500 text-white hover:bg-rose-600" : "btn-gold"}
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ── Modal wrapper ───────────────────────────────────── */
export const Modal = ({ open, onClose, title, children, size = "md" }) => {
  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: .95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .95, y: 16 }}
            className={`bg-ink-800 border border-ink-700 rounded-2xl shadow-xl w-full ${widths[size]} max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink-700 sticky top-0 bg-ink-800 z-10">
              <h2 className="font-display text-2xl text-white">{title}</h2>
              <button onClick={onClose} className="btn-icon"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* ── Status badge ────────────────────────────────────── */
export const StatusBadge = ({ status }) => {
  const map = {
    ordered:    "badge-gray",
    processing: "badge-amber",
    shipped:    "badge-blue",
    delivered:  "badge-green",
    cancelled:  "badge-red",
    pending:    "badge-gray",
    paid:       "badge-green",
    failed:     "badge-red",
    refunded:   "badge-blue",
    razorpay:   "badge-gold",
    qr:         "badge-blue",
    admin:      "badge-gold",
    user:       "badge-gray",
  };
  return <span className={`${map[status] || "badge-gray"} capitalize`}>{status}</span>;
};

/* ── Stat card ───────────────────────────────────────── */
export const StatCard = ({ icon: Icon, label, value, sub, color = "gold", loading }) => {
  const colors = {
    gold:    "bg-gold-500/10 text-gold-400 border-gold-500/20",
    green:   "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    rose:    "bg-rose-500/10 text-rose-400 border-rose-500/20",
    sky:     "bg-sky-500/10 text-sky-400 border-sky-500/20",
    amber:   "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  return (
    <div className="stat-card">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {loading ? (
        <><Skeleton className="h-8 w-24 mb-1" /><Skeleton className="h-3 w-16" /></>
      ) : (
        <>
          <p className="font-display text-3xl text-white mb-0.5">{value}</p>
          <p className="text-xs text-ink-400">{label}</p>
          {sub && <p className="text-xs text-ink-500 mt-1">{sub}</p>}
        </>
      )}
    </div>
  );
};

/* ── Search input ────────────────────────────────────── */
export const SearchInput = ({ value, onChange, placeholder = "Search…" }) => (
  <div className="relative">
    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input value={value} onChange={onChange} placeholder={placeholder}
      className="input pl-10 pr-4 w-full" />
  </div>
);

/* ── Image uploader ──────────────────────────────────── */
export const ImageUploader = ({ files, setFiles, maxFiles = 5 }) => {
  const handleChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, maxFiles);
    setFiles(selected);
  };
  return (
    <div>
      <label
        htmlFor="img-upload"
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-ink-600 rounded-xl cursor-pointer hover:border-gold-500 transition-colors bg-ink-900/50"
      >
        <svg className="w-8 h-8 text-ink-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-xs text-ink-400">Click to upload images <span className="text-gold-500">(max {maxFiles})</span></p>
      </label>
      <input id="img-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleChange} />
      {files.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {files.map((f, i) => (
            <div key={i} className="relative group">
              <img src={URL.createObjectURL(f)} alt="" className="w-16 h-16 object-cover rounded-lg border border-ink-600" />
              <button onClick={() => setFiles(fs => fs.filter((_, j) => j !== i))}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
