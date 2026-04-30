import { createContext, useContext, useState, useCallback } from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(() => { try { return JSON.parse(localStorage.getItem("adminUser")) || null; } catch { return null; } });
  const [token, setToken] = useState(() => localStorage.getItem("adminToken") || "");
  const [loading, setLoading] = useState(false);

  const isAuthenticated = Boolean(token && user);
  const isAdmin         = user?.role === "admin";

  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login({ identifier, password });
      if (data.user?.role !== "admin") {
        toast.error("Access denied – admin accounts only");
        return { success: false };
      }
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser",  JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      toast.success(`Welcome, ${data.user.fullName.split(" ")[0]} 👑`);
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      return { success: false };
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setToken(""); setUser(null);
    toast.success("Logged out");
  }, []);

  return (
    <AuthCtx.Provider value={{ user, token, isAuthenticated, isAdmin, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
