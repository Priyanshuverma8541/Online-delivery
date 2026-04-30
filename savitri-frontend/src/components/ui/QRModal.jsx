import { motion, AnimatePresence } from "framer-motion";
import { X, QrCode, CheckCircle, Copy } from "lucide-react";
import { Button } from "./index";
import toast from "react-hot-toast";

export default function QRModal({ qr, onConfirm, onClose }) {
  const copy = () => { navigator.clipboard.writeText(qr.upiId); toast.success("UPI ID copied!"); };

  // Build QR code using free API
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qr.deepLink)}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-gold-600" />
              <h2 className="font-display text-2xl">Scan & Pay</h2>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-obsidian-100 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Amount */}
          <div className="text-center mb-6">
            <p className="text-obsidian-500 text-sm">Amount to pay</p>
            <p className="font-display text-4xl text-gold-600 mt-1">₹{qr.amount?.toLocaleString("en-IN")}</p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl border-2 border-gold-100 bg-white shadow-sm">
              <img src={qrImageUrl} alt="UPI QR Code" className="w-[180px] h-[180px]" />
            </div>
          </div>

          {/* UPI ID */}
          <div className="bg-obsidian-50 rounded-xl p-4 flex items-center justify-between mb-6">
            <div>
              <p className="text-xs text-obsidian-400 mb-0.5">UPI ID</p>
              <p className="text-sm font-mono font-medium text-obsidian-800">{qr.upiId}</p>
            </div>
            <button onClick={copy} className="p-2 hover:bg-obsidian-200 rounded-lg transition-colors">
              <Copy className="w-4 h-4 text-obsidian-500" />
            </button>
          </div>

          {/* Instructions */}
          <ol className="text-xs text-obsidian-500 space-y-1.5 mb-6 list-decimal list-inside">
            <li>Open any UPI app (GPay, PhonePe, Paytm)</li>
            <li>Scan the QR code or use the UPI ID above</li>
            <li>Complete the payment of ₹{qr.amount?.toLocaleString("en-IN")}</li>
            <li>Click "I've Paid" to confirm your order</li>
          </ol>

          <Button variant="gold" size="lg" className="w-full" onClick={onConfirm}>
            <CheckCircle className="w-4 h-4" /> I've Paid
          </Button>
          <p className="text-xs text-obsidian-400 text-center mt-3">
            Your order will be confirmed after verification
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
