import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Package, User, LogOut, Gem, Home, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const sideLinks = [
  { to: "/dashboard",         icon: LayoutDashboard, label: "Overview",  end: true },
  { to: "/dashboard/cart",    icon: ShoppingBag,     label: "My Cart" },
  { to: "/dashboard/orders",  icon: Package,         label: "My Orders" },
  { to: "/dashboard/profile", icon: User,            label: "Profile" },
];

export default function DashboardLayout() {
  const { user, logout }  = useAuth();
  const { totalItems }    = useCart();
  const navigate          = useNavigate();
  const [sideOpen, setSideOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  const SideContent = ({ onClose }) => (
    <>
      {/* Logo */}
      <div className="p-5 sm:p-6 border-b border-obsidian-800">
        <Link to="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center">
            <Gem className="w-3.5 h-3.5 text-obsidian-900" />
          </div>
          <span className="font-display text-lg">Savitri <span className="text-gold-400">Jewels</span></span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-5 sm:p-6 border-b border-obsidian-800">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian-900 text-lg sm:text-xl font-bold mb-3">
          {user?.fullName?.[0]}
        </div>
        <p className="font-medium text-sm">{user?.fullName}</p>
        <p className="text-xs text-obsidian-400 mt-0.5 truncate">{user?.email}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 sm:p-4 space-y-1">
        {sideLinks.map(({ to, icon: Icon, label, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive ? "bg-gold-gradient text-obsidian-900" : "text-obsidian-300 hover:bg-obsidian-800 hover:text-white"
              }`
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
            {label === "My Cart" && totalItems > 0 && (
              <span className="ml-auto bg-gold-500 text-obsidian-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 sm:p-4 border-t border-obsidian-800 space-y-1">
        <Link to="/" onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-obsidian-300 hover:bg-obsidian-800 hover:text-white transition-all">
          <Home className="w-4 h-4" /> Back to Store
        </Link>
        <button onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-900/30 transition-all">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 lg:w-64 bg-obsidian-950 text-white shrink-0 sticky top-0 h-screen overflow-y-auto">
        <SideContent onClose={() => {}} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sideOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSideOpen(false)}
          />
          <motion.aside
            initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="relative w-72 max-w-[85vw] bg-obsidian-950 text-white flex flex-col h-full overflow-y-auto z-10"
          >
            <button onClick={() => setSideOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-obsidian-800 text-obsidian-400 hover:text-white transition-all z-10">
              <X className="w-5 h-5" />
            </button>
            <SideContent onClose={() => setSideOpen(false)} />
          </motion.aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-obsidian-950 text-white border-b border-obsidian-800 sticky top-0 z-30">
          <button onClick={() => setSideOpen(true)} className="p-2 rounded-xl hover:bg-obsidian-800 transition-all">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gold-gradient flex items-center justify-center">
              <Gem className="w-3 h-3 text-obsidian-900" />
            </div>
            <span className="font-display text-base text-white">Savitri <span className="text-gold-400">Jewels</span></span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {totalItems > 0 && (
              <Link to="/dashboard/cart" className="relative p-2">
                <ShoppingBag className="w-5 h-5 text-obsidian-300" />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-obsidian-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </Link>
            )}
            <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian-900 text-xs font-bold">
              {user?.fullName?.[0]}
            </div>
          </div>
        </div>

        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
