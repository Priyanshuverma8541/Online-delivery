import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";
import { io } from "socket.io-client";
import { orderAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { PageLoader, EmptyState, StatusBadge, Button } from "../ui";
import { usePayment } from "../../hooks/usePayment";
import toast from "react-hot-toast";

const STEPS = ["ordered", "processing", "shipped", "delivered"];

function OrderProgress({ status }) {
  const idx = Math.max(0, STEPS.indexOf((status || "").toLowerCase()));
  return (
    <div className="flex items-center gap-1 mt-3">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full transition-colors ${i <= idx ? "bg-gold-500" : "bg-obsidian-200"}`} />
            <span className="text-[9px] text-obsidian-400 mt-1 capitalize hidden sm:block">{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 transition-colors ${i < idx ? "bg-gold-400" : "bg-obsidian-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Orders() {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token }       = useAuth();
  const { payWithRazorpay }   = usePayment();

  // Fetch orders
  useEffect(() => {
    orderAPI.myOrders()
      .then(({ data }) => setOrders(data.orders || []))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  // Socket for real-time order updates
  useEffect(() => {
    if (!user?._id && !user?.id) return;
    const uid = user._id || user.id;
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:8080", {
      transports: ["websocket"],
    });

    socket.on("connect", () => socket.emit("joinUserRoom", uid));

    socket.on("orderUpdated", (updated) => {
      setOrders((prev) => prev.map((o) => o._id === updated._id ? updated : o));
      toast.success(`Order #${updated._id.slice(-6)} updated → ${updated.status}`);
    });

    return () => socket.disconnect();
  }, [user]);

  const handlePayNow = async (order) => {
    const items = order.items.map(i => ({
      productId: i.productId?._id || i.productId,
      quantity:  i.quantity,
      price:     i.productId?.price || i.price,
    }));
    await payWithRazorpay({
      items,
      totalAmount: order.totalAmount,
      onSuccess: (updated) => setOrders(prev => prev.map(o => o._id === updated._id ? updated : o)),
    });
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-obsidian-900">My Orders</h1>
        <Link to="/shop" className="btn-ghost text-sm">Continue Shopping</Link>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          message="Place your first order to see it here."
          action={<Link to="/shop" className="btn-gold">Shop Now <ArrowRight className="w-4 h-4" /></Link>}
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => {
            const firstImg = order.items?.[0]?.productId?.images?.[0];
            return (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-obsidian-100 shrink-0">
                    <img
                      src={firstImg || "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=200&q=80"}
                      alt="order"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Header row */}
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-mono text-xs text-obsidian-400">#{order._id.slice(-8).toUpperCase()}</span>
                      <StatusBadge status={order.status} />
                      <StatusBadge status={order.paymentStatus} />
                      <span className="text-xs text-obsidian-400 ml-auto">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="text-sm text-obsidian-600 mb-2">
                      {order.items.map((item, j) => (
                        <span key={j}>
                          {item.productId?.name || "Product"} ×{item.quantity}
                          {j < order.items.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>

                    {/* Total */}
                    <p className="font-display text-2xl text-obsidian-900">
                      ₹{order.totalAmount?.toLocaleString("en-IN")}
                    </p>

                    {/* Progress */}
                    <OrderProgress status={order.status} />
                  </div>
                </div>

                {/* Pay now button for pending orders */}
                {order.paymentStatus === "pending" && (
                  <div className="mt-4 pt-4 border-t border-obsidian-100">
                    <Button variant="gold" size="sm" onClick={() => handlePayNow(order)}>
                      Complete Payment
                    </Button>
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
