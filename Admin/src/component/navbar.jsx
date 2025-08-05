import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({setToken}) => {
  

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        backgroundColor: "#0f172a",
        color: "white",
      }}
    >
      {/* Logo and Title */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={assets.logo}
          alt="Logo"
          style={{ height: "40px", objectFit: "contain", cursor: "pointer" }}
        />
        <span style={{ fontSize: "20px", fontWeight: "600" }}>Admin Panel</span>
      </div>

      {/* Stylish Logout Button */}
      <button
        onClick={()=>setToken("")}
        style={{
          background: "linear-gradient(to right, #ef4444, #dc2626)",
          color: "white",
          padding: "10px 24px",
          border: "none",
          borderRadius: "9999px",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "linear-gradient(to right, #dc2626, #b91c1c)";
          e.target.style.boxShadow = "0 6px 16px rgba(220, 38, 38, 0.5)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "linear-gradient(to right, #ef4444, #dc2626)";
          e.target.style.boxShadow = "0 4px 12px rgba(239, 68, 68, 0.4)";
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
