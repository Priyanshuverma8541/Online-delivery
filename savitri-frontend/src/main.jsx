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
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          background: "#1a1b24",
          color: "#faf6ee",
          border: "1px solid #d4a82a44",
          borderRadius: "12px",
          padding: "12px 18px",
        },
        success: { iconTheme: { primary: "#d4a82a", secondary: "#1a1b24" } },
        error:   { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
      }}
    />
  </StrictMode>
);
