import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, User, Menu, X, Gem,
  LogOut, Package, Heart, ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const navLinks = [
  { to: "/",        label: "Home" },
  { to: "/shop",    label: "Shop" },
  { to: "/about",   label: "About" },
  { to: "/services",label: "Services" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open,       setOpen]       = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [userMenu,   setUserMenu]   = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => { logout(); setUserMenu(false); navigate("/"); };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-cream/95 backdrop-blur-md shadow-sm border-b border-gold-100" : "bg-transparent"
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
            <Gem className="w-4 h-4 text-obsidian-900" />
          </div>
          <span className="font-display text-xl font-semibold text-obsidian-900 group-hover:text-gold-600 transition-colors">
            Savitri <span className="text-gold-600">Jewels</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-body font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gold-100 text-gold-700"
                      : "text-obsidian-600 hover:text-obsidian-900 hover:bg-obsidian-50"
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Link
            to={isAuthenticated ? "/dashboard/cart" : "/login"}
            className="relative p-2.5 rounded-full text-obsidian-600 hover:bg-obsidian-100 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-obsidian-900 text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {totalItems > 9 ? "9+" : totalItems}
              </motion.span>
            )}
          </Link>

          {/* User menu or login */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-full hover:bg-obsidian-100 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian-900 text-xs font-bold">
                  {user?.fullName?.[0]?.toUpperCase()}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-obsidian-500 transition-transform ${userMenu ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {userMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-52 card-glass rounded-2xl overflow-hidden border border-gold-100 z-50"
                  >
                    <div className="px-4 py-3 border-b border-obsidian-100">
                      <p className="text-xs font-mono text-obsidian-400">signed in as</p>
                      <p className="text-sm font-medium text-obsidian-800 truncate">{user?.email}</p>
                    </div>
                    {[
                      { to: "/dashboard",         icon: User,    label: "Dashboard" },
                      { to: "/dashboard/orders",  icon: Package, label: "My Orders" },
                      { to: "/dashboard/profile", icon: User,    label: "Profile" },
                    ].map(({ to, icon: Icon, label }) => (
                      <Link key={to} to={to} onClick={() => setUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-obsidian-700 hover:bg-gold-50 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-gold-500" />
                        {label}
                      </Link>
                    ))}
                    <div className="border-t border-obsidian-100">
                      <button onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm">Log in</Link>
              <Link to="/register" className="btn-gold text-sm px-5 py-2.5">Sign up</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 rounded-full hover:bg-obsidian-100 transition-all"
            onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-cream/98 backdrop-blur-md border-t border-gold-100 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-1">
              {navLinks.map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === "/"} onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive ? "bg-gold-100 text-gold-700" : "text-obsidian-700 hover:bg-obsidian-50"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <div className="pt-4 flex gap-3">
                  <Link to="/login"    onClick={() => setOpen(false)} className="btn-outline w-full text-sm justify-center">Log in</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="btn-gold w-full text-sm justify-center">Sign up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
