import { useState, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Gem, LogOut, Package, User, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const navLinks = [
  { to: "/",         label: "Home" },
  { to: "/shop",     label: "Shop" },
  { to: "/about",    label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact",  label: "Contact" },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const menuRef  = useRef(null);
  const location = useLocation();

  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => { setOpen(false); setUserMenu(false); }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setUserMenu(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleLogout = () => { logout(); setUserMenu(false); setOpen(false); navigate("/"); };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || open ? "bg-cream/98 backdrop-blur-md shadow-sm border-b border-gold-100" : "bg-transparent"
      }`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
              <Gem className="w-4 h-4 text-obsidian-900" />
            </div>
            <span className="font-display text-lg md:text-xl font-semibold text-obsidian-900 group-hover:text-gold-600 transition-colors">
              Savitri <span className="text-gold-600">Jewels</span>
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink to={to} end={to === "/"}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      isActive ? "bg-gold-100 text-gold-700" : "text-obsidian-600 hover:text-obsidian-900 hover:bg-obsidian-50"
                    }`
                  }>{label}</NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <Link to={isAuthenticated ? "/dashboard/cart" : "/login"}
              className="relative p-2.5 rounded-full text-obsidian-600 hover:bg-obsidian-100 transition-all" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold-500 text-obsidian-900 text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </motion.span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-1.5 pl-2 pr-1.5 py-1.5 rounded-full hover:bg-obsidian-100 transition-all">
                  <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian-900 text-xs font-bold">
                    {user?.fullName?.[0]?.toUpperCase()}
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-obsidian-500 transition-transform duration-200 hidden sm:block ${userMenu ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {userMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gold-100 z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-obsidian-100">
                        <p className="text-[10px] font-mono text-obsidian-400 uppercase tracking-widest">signed in as</p>
                        <p className="text-sm font-medium text-obsidian-800 truncate mt-0.5">{user?.email}</p>
                      </div>
                      {[
                        { to: "/dashboard",         icon: User,    label: "Dashboard" },
                        { to: "/dashboard/orders",  icon: Package, label: "My Orders" },
                        { to: "/dashboard/profile", icon: User,    label: "Profile" },
                      ].map(({ to, icon: Icon, label }) => (
                        <Link key={to} to={to} onClick={() => setUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-obsidian-700 hover:bg-gold-50 transition-colors">
                          <Icon className="w-4 h-4 text-gold-500" />{label}
                        </Link>
                      ))}
                      <div className="border-t border-obsidian-100">
                        <button onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-obsidian-700 hover:text-obsidian-900 rounded-full hover:bg-obsidian-50 transition-all">Log in</Link>
                <Link to="/register" className="btn-gold text-sm px-5 py-2">Sign up</Link>
              </div>
            )}

            <button className="md:hidden p-2 rounded-full hover:bg-obsidian-100 transition-all"
              onClick={() => setOpen(!open)} aria-label="Toggle menu">
              {open ? <X className="w-5 h-5 text-obsidian-700" /> : <Menu className="w-5 h-5 text-obsidian-700" />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.28 }}
            className="fixed inset-0 z-40 bg-cream pt-16 flex flex-col overflow-y-auto md:hidden">
            <div className="flex-1 px-5 py-6 space-y-1">
              {navLinks.map(({ to, label }, i) => (
                <motion.div key={to} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                  <NavLink to={to} end={to === "/"} onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-5 py-4 rounded-2xl text-base font-medium transition-all ${
                        isActive ? "bg-gold-100 text-gold-700" : "text-obsidian-700 hover:bg-obsidian-50"
                      }`}>{label}</NavLink>
                </motion.div>
              ))}
              {isAuthenticated && (
                <div className="pt-4 border-t border-gold-100 space-y-1">
                  {[
                    { to: "/dashboard",         icon: User,        label: "Dashboard" },
                    { to: "/dashboard/cart",    icon: ShoppingBag, label: "My Cart",   badge: totalItems },
                    { to: "/dashboard/orders",  icon: Package,     label: "My Orders" },
                    { to: "/dashboard/profile", icon: User,        label: "Profile" },
                  ].map(({ to, icon: Icon, label, badge }) => (
                    <Link key={to} to={to} onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-5 py-4 rounded-2xl text-base font-medium text-obsidian-700 hover:bg-obsidian-50 transition-all">
                      <Icon className="w-5 h-5 text-gold-500" />{label}
                      {badge > 0 && (
                        <span className="ml-auto w-5 h-5 bg-gold-500 text-obsidian-900 text-xs font-bold rounded-full flex items-center justify-center">{badge}</span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="px-5 py-6 border-t border-gold-100">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian-900 font-bold text-sm shadow-gold">
                      {user?.fullName?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-obsidian-900">{user?.fullName}</p>
                      <p className="text-xs text-obsidian-400">{user?.email}</p>
                    </div>
                  </div>
                  <button onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/register" onClick={() => setOpen(false)}
                    className="btn-gold w-full justify-center py-4 text-base rounded-2xl">Create Account</Link>
                  <Link to="/login" onClick={() => setOpen(false)}
                    className="flex items-center justify-center w-full py-4 rounded-2xl border-2 border-gold-300 text-gold-700 font-medium text-base hover:bg-gold-50 transition-colors">Log In</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
