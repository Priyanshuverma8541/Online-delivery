import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Package, User, ArrowRight, Gem } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function DashboardHome() {
  const { user }       = useAuth();
  const { totalItems, totalPrice } = useCart();

  const quickLinks = [
    { to: "/shop",             icon: Gem,         label: "Browse Shop",    desc: "Explore our collection",   color: "from-gold-400 to-gold-600" },
    { to: "/dashboard/cart",   icon: ShoppingBag, label: "View Cart",      desc: `${totalItems} item(s) · ₹${totalPrice.toLocaleString("en-IN")}`, color: "from-obsidian-700 to-obsidian-900" },
    { to: "/dashboard/orders", icon: Package,     label: "My Orders",      desc: "Track your purchases",     color: "from-emerald-500 to-emerald-700" },
    { to: "/dashboard/profile",icon: User,        label: "Profile",        desc: "Manage account details",   color: "from-violet-500 to-violet-700" },
  ];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <motion.div {...fadeUp(0)}>
        <p className="section-tag mb-1">Dashboard</p>
        <h1 className="font-display text-4xl text-obsidian-900">
          Good day, <span className="text-gold-600">{user?.fullName?.split(" ")[0]}</span> ✨
        </h1>
        <p className="text-obsidian-500 mt-2">Here's a quick overview of your account.</p>
      </motion.div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map(({ to, icon: Icon, label, desc, color }, i) => (
          <motion.div key={to} {...fadeUp(i * 0.08)}>
            <Link to={to} className="card p-6 flex flex-col gap-4 hover:shadow-card-hover group h-full">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-obsidian-800 text-sm">{label}</h3>
                <p className="text-obsidian-400 text-xs mt-0.5">{desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-obsidian-300 group-hover:text-gold-500 group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Account info strip */}
      <motion.div {...fadeUp(0.3)} className="card p-6">
        <h2 className="font-display text-2xl mb-4">Account Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Full Name", value: user?.fullName },
            { label: "User ID",   value: user?.userId },
            { label: "Email",     value: user?.email },
            { label: "Role",      value: user?.role || "customer" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="label">{label}</p>
              <p className="text-sm text-obsidian-800 font-medium capitalize">{value || "—"}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
