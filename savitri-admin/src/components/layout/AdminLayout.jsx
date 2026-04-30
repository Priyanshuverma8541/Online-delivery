import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { io } from "socket.io-client";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const PAGE_TITLES = {
  "/":         "Dashboard",
  "/products": "Products",
  "/orders":   "Orders",
  "/users":    "Customers",
};

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { user }     = useAuth();
  const [notifs, setNotifs] = useState([]);
  const title = PAGE_TITLES[pathname] || "Admin";

  // Real-time new-order notifications via socket
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:8080", {
      transports: ["websocket"],
    });
    socket.on("connect", () => socket.emit("joinUserRoom", "admin"));
    socket.on("orderCreated", (order) => {
      toast.success(`🛍 New order #${order._id?.slice(-6).toUpperCase()}!`);
      setNotifs((n) => [order, ...n].slice(0, 10));
    });
    return () => socket.disconnect();
  }, []);

  return (
    <div className="flex h-screen bg-ink-950 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-ink-800 bg-ink-900/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0">
          <h1 className="font-display text-xl text-white">{title}</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="btn-icon relative">
                <Bell className="w-4 h-4" />
                {notifs.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-gold-500 text-ink-900 text-[9px] font-bold rounded-full flex items-center justify-center">
                    {notifs.length > 9 ? "9+" : notifs.length}
                  </span>
                )}
              </button>
            </div>
            <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center text-ink-900 text-xs font-bold shadow-gold">
              {user?.fullName?.[0]}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
