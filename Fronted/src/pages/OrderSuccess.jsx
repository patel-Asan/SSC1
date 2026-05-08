import React, { useContext, useEffect, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import { motion } from "framer-motion";

const OrderSuccess = () => {
  const { navigate } = useContext(Shopcontext);
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/order");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "90vh",
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
        background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdf4 100%)",
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        style={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #10b981, #059669)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "32px",
          boxShadow: "0 8px 32px rgba(16,185,129,0.3)",
        }}
      >
        <motion.svg
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            d="M20 6L9 17l-5-5"
          />
        </motion.svg>
      </motion.div>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "48px 40px",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <motion.h1
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#065f46",
            margin: "0 0 12px 0",
          }}
        >
          Order Placed! 🎉
        </motion.h1>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: "15px",
            color: "#6b7280",
            lineHeight: "1.7",
            margin: "0 0 8px 0",
          }}
        >
          Thank you for your purchase! Your order has been placed successfully and is now being processed.
        </motion.p>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: "24px",
            padding: "16px",
            background: "#f0fdf4",
            borderRadius: "12px",
            border: "1px solid #bbf7d0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>⏱️</span>
            <span style={{ fontSize: "14px", color: "#065f46", fontWeight: "500" }}>
              You will receive an order confirmation shortly.
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginTop: "32px",
          }}
        >
          <motion.button
            onClick={() => navigate("/order")}
            whileHover={{ scale: 1.03, boxShadow: "0 8px 25px rgba(16,185,129,0.3)" }}
            whileTap={{ scale: 0.97 }}
            style={{
              flex: 1,
              minWidth: "180px",
              padding: "16px 24px",
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff",
              border: "none",
              borderRadius: "14px",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(16,185,129,0.3)",
            }}
          >
            View My Orders
          </motion.button>

          <motion.button
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              flex: 1,
              minWidth: "180px",
              padding: "16px 24px",
              backgroundColor: "#fff",
              color: "#374151",
              border: "2px solid #e5e7eb",
              borderRadius: "14px",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          marginTop: "24px",
          padding: "12px 24px",
          background: "#fff",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#10b981",
            flexShrink: 0,
          }}
        />
        <span style={{ fontSize: "13px", color: "#9ca3af" }}>
          Redirecting to orders in <strong style={{ color: "#10b981" }}>{countdown}s</strong>
        </span>
      </motion.div>
    </motion.div>
  );
};

export default OrderSuccess;
