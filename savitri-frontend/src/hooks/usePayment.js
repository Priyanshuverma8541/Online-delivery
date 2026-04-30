import { useCallback } from "react";
import { paymentAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export const usePayment = () => {
  const { clearCart } = useCart();

  // ── Razorpay flow ─────────────────────────────────────────
  const payWithRazorpay = useCallback(async ({ items, totalAmount, onSuccess }) => {
    try {
      const { data } = await paymentAPI.createRazorpayOrder({ items, totalAmount });
      const { rpOrder, order } = data;

      const options = {
        key:         import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount:      rpOrder.amount,
        currency:    "INR",
        name:        "Savitri Jewellers",
        description: "Handcrafted jewellery",
        order_id:    rpOrder.id,
        image:       "/logo.png",
        handler: async (response) => {
          try {
            const verify = await paymentAPI.verifyPayment({
              ...response,
              orderId: order._id,
            });
            if (verify.data.success) {
              await clearCart();
              toast.success("Payment successful! 🎉");
              onSuccess?.(verify.data.order);
            }
          } catch {
            toast.error("Payment verification failed. Contact support.");
          }
        },
        prefill: {},
        theme: { color: "#d4a82a" },
        modal: { ondismiss: () => toast("Payment cancelled") },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => toast.error("Payment failed. Please try again."));
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate payment");
    }
  }, [clearCart]);

  // ── QR / UPI flow ─────────────────────────────────────────
  const initiateQrPayment = useCallback(async ({ items, totalAmount }) => {
    try {
      const { data } = await paymentAPI.initiateQr({ items, totalAmount });
      return data; // { order, qr: { ref, upiId, amount, deepLink } }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate QR");
      return null;
    }
  }, []);

  const confirmQrPayment = useCallback(async ({ orderId, qrPaymentRef, onSuccess }) => {
    try {
      const { data } = await paymentAPI.confirmQr({ orderId, qrPaymentRef });
      if (data.success) {
        await clearCart();
        toast.success("Payment confirmed! 🎉");
        onSuccess?.(data.order);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Confirmation failed");
    }
  }, [clearCart]);

  return { payWithRazorpay, initiateQrPayment, confirmQrPayment };
};
