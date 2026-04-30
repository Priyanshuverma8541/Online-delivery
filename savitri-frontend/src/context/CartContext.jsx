import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartAPI } from "../services/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [items,   setItems]   = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + (i.productId?.price || 0) * i.quantity, 0);

  // ── Fetch cart from server ──────────────────────────────────
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) { setItems([]); return; }
    try {
      const { data } = await cartAPI.get();
      setItems(data.items || []);
    } catch { /* silent */ }
  }, [isAuthenticated]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  // ── Add ─────────────────────────────────────────────────────
  const addToCart = useCallback(async (productId, quantity = 1) => {
    if (!isAuthenticated) { toast.error("Please log in first"); return false; }
    setLoading(true);
    try {
      const { data } = await cartAPI.add(productId, quantity);
      setItems(data.items || []);
      toast.success("Added to cart");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
      return false;
    } finally { setLoading(false); }
  }, [isAuthenticated]);

  // ── Remove ──────────────────────────────────────────────────
  const removeFromCart = useCallback(async (productId) => {
    setLoading(true);
    try {
      const { data } = await cartAPI.remove(productId);
      setItems(data.items || []);
      toast.success("Item removed");
    } catch { toast.error("Failed to remove"); }
    finally { setLoading(false); }
  }, []);

  // ── Clear (after payment) ───────────────────────────────────
  const clearCart = useCallback(async () => {
    try { await cartAPI.clear(); setItems([]); }
    catch { /* silent */ }
  }, []);

  return (
    <CartContext.Provider value={{ items, loading, totalItems, totalPrice, addToCart, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};
