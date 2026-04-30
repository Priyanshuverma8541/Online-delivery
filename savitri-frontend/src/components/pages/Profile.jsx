import { motion } from "framer-motion";
import { User, Mail, AtSign, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  const fields = [
    { icon: User,   label: "Full Name", value: user?.fullName },
    { icon: AtSign, label: "User ID",   value: user?.userId },
    { icon: Mail,   label: "Email",     value: user?.email },
    { icon: Shield, label: "Role",      value: user?.role || "customer" },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-4xl text-obsidian-900">Profile</h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-8"
      >
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian-900 font-display text-4xl shadow-gold">
            {user?.fullName?.[0]}
          </div>
          <div>
            <h2 className="font-display text-3xl text-obsidian-900">{user?.fullName}</h2>
            <p className="text-obsidian-400 text-sm capitalize mt-0.5">{user?.role || "Customer"} Account</p>
          </div>
        </div>

        <div className="gold-divider" />

        <div className="grid sm:grid-cols-2 gap-6 mt-6">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="space-y-1">
              <label className="label flex items-center gap-1.5">
                <Icon className="w-3 h-3" /> {label}
              </label>
              <p className="text-obsidian-800 font-medium text-sm bg-ivory px-4 py-3 rounded-xl capitalize">
                {value || "—"}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-obsidian-100">
          <p className="text-xs text-obsidian-400 text-center">
            To update your account details, please contact our support team at{" "}
            <a href="mailto:contact@savitrijewels.com" className="text-gold-600 hover:underline">
              contact@savitrijewels.com
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
