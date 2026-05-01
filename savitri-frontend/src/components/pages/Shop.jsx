import { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, X } from "lucide-react";
import { productAPI } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { Button, SkeletonCard, EmptyState } from "../ui";
import toast from "react-hot-toast";

const CATEGORIES = ["All", "rings", "necklaces", "earrings", "bangles", "pendants", "bracelets"];

function ProductCard({ product }) {
  const { addToCart, loading } = useCart();
  const { isAuthenticated }    = useAuth();

  const handleAdd = async () => {
    if (!isAuthenticated) { toast.error("Please log in to add to cart"); return; }
    await addToCart(product._id, 1);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="card flex flex-col"
    >
      <Link to={`/product/${product._id}`} className="img-zoom rounded-t-2xl overflow-hidden aspect-square block">
        <img
          src={product.images?.[0] || "https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=400&q=80"}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </Link>

      <div className="p-3 sm:p-5 flex flex-col flex-1">
        <div className="flex-1">
          <p className="text-xs text-gold-600 font-mono uppercase tracking-widest mb-1 capitalize">{product.category}</p>
          <Link to={`/product/${product._id}`}>
            <h3 className="font-display text-base sm:text-xl text-obsidian-900 hover:text-gold-700 transition-colors leading-tight mb-1 sm:mb-2">
              {product.name}
            </h3>
          </Link>
          <p className="text-obsidian-500 text-xs line-clamp-2 mb-2 hidden sm:block">{product.description}</p>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 sm:pt-3 border-t border-obsidian-100">
          <div>
            <p className="font-display text-lg sm:text-2xl text-obsidian-900">₹{product.price?.toLocaleString("en-IN")}</p>
            {product.stock < 5 && product.stock > 0 && (
              <p className="text-xs text-amber-600">Only {product.stock} left</p>
            )}
          </div>
          <Button
            variant="gold"
            size="sm"
            onClick={handleAdd}
            loading={loading}
            disabled={product.stock === 0}
            className="text-xs px-3 py-2 sm:px-4 sm:py-2.5"
          >
            <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">{product.stock === 0 ? "Sold Out" : "Add"}</span>
            <span className="sm:hidden">{product.stock === 0 ? "Out" : "Add"}</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Shop() {
  const [products,     setProducts]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search,       setSearch]       = useState("");

  const category = searchParams.get("category") || "All";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== "All") params.category = category;
      if (search.trim())      params.search    = search.trim();
      const { data } = await productAPI.getAll(params);
      setProducts(data.products || []);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [category, search]);

  useEffect(() => {
    const t = setTimeout(fetchProducts, 350);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const setCategory = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat === "All") next.delete("category");
    else next.set("category", cat);
    setSearchParams(next);
  };

  return (
    <div className="min-h-screen bg-cream pb-10">
      {/* Header */}
      <div className="bg-obsidian-950 pt-8 pb-14 sm:pt-10 sm:pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="section-tag text-gold-400 mb-2">Our Collection</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-5 sm:mb-6">All Jewellery</h1>

          {/* Search — font-size 16px prevents iOS zoom */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-obsidian-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search rings, necklaces, earrings…"
              style={{ fontSize: "16px" }}
              className="w-full pl-11 sm:pl-12 pr-10 py-3 sm:py-3.5 rounded-2xl bg-obsidian-800 border border-obsidian-700 text-white placeholder:text-obsidian-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-obsidian-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-5 sm:-mt-6">
        {/* Category pills — horizontally scrollable on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide -mx-4 px-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 min-h-[36px] ${
                category === cat
                  ? "bg-gold-gradient text-obsidian-900 shadow-gold"
                  : "bg-white text-obsidian-600 hover:bg-gold-50 border border-obsidian-200"
              }`}
            >
              {cat === "All" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between my-4 sm:my-6">
          <p className="text-obsidian-500 text-sm">
            {loading ? "Loading…" : `${products.length} product${products.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 pb-20">
            {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="No products found"
            message="Try a different category or search term."
            action={
              <Button onClick={() => { setSearch(""); setCategory("All"); }}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 pb-20">
            <AnimatePresence>
              {products.map((p) => <ProductCard key={p._id} product={p} />)}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
