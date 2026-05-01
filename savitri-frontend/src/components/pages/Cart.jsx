import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, QrCode, CreditCard, ArrowRight } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { usePayment } from "../../hooks/usePayment";
import { Button, EmptyState } from "../ui";
import QRModal from "../ui/QRModal";

export default function Cart() {
  const { items, removeFromCart, loading, totalPrice } = useCart();
  const { payWithRazorpay, initiateQrPayment, confirmQrPayment } = usePayment();
  const navigate = useNavigate();
  const [payLoading, setPayLoading] = useState(false);
  const [qrData,     setQrData]     = useState(null);
  const [showQR,     setShowQR]     = useState(false);

  const orderItems = items.map(i => ({
    productId: i.productId?._id || i.productId,
    quantity:  i.quantity,
    price:     i.productId?.price || 0,
  }));

  const handleRazorpay = async () => {
    setPayLoading(true);
    await payWithRazorpay({
      items: orderItems, totalAmount: totalPrice,
      onSuccess: () => navigate("/dashboard/orders"),
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
      orderId: qrData.order._id, qrPaymentRef: qrData.qr.ref,
      onSuccess: () => { setShowQR(false); navigate("/dashboard/orders"); },
    });
  };

  if (items.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <h1 className="font-display text-3xl sm:text-4xl text-obsidian-900">My Cart</h1>
        <EmptyState
          title="Your cart is empty"
          message="Add some beautiful jewellery to get started."
          action={
            <Link to="/shop" className="btn-gold text-sm">
              Browse Collection <ArrowRight className="w-4 h-4" />
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl sm:text-4xl text-obsidian-900">My Cart</h1>
        <span className="text-obsidian-400 text-sm">{items.length} item(s)</span>
      </div>

      {/* On mobile: items stacked, summary below. On lg: 2/3 + 1/3 grid */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6">

        {/* Items list */}
        <div className="lg:col-span-2 space-y-3">
          <AnimatePresence>
            {items.map((item) => {
              const product  = item.productId || {};
              const subtotal = (product.price || 0) * item.quantity;
              return (
                <motion.div
                  key={item._id || product._id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  className="card p-3 sm:p-5 flex items-center gap-3 sm:gap-5"
                >
                  <Link to={`/product/${product._id}`} className="shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-obsidian-100">
                      <img
                        src={product.images?.[0] || "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=200&q=80"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="font-display text-base sm:text-lg text-obsidian-900 hover:text-gold-700 truncate">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-obsidian-400 text-xs capitalize">{product.category}</p>
                    <p className="font-display text-gold-600 text-lg sm:text-xl mt-0.5">
                      ₹{subtotal.toLocaleString("en-IN")}
                    </p>
                    <p className="text-obsidian-400 text-xs mt-0.5">
                      {item.quantity} × ₹{product.price?.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="p-2 text-obsidian-300 hover:text-red-500 transition-colors shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg hover:bg-red-50"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-4 sm:p-6 lg:sticky lg:top-28 space-y-4 sm:space-y-5">
            <h2 className="font-display text-xl sm:text-2xl text-obsidian-900">Order Summary</h2>

            <div className="space-y-2 text-sm">
              {items.map((item) => {
                const p = item.productId || {};
                return (
                  <div key={p._id} className="flex justify-between text-obsidian-600">
                    <span className="truncate max-w-[55%] sm:max-w-[160px]">{p.name} ×{item.quantity}</span>
                    <span className="shrink-0">₹{((p.price || 0) * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                );
              })}
            </div>

            <div className="gold-divider" />

            <div className="flex justify-between font-display text-xl sm:text-2xl">
              <span>Total</span>
              <span className="text-gold-600">₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>

            <div className="space-y-2.5 pt-1">
              <Button variant="gold" size="md" className="w-full" onClick={handleRazorpay} loading={payLoading}>
                <CreditCard className="w-4 h-4" /> Pay with Razorpay
              </Button>
              <Button variant="outline" size="md" className="w-full" onClick={handleQr} loading={payLoading}>
                <QrCode className="w-4 h-4" /> Pay via QR / UPI
              </Button>
            </div>

            <p className="text-xs text-obsidian-400 text-center">Secured by 256-bit SSL encryption</p>
          </div>
        </div>
      </div>

      {showQR && qrData && (
        <QRModal qr={qrData.qr} onConfirm={handleQrConfirm} onClose={() => setShowQR(false)} />
      )}
    </div>
  );
}
