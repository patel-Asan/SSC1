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
        minHeight: "80vh",
        padding: "40px 20px",
        fontFamily: "'Inter', sans-serif",
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        style={{
          width: 120,
          height: 120,
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
          transition={{ delay: 0.3, duration: 0.5 }}
          width="56"
          height="56"
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
            transition={{ delay: 0.3, duration: 0.5 }}
            d="M20 6L9 17l-5-5"
          />
        </motion.svg>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: "32px",
          fontWeight: "800",
          color: "#1f2937",
          margin: "0 0 12px 0",
        }}
      >
        Order Placed Successfully!
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          fontSize: "16px",
          color: "#6b7280",
          maxWidth: "400px",
          lineHeight: "1.6",
          margin: "0 0 8px 0",
        }}
      >
        Thank you for your purchase! Your order has been placed and is being processed.
      </motion.p>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{
          fontSize: "14px",
          color: "#9ca3af",
          margin: "0 0 40px 0",
        }}
      >
        You will receive an order confirmation shortly.
      </motion.p>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <motion.button
          onClick={() => navigate("/order")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: "16px 32px",
            backgroundColor: "#ff6f61",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            fontWeight: "700",
            fontSize: "15px",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(255,111,97,0.3)",
          }}
        >
          View My Orders
        </motion.button>

        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: "16px 32px",
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

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        style={{
          marginTop: "40px",
          fontSize: "13px",
          color: "#d1d5db",
        }}
      >
        Redirecting to orders in {countdown}s...
      </motion.p>
    </motion.div>
  );
};

export default OrderSuccess;
