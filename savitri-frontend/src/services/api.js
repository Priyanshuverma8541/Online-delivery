import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ── Attach JWT to every request ──────────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Handle 401 globally (token expired) ─────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ─────────────────────────────────────────────────────────────────
// Auth
// ─────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/api/users/register", data),
  login:    (data) => api.post("/api/users/login", data),
  me:       ()     => api.get("/api/users/me"),
};

// ─────────────────────────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────────────────────────
export const productAPI = {
  getAll:  (params) => api.get("/api/products", { params }),
  getOne:  (id)     => api.get(`/api/products/${id}`),
};

// ─────────────────────────────────────────────────────────────────
// Cart
// ─────────────────────────────────────────────────────────────────
export const cartAPI = {
  get:    ()                     => api.get("/api/carts"),
  add:    (productId, quantity)  => api.post("/api/carts/add", { productId, quantity }),
  remove: (productId)            => api.delete(`/api/carts/remove/${productId}`),
  clear:  ()                     => api.delete("/api/carts/clear"),
};

// ─────────────────────────────────────────────────────────────────
// Orders
// ─────────────────────────────────────────────────────────────────
export const orderAPI = {
  myOrders:   () => api.get("/api/payment/my-orders"),
  getByUser:  (userId) => api.get(`/api/orders/user/${userId}`),
};

// ─────────────────────────────────────────────────────────────────
// Payment
// ─────────────────────────────────────────────────────────────────
export const paymentAPI = {
  createRazorpayOrder: (data) => api.post("/api/payment/create-order", data),
  verifyPayment:       (data) => api.post("/api/payment/verify", data),
  initiateQr:          (data) => api.post("/api/payment/qr/initiate", data),
  confirmQr:           (data) => api.post("/api/payment/qr/confirm", data),
};

export default api;
