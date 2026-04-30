import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ArrowLeft, Shield, Truck, RotateCcw, Minus, Plus } from "lucide-react";
import { productAPI } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { usePayment } from "../../hooks/usePayment";
import { Button, PageLoader, StatusBadge } from "../ui";
import toast from "react-hot-toast";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product,   setProduct]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [qty,       setQty]       = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [buyLoading, setBuyLoading] = useState(false);

  const { addToCart, loading: cartLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const { payWithRazorpay } = usePayment();

  useEffect(() => {
    productAPI.getOne(id)
      .then(({ data }) => setProduct(data.product))
      .catch(() => toast.error("Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    await addToCart(product._id, qty);
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    setBuyLoading(true);
    await payWithRazorpay({
      items: [{ productId: product._id, quantity: qty, price: product.price }],
      totalAmount: product.price * qty,
      onSuccess: () => navigate("/dashboard/orders"),
    });
    setBuyLoading(false);
  };

  if (loading) return <PageLoader />;
  if (!product) return <div className="min-h-[60vh] flex items-center justify-center"><p>Product not found.</p></div>;

  const images = product.images?.length ? product.images : ["https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=800&q=80"];

  return (
    <div className="min-h-screen bg-cream py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-obsidian-400 mb-8">
          <Link to="/shop" className="flex items-center gap-1.5 hover:text-gold-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Shop
          </Link>
          <span>/</span>
          <span className="text-obsidian-700 capitalize">{product.category}</span>
          <span>/</span>
          <span className="text-obsidian-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <div>
            <motion.div
              key={activeImg}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="img-zoom aspect-square rounded-3xl overflow-hidden shadow-card-hover mb-4"
            >
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? "border-gold-500" : "border-transparent"}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="section-tag mb-2 capitalize">{product.category}</p>
            <h1 className="font-display text-4xl text-obsidian-900 mb-4">{product.name}</h1>
            <div className="font-display text-4xl text-gold-600 mb-4">
              ₹{product.price?.toLocaleString("en-IN")}
            </div>

            {product.stock > 0 ? (
              <span className="badge-green text-sm px-3 py-1 inline-flex items-center gap-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="badge-red text-sm px-3 py-1 inline-flex mb-6">Out of Stock</span>
            )}

            <div className="gold-divider" />

            <p className="text-obsidian-600 leading-relaxed mb-8">{product.description || "A beautifully handcrafted piece from Savitri Jewellers, made with the finest materials and traditional techniques."}</p>

            {/* Qty */}
            <div className="flex items-center gap-4 mb-8">
              <span className="text-sm font-medium text-obsidian-700">Quantity</span>
              <div className="flex items-center gap-3 border border-obsidian-200 rounded-full px-4 py-2">
                <button onClick={() => setQty(q => Math.max(1, q-1))} className="w-6 h-6 flex items-center justify-center hover:text-gold-600 transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q+1))} className="w-6 h-6 flex items-center justify-center hover:text-gold-600 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <Button variant="outline" size="lg" onClick={handleAddToCart} loading={cartLoading} disabled={product.stock === 0} className="flex-1">
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </Button>
              <Button variant="gold" size="lg" onClick={handleBuyNow} loading={buyLoading} disabled={product.stock === 0} className="flex-1">
                Buy Now
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { Icon: Shield,    label: "Hallmark Certified" },
                { Icon: Truck,     label: "Free Delivery" },
                { Icon: RotateCcw, label: "7-Day Returns" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1.5 p-3 bg-ivory rounded-xl text-center">
                  <Icon className="w-5 h-5 text-gold-500" />
                  <span className="text-xs text-obsidian-600 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
