import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import { Package, ArrowRight } from "lucide-react";
import { orderAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { usePayment } from "../../hooks/usePayment";
import { PageLoader, EmptyState, StatusBadge } from "../ui";
import toast from "react-hot-toast";

const STEPS = ["ordered","processing","shipped","delivered"];

function ProgressBar({ status }) {
  const idx = Math.max(0, STEPS.indexOf((status || "").toLowerCase()));
  return (
    <div className="mt-4">
      <div className="flex items-center gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-colors ${i <= idx ? "bg-gold-500" : "bg-obsidian-200"}`} />
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 transition-colors ${i < idx ? "bg-gold-400" : "bg-obsidian-200"}`} />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1">
        {STEPS.map((s, i) => (
          <span key={s} className={`text-[9px] sm:text-[10px] font-medium capitalize ${i <= idx ? "text-gold-600" : "text-obsidian-300"}`}>{s}</span>
        ))}
      </div>
    </div>
  );
}

export default function Orders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token }       = useAuth();
  const { payWithRazorpay }   = usePayment();

  useEffect(() => {
    orderAPI.myOrders()
      .then(({ data }) => setOrders(data.orders || []))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  /* Socket live updates */
  useEffect(() => {
    const uid = user?._id || user?.id;
    if (!uid) return;
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:8080", { transports: ["websocket"] });
    socket.on("connect", () => socket.emit("joinUserRoom", uid));
    socket.on("orderUpdated", (updated) => {
      setOrders(prev => prev.map(o => o._id === updated._id ? updated : o));
      toast.success(`Order #${updated._id.slice(-6)} → ${updated.status}`);
    });
    return () => socket.disconnect();
  }, [user]);

  const handlePayNow = async (order) => {
    await payWithRazorpay({
      items: order.items.map(i => ({
        productId: i.productId?._id || i.productId,
        quantity:  i.quantity,
        price:     i.productId?.price || i.price,
      })),
      totalAmount: order.totalAmount,
      onSuccess: (updated) => setOrders(prev => prev.map(o => o._id === updated._id ? updated : o)),
    });
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-display text-2xl sm:text-3xl text-obsidian-900">My Orders</h1>
        <Link to="/shop" className="text-xs sm:text-sm text-gold-600 hover:text-gold-700 font-medium transition-colors">
          + Shop more
        </Link>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          message="Place your first order to see it here."
          action={<Link to="/shop" className="btn-gold text-sm">Shop Now <ArrowRight className="w-4 h-4" /></Link>}
        />
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {orders.map((order, i) => {
            const firstImg = order.items?.[0]?.productId?.images?.[0];
            return (
              <motion.div key={order._id}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-2xl shadow-card p-4 sm:p-5"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-obsidian-100 shrink-0">
                    <img
                      src={firstImg || "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=150&q=80"}
                      alt="order" className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                      <span className="font-mono text-xs text-obsidian-400">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <StatusBadge status={order.status} />
                      <StatusBadge status={order.paymentStatus} />
                    </div>

                    {/* Items summary */}
                    <p className="text-xs sm:text-sm text-obsidian-600 truncate mb-1">
                      {order.items?.map((it, j) => (
                        `${it.productId?.name || "Item"}${j < order.items.length - 1 ? ", " : ""}`
                      ))}
                    </p>

                    {/* Amount + date */}
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg sm:text-xl text-obsidian-900">
                        ₹{order.totalAmount?.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs text-obsidian-400">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <ProgressBar status={order.status} />

                {/* Pay now if pending */}
                {order.paymentStatus === "pending" && (
                  <div className="mt-3 pt-3 border-t border-obsidian-100">
                    <button onClick={() => handlePayNow(order)} className="btn-gold text-sm">
                      Complete Payment
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
