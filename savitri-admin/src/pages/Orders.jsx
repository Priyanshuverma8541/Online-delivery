import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { io } from "socket.io-client";
import { RefreshCw, Eye, ChevronDown } from "lucide-react";
import { orderAPI } from "../services/api";
import { Modal, Empty, PageLoader, StatusBadge, SearchInput } from "../components/ui";
import toast from "react-hot-toast";

const ORDER_STATUSES = ["ordered", "processing", "shipped", "delivered", "cancelled"];
const PAY_STATUSES   = ["pending", "paid", "failed", "refunded"];

function OrderDetail({ order, onStatusChange, saving }) {
  if (!order) return null;
  const { user, items, totalAmount, status, paymentStatus, paymentMethod, createdAt, paymentInfo } = order;

  return (
    <div className="space-y-5">
      {/* Meta */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="card-sm">
          <p className="label mb-2">Customer</p>
          <p className="text-white font-medium">{user?.fullName || "—"}</p>
          <p className="text-ink-400 text-xs">{user?.email}</p>
        </div>
        <div className="card-sm">
          <p className="label mb-2">Order Info</p>
          <p className="font-mono text-gold-400 text-xs">#{order._id.slice(-8).toUpperCase()}</p>
          <p className="text-ink-400 text-xs mt-0.5">{new Date(createdAt).toLocaleString("en-IN")}</p>
        </div>
        <div className="card-sm">
          <p className="label mb-2">Payment</p>
          <div className="flex gap-2 flex-wrap">
            <StatusBadge status={paymentStatus} />
            <StatusBadge status={paymentMethod} />
          </div>
          {paymentInfo?.razorpay_payment_id && (
            <p className="text-ink-500 text-[10px] font-mono mt-1 break-all">{paymentInfo.razorpay_payment_id}</p>
          )}
        </div>
        <div className="card-sm">
          <p className="label mb-2">Total</p>
          <p className="font-display text-2xl text-gold-400">₹{totalAmount?.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Items */}
      <div>
        <p className="label mb-3">Order Items</p>
        <div className="space-y-2">
          {(items || []).map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-ink-900 rounded-xl">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-ink-700 shrink-0">
                <img
                  src={item.productId?.images?.[0] || "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=80&q=80"}
                  alt="" className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-medium truncate">{item.productId?.name || "Product"}</p>
                <p className="text-xs text-ink-400">Qty: {item.quantity} × ₹{item.price?.toLocaleString("en-IN")}</p>
              </div>
              <p className="text-gold-400 font-mono text-sm shrink-0">₹{(item.quantity * item.price).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Status update */}
      <div>
        <p className="label mb-3">Update Order Status</p>
        <div className="flex flex-wrap gap-2">
          {ORDER_STATUSES.map((s) => (
            <button
              key={s}
              disabled={saving || s === status}
              onClick={() => onStatusChange(order._id, s)}
              className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all border ${
                s === status
                  ? "bg-gold-500/20 text-gold-400 border-gold-500/30 cursor-default"
                  : "bg-ink-900 text-ink-300 border-ink-700 hover:border-gold-500/50 hover:text-gold-400"
              } disabled:opacity-40`}
            >
              {saving && s !== status ? "…" : s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const [orders,   setOrders]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [search,   setSearch]   = useState("");
  const [statusF,  setStatusF]  = useState("all");
  const [paymentF, setPaymentF] = useState("all");
  const [viewing,  setViewing]  = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await orderAPI.getAll();
      setOrders(data.orders || []);
    } catch { toast.error("Failed to load orders"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // Live socket updates
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL || "http://localhost:8080", { transports: ["websocket"] });
    socket.on("connect", () => socket.emit("joinUserRoom", "admin"));
    socket.on("orderUpdated", (updated) => {
      setOrders(prev => prev.map(o => o._id === updated._id ? { ...o, ...updated } : o));
      if (viewing?._id === updated._id) setViewing(updated);
    });
    return () => socket.disconnect();
  }, [viewing]);

  const handleStatusChange = async (orderId, newStatus) => {
    setSaving(true);
    try {
      const { data } = await orderAPI.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o._id === orderId ? data.order : o));
      if (viewing?._id === orderId) setViewing(data.order);
      toast.success(`Order status → ${newStatus}`);
    } catch { toast.error("Update failed"); }
    finally { setSaving(false); }
  };

  const filtered = orders.filter(o => {
    const matchSearch  = o._id.includes(search) || o.user?.fullName?.toLowerCase().includes(search.toLowerCase()) || o.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus  = statusF  === "all" || o.status        === statusF;
    const matchPayment = paymentF === "all" || o.paymentStatus === paymentF;
    return matchSearch && matchStatus && matchPayment;
  });

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-xs font-mono text-ink-500 uppercase tracking-widest mb-0.5">Management</p>
          <h1 className="page-title">Orders</h1>
        </div>
        <button onClick={fetchOrders} className="btn-icon" title="Refresh"><RefreshCw className="w-4 h-4" /></button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, order ID…" />
        </div>
        <select className="select sm:w-36" value={statusF} onChange={(e) => setStatusF(e.target.value)}>
          <option value="all">All Status</option>
          {ORDER_STATUSES.map(s => <option key={s} value={s} className="bg-ink-900 capitalize">{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
        <select className="select sm:w-36" value={paymentF} onChange={(e) => setPaymentF(e.target.value)}>
          <option value="all">All Payments</option>
          {PAY_STATUSES.map(s => <option key={s} value={s} className="bg-ink-900 capitalize">{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-ink-700 bg-ink-900/60">
              <tr>
                <th className="th">Order ID</th>
                <th className="th">Customer</th>
                <th className="th">Items</th>
                <th className="th">Total</th>
                <th className="th">Status</th>
                <th className="th">Payment</th>
                <th className="th">Date</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={8}><Empty title="No orders found" message="Try adjusting filters." /></td></tr>
              )}
              {filtered.map((o) => (
                <motion.tr key={o._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="table-row">
                  <td className="td font-mono text-gold-400 text-xs">#{o._id.slice(-6).toUpperCase()}</td>
                  <td className="td">
                    <p className="text-white text-sm">{o.user?.fullName || "—"}</p>
                    <p className="text-ink-500 text-xs">{o.user?.email}</p>
                  </td>
                  <td className="td text-ink-400 text-xs">{o.items?.length} item(s)</td>
                  <td className="td font-mono text-gold-400">₹{o.totalAmount?.toLocaleString("en-IN")}</td>
                  <td className="td"><StatusBadge status={o.status} /></td>
                  <td className="td"><StatusBadge status={o.paymentStatus} /></td>
                  <td className="td text-ink-500 text-xs">{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  <td className="td">
                    <div className="flex justify-end">
                      <button onClick={() => setViewing(o)} className="btn-icon" title="View Details">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-ink-700 text-xs text-ink-500 font-mono">
          {filtered.length} order{filtered.length !== 1 ? "s" : ""} shown
        </div>
      </div>

      {/* Order detail modal */}
      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={`Order #${viewing?._id?.slice(-8).toUpperCase()}`}
        size="lg"
      >
        <OrderDetail order={viewing} onStatusChange={handleStatusChange} saving={saving} />
      </Modal>
    </div>
  );
}
