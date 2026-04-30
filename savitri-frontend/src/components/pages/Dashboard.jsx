import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Package, User, LogOut, Gem, Home, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const sideLinks = [
  { to: "/dashboard",         icon: LayoutDashboard, label: "Overview",  end: true },
  { to: "/dashboard/cart",    icon: ShoppingBag,     label: "My Cart" },
  { to: "/dashboard/orders",  icon: Package,         label: "My Orders" },
  { to: "/dashboard/profile", icon: User,            label: "Profile" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { totalItems }   = useCart();
  const navigate         = useNavigate();

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div className="min-h-screen bg-ivory flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-obsidian-950 text-white shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Logo */}
        <div className="p-6 border-b border-obsidian-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center">
              <Gem className="w-3.5 h-3.5 text-obsidian-900" />
            </div>
            <span className="font-display text-lg">Savitri <span className="text-gold-400">Jewels</span></span>
          </Link>
        </div>

        {/* User info */}
        <div className="p-6 border-b border-obsidian-800">
          <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian-900 text-xl font-bold mb-3">
            {user?.fullName?.[0]}
          </div>
          <p className="font-medium text-sm">{user?.fullName}</p>
          <p className="text-xs text-obsidian-400 mt-0.5 truncate">{user?.email}</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {sideLinks.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? "bg-gold-gradient text-obsidian-900" : "text-obsidian-300 hover:bg-obsidian-800 hover:text-white"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
              {label === "My Cart" && totalItems > 0 && (
                <span className="ml-auto bg-gold-500 text-obsidian-900 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-obsidian-800 space-y-1">
          <Link to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-obsidian-300 hover:bg-obsidian-800 hover:text-white transition-all">
            <Home className="w-4 h-4" /> Back to Store
          </Link>
          <button onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-900/30 transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-obsidian-950 text-white border-b border-obsidian-800 sticky top-20 z-30">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {sideLinks.map(({ to, icon: Icon, label, end }) => (
              <NavLink key={to} to={to} end={end}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap shrink-0 transition-all ${
                    isActive ? "bg-gold-gradient text-obsidian-900 font-medium" : "text-obsidian-300 hover:bg-obsidian-800"
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5" />{label}
              </NavLink>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
