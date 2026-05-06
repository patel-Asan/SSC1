import React, { useContext, useEffect, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(Shopcontext);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();

  useEffect(() => {
    setVisible(location.pathname.includes("collection"));
  }, [location]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!(showSearch && visible)) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{
        width: "100%",
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        padding: isMobile ? "12px 16px" : "20px 40px",
        position: "sticky",
        top: isMobile ? "70px" : "80px",
        zIndex: 998,
      }}
    >
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          borderRadius: isMobile ? "12px" : "16px",
          overflow: "hidden",
          backgroundColor: "#fff",
          border: isMobile ? "1.5px solid #e5e7eb" : "2px solid #e5e7eb",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => e.currentTarget.style.borderColor = "#ff6f61"}
        onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e5e7eb"}
        >
          <div style={{ padding: isMobile ? "0 12px" : "0 20px", color: "#9ca3af", fontSize: isMobile ? "14px" : "16px" }}>
            🔍
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isMobile ? "Search products..." : "Search for products, styles, collections..."}
            style={{
              flex: 1,
              padding: isMobile ? "12px 8px" : "16px 12px",
              fontSize: isMobile ? "13px" : "14px",
              backgroundColor: "transparent",
              outline: "none",
              color: "#1f2937",
              border: "none",
              minWidth: "0",
            }}
          />
          <button
            onClick={() => setShowSearch(false)}
            style={{
              padding: isMobile ? "12px 14px" : "16px 20px",
              color: "#9ca3af",
              cursor: "pointer",
              border: "none",
              backgroundColor: "transparent",
              fontSize: isMobile ? "16px" : "18px",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ef4444";
              e.currentTarget.style.backgroundColor = "#fef2f2";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#9ca3af";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            aria-label="Close search"
          >
            ✕
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SearchBar;
