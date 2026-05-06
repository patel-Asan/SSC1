import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PromoBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentPromo, setCurrentPromo] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const promos = [
    "🎉 Free shipping on orders over $50!",
    "🔥 New Summer Collection - Up to 30% Off!",
    "✨ Use code STYLE20 for 20% off your first order!",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPromo((prev) => (prev + 1) % promos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -40, opacity: 0 }}
      style={{
        background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
        color: "#fff",
        padding: "12px 20px",
        textAlign: "center",
        fontSize: "14px",
        fontWeight: "500",
        position: "relative",
        zIndex: 10000,
        marginTop: "80px",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentPromo}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          style={{ display: "inline-block" }}
        >
          {promos[currentPromo]}
        </motion.span>
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsVisible(false)}
        style={{
          position: "absolute",
          right: "20px",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          fontSize: "18px",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
        }}
      >
        ×
      </motion.button>
    </motion.div>
  );
};

export default PromoBanner;
