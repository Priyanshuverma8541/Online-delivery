import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider }     from "./context/AuthContext";
import { CartProvider }     from "./context/CartContext";

import Layout               from "./components/layout/Layout";
import ProtectedRoute       from "./components/layout/ProtectedRoute";

// Pages
import Home                 from "./components/pages/Home";
import Shop                 from "./components/pages/Shop";
import ProductDetail        from "./components/pages/ProductDetail";
import Login                from "./components/pages/Login";
import Register             from "./components/pages/Register";
import Dashboard            from "./components/pages/Dashboard";
import DashboardHome        from "./components/pages/DashboardHome";
import Cart                 from "./components/pages/Cart";
import Orders               from "./components/pages/Orders";
import Profile              from "./components/pages/Profile";
import NotFound             from "./components/pages/NotFound";
import { About, Services, Contact, FAQs, Legal } from "./components/pages/StaticPages";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* ── Public routes with Navbar + Footer ────────── */}
            <Route element={<Layout />}>
              <Route index       element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<ProductDetail />} />
              <Route path="about"    element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="contact"  element={<Contact />} />
              <Route path="faqs"     element={<FAQs />} />
              <Route path="legal"    element={<Legal />} />
              <Route path="*"        element={<NotFound />} />
            </Route>

            {/* ── Auth routes (no Layout chrome) ─────────────── */}
            <Route path="login"    element={<Login />} />
            <Route path="register" element={<Register />} />

            {/* ── Protected dashboard ─────────────────────────── */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            >
              <Route index            element={<DashboardHome />} />
              <Route path="cart"      element={<Cart />} />
              <Route path="orders"    element={<Orders />} />
              <Route path="profile"   element={<Profile />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
