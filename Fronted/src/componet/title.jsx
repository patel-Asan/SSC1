import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Title = ({ text1, text2 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
        <span style={{
          fontSize: "clamp(24px, 4vw, 36px)",
          fontWeight: "800",
          color: "#1f2937",
          letterSpacing: "-0.5px",
        }}>
          {text1}
        </span>
        <span style={{
          fontSize: "clamp(24px, 4vw, 36px)",
          fontWeight: "800",
          background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.5px",
        }}>
          {text2}
        </span>
      </div>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "60px" }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          height: "3px",
          background: "linear-gradient(to right, #ff6f61, #ff8a7a)",
          borderRadius: "3px",
        }}
      />
    </motion.div>
  );
};

export default Title;
