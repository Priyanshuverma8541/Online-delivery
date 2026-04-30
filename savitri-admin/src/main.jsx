import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          fontFamily: "'DM Sans',sans-serif",
          fontSize: "13px",
          background: "#26262e",
          color: "#e8e8ec",
          border: "1px solid #35353f",
          borderRadius: "12px",
          padding: "12px 16px",
        },
        success: { iconTheme: { primary: "#d4a82a", secondary: "#18181f" } },
        error:   { iconTheme: { primary: "#f43f5e", secondary: "#fff" } },
      }}
    />
  </StrictMode>
);
