import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";

const Ourpolicy = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const policies = [
    {
      icon: assets.exchange_icon,
      title: "Easy Exchange",
      description: "Hassle-free exchange policy for your convenience within 30 days",
      color: "#3b82f6",
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      bgGradient: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(6,182,212,0.05) 100%)",
    },
    {
      icon: assets.quality_icon,
      title: "5 Days Return",
      description: "Shop with confidence with our easy no-questions-asked return policy",
      color: "#10b981",
      gradient: "linear-gradient(135deg, #10b981 0%, #84cc16 100%)",
      bgGradient: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(132,204,22,0.05) 100%)",
    },
    {
      icon: assets.support_img,
      title: "24/7 Support",
      description: "Round-the-clock customer support for you via chat, email & phone",
      color: "#ff6f61",
      gradient: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
      bgGradient: "linear-gradient(135deg, rgba(255,111,97,0.1) 0%, rgba(255,138,122,0.05) 100%)",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{
        padding: isMobile ? "60px 20px" : "100px 40px",
        background: "linear-gradient(135deg, #fafbfc 0%, #f0f4ff 50%, #fafbfc 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,111,97,0.15) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", marginBottom: "60px", position: "relative", zIndex: 1 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 24px",
            background: "linear-gradient(135deg, rgba(255,111,97,0.1) 0%, rgba(255,255,255,0.8) 100%)",
            borderRadius: "50px",
            border: "1px solid rgba(255,111,97,0.2)",
            marginBottom: "20px",
          }}
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            style={{ fontSize: "20px" }}
          >
            ✨
          </motion.span>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "#ff6f61" }}>
            Why Choose Us
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: isMobile ? "28px" : "42px",
            fontWeight: "800",
            background: "linear-gradient(135deg, #1f2937 0%, #4b5563 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "16px",
            letterSpacing: "-1px",
          }}
        >
          Shop With Confidence
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: "16px",
            color: "#6b7280",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.7",
          }}
        >
          We provide the best shopping experience with premium services designed for your satisfaction
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: isMobile ? "20px" : "30px",
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {policies.map((policy, index) => (
          <motion.div
            key={policy.title}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + index * 0.15, type: "spring", stiffness: 100 }}
            whileHover={{ 
              y: -12, 
              scale: 1.02,
              boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
            }}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            style={{
              textAlign: "center",
              padding: isMobile ? "30px 24px" : "50px 35px",
              background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.9) 100%)",
              borderRadius: "28px",
              boxShadow: hoveredIndex === index 
                ? "0 25px 50px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,111,97,0.2)"
                : "0 4px 25px rgba(0,0,0,0.06)",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              border: "1px solid rgba(255,255,255,0.8)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Gradient Background Effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: hoveredIndex === index ? 1 : 0,
                scale: hoveredIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.4 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "100%",
                background: policy.bgGradient,
                zIndex: 0,
              }}
            />

            {/* Top Gradient Line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
              style={{
                position: "absolute",
                top: 0,
                left: "10%",
                right: "10%",
                height: "4px",
                background: policy.gradient,
                borderRadius: "0 0 4px 4px",
              }}
            />

            <motion.div
              animate={{
                scale: hoveredIndex === index ? 1.15 : 1,
                rotate: hoveredIndex === index ? [0, -10, 10, 0] : 0,
              }}
              transition={{ duration: 0.4, rotate: { duration: 0.5 } }}
              style={{
                width: isMobile ? "70px" : "90px",
                height: isMobile ? "70px" : "90px",
                borderRadius: "24px",
                background: policy.gradient,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                boxShadow: `0 10px 30px ${policy.color}40`,
                position: "relative",
                zIndex: 1,
              }}
            >
              <motion.img 
                src={policy.icon} 
                alt={policy.title}
                animate={{ scale: hoveredIndex === index ? 1.1 : 1 }}
                transition={{ duration: 0.3 }}
                style={{ 
                  width: isMobile ? "35px" : "42px", 
                  height: isMobile ? "35px" : "42px",
                  filter: "brightness(0) invert(1)",
                }}
              />
            </motion.div>

            <motion.h3
              animate={{ color: hoveredIndex === index ? policy.color : "#1f2937" }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: isMobile ? "18px" : "22px",
                fontWeight: "700",
                marginBottom: "12px",
                position: "relative",
                zIndex: 1,
              }}
            >
              {policy.title}
            </motion.h3>

            <motion.p
              animate={{ color: hoveredIndex === index ? "#374151" : "#6b7280" }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: "14px",
                lineHeight: "1.7",
                margin: 0,
                position: "relative",
                zIndex: 1,
                padding: "0 10px",
              }}
            >
              {policy.description}
            </motion.p>

            {/* Learn More Link */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: hoveredIndex === index ? 1 : 0,
                y: hoveredIndex === index ? 0 : 10,
              }}
              transition={{ duration: 0.3 }}
              style={{
                marginTop: "20px",
                fontSize: "13px",
                fontWeight: "600",
                color: policy.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                position: "relative",
                zIndex: 1,
                cursor: "pointer",
              }}
            >
              Learn more 
              <motion.span
                animate={{ x: hoveredIndex === index ? [0, 5, 0] : 0 }}
                transition={{ duration: 0.5, repeat: hoveredIndex === index ? Infinity : 0 }}
              >
                →
              </motion.span>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Trust Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        style={{
          textAlign: "center",
          marginTop: "70px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 32px",
            background: "linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.9) 100%)",
            borderRadius: "50px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "1px solid rgba(255,111,97,0.15)",
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ fontSize: "24px" }}
          >
            ⭐
          </motion.div>
          <p style={{
            fontSize: "14px",
            color: "#4b5563",
            fontWeight: "600",
            letterSpacing: "1px",
            textTransform: "uppercase",
            margin: 0,
          }}>
            Trusted by 50,000+ happy customers worldwide
          </p>
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ fontSize: "24px" }}
          >
            ⭐
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Ourpolicy;
