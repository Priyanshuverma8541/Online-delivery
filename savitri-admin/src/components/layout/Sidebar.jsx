import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  LogOut, Gem, ChevronLeft, ChevronRight, Bell, Settings,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const NAV = [
  { to: "/",        icon: LayoutDashboard, label: "Dashboard" },
  { to: "/products",icon: Package,         label: "Products" },
  { to: "/orders",  icon: ShoppingBag,     label: "Orders" },
  { to: "/users",   icon: Users,           label: "Customers" },
];

export default function Sidebar() {
  const { user, logout }  = useAuth();
  const navigate          = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`relative flex flex-col bg-sidebar border-r border-ink-800 transition-all duration-300 ${collapsed ? "w-16" : "w-60"} shrink-0`}>
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-ink-700 border border-ink-600 rounded-full flex items-center justify-center z-10 hover:bg-gold-500 hover:border-gold-500 hover:text-ink-900 text-ink-300 transition-all"
      >
        {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Logo */}
      <div className={`flex items-center gap-2.5 px-4 py-5 border-b border-ink-800 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center shadow-gold shrink-0">
          <Gem className="w-4 h-4 text-ink-900" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-display text-lg text-white leading-none">Savitri</p>
            <p className="text-[10px] font-mono text-gold-500 tracking-widest uppercase">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            title={collapsed ? label : ""}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-gold-500/15 text-gold-400 border border-gold-500/20"
                  : "text-ink-400 hover:bg-ink-700 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4.5 h-4.5 shrink-0 ${isActive ? "text-gold-400" : "text-ink-400 group-hover:text-white"}`} />
                {!collapsed && <span className="text-sm font-medium">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom - user info + logout */}
      <div className={`border-t border-ink-800 p-3 ${collapsed ? "flex flex-col items-center gap-2" : ""}`}>
        {!collapsed && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-ink-900 text-xs font-bold shrink-0 shadow-gold">
              {user?.fullName?.[0]}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
              <p className="text-[10px] text-gold-500 font-mono">Administrator</p>
            </div>
          </div>
        )}
        <button
          onClick={() => { logout(); navigate("/login"); }}
          title={collapsed ? "Logout" : ""}
          className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-ink-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
