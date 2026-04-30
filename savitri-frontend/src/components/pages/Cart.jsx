import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, QrCode, CreditCard, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { usePayment } from "../../hooks/usePayment";
import { paymentAPI } from "../../services/api";
import { Button, EmptyState } from "../ui";
import QRModal from "../ui/QRModal";

export default function Cart() {
  const { items, removeFromCart, loading, totalPrice } = useCart();
  const { payWithRazorpay, initiateQrPayment, confirmQrPayment } = usePayment();
  const navigate  = useNavigate();
  const [payLoading, setPayLoading]   = useState(false);
  const [qrData,     setQrData]       = useState(null);   // { order, qr }
  const [showQR,     setShowQR]       = useState(false);

  const orderItems = items.map(i => ({
    productId: i.productId?._id || i.productId,
    quantity:  i.quantity,
    price:     i.productId?.price || 0,
  }));

  const handleRazorpay = async () => {
    setPayLoading(true);
    await payWithRazorpay({
      items:       orderItems,
      totalAmount: totalPrice,
      onSuccess:   () => navigate("/dashboard/orders"),
    });
    setPayLoading(false);
  };

  const handleQr = async () => {
    setPayLoading(true);
    const data = await initiateQrPayment({ items: orderItems, totalAmount: totalPrice });
    if (data) { setQrData(data); setShowQR(true); }
    setPayLoading(false);
  };

  const handleQrConfirm = async () => {
    await confirmQrPayment({
      orderId:     qrData.order._id,
      qrPaymentRef: qrData.qr.ref,
      onSuccess:   () => { setShowQR(false); navigate("/dashboard/orders"); },
    });
  };

  if (items.length === 0) return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl text-obsidian-900">My Cart</h1>
      <EmptyState
        title="Your cart is empty"
        message="Add some beautiful jewellery to get started."
        action={<Link to="/shop" className="btn-gold">Browse Collection <ArrowRight className="w-4 h-4" /></Link>}
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-obsidian-900">My Cart</h1>
        <span className="text-obsidian-400 text-sm">{items.length} item(s)</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {items.map((item) => {
              const product  = item.productId || {};
              const subtotal = (product.price || 0) * item.quantity;
              return (
                <motion.div
                  key={item._id || product._id}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  className="card p-5 flex items-center gap-5"
                >
                  {/* Image */}
                  <Link to={`/product/${product._id}`} className="shrink-0">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-obsidian-100">
                      <img
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=200&q=80"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="font-display text-lg text-obsidian-900 hover:text-gold-700 truncate">{product.name}</h3>
                    </Link>
                    <p className="text-obsidian-400 text-xs capitalize">{product.category}</p>
                    <p className="font-display text-gold-600 text-xl mt-1">₹{subtotal.toLocaleString("en-IN")}</p>
                  </div>

                  {/* Qty + remove */}
                  <div className="flex flex-col items-end gap-3">
                    <button
                      onClick={() => removeFromCart(product._id)}
                      className="p-1.5 text-obsidian-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 text-sm border border-obsidian-200 rounded-full px-3 py-1">
                      <span className="text-obsidian-500">×{item.quantity}</span>
                      <span className="text-obsidian-400 text-xs">@ ₹{product.price?.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-28 space-y-5">
            <h2 className="font-display text-2xl text-obsidian-900">Order Summary</h2>

            <div className="space-y-2 text-sm">
              {items.map((item) => {
                const p = item.productId || {};
                return (
                  <div key={p._id} className="flex justify-between text-obsidian-600">
                    <span className="truncate max-w-[160px]">{p.name} ×{item.quantity}</span>
                    <span>₹{((p.price||0)*item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                );
              })}
            </div>

            <div className="gold-divider" />

            <div className="flex justify-between font-display text-2xl">
              <span>Total</span>
              <span className="text-gold-600">₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>

            <div className="space-y-3 pt-1">
              <Button variant="gold" size="lg" className="w-full" onClick={handleRazorpay} loading={payLoading}>
                <CreditCard className="w-4 h-4" /> Pay with Razorpay
              </Button>
              <Button variant="outline" size="lg" className="w-full" onClick={handleQr} loading={payLoading}>
                <QrCode className="w-4 h-4" /> Pay via QR / UPI
              </Button>
            </div>

            <p className="text-xs text-obsidian-400 text-center">
              Secured by 256-bit SSL encryption
            </p>
          </div>
        </div>
      </div>

      {/* QR Modal */}
      {showQR && qrData && (
        <QRModal
          qr={qrData.qr}
          onConfirm={handleQrConfirm}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
}
