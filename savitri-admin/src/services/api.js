import axios from "axios";

const BASE = import.meta.env.VITE_API_URL;

const api = axios.create({ baseURL: BASE, withCredentials: true });

// Attach JWT
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("adminToken");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

// Auto-logout on 401
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────────────────────
export const authAPI = {
  login: (d) => api.post("/api/users/login", d),
};

// ── Dashboard stats (aggregate from existing endpoints) ──
export const statsAPI = {
  orders:   () => api.get("/api/orders"),
  users:    () => api.get("/api/users"),
  products: () => api.get("/api/products"),
};

// ── Products ──────────────────────────────────────────────
export const productAPI = {
  getAll:   (p) => api.get("/api/products", { params: p }),
  getOne:   (id) => api.get(`/api/products/${id}`),
  create:   (fd) => api.post("/api/products", fd, { headers: { "Content-Type": "multipart/form-data" } }),
  update:   (id, d) => api.put(`/api/products/${id}`, d),
  delete:   (id) => api.delete(`/api/products/${id}`),
};

// ── Orders ────────────────────────────────────────────────
export const orderAPI = {
  getAll:         ()         => api.get("/api/orders"),
  getOne:         (id)       => api.get(`/api/orders/${id}`),
  updateStatus:   (id, status) => api.patch(`/api/orders/${id}`, { status }),
};

// ── Users ─────────────────────────────────────────────────
export const userAPI = {
  getAll:  () => api.get("/api/users"),
  delete:  (id) => api.delete(`/api/users/${id}`),
};

export default api;
