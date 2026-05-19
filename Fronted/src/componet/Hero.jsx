import React, { useEffect, useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { Shopcontext } from "../context/shopcontext";

const Hero = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentText, setCurrentText] = useState(0);
  const navigate = useNavigate();
  const { stats } = useContext(Shopcontext);
  const texts = ["Arrivals", "Trends", "Styles"];

  // Format numbers for display
  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K+';
    }
    return num + '+';
  };

  // Check if we have real stats data (products loaded)
  const hasProducts = stats && stats.products > 0;
  const hasRating = stats && stats.rating > 0;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 3000);
    
    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: "100%",
        minHeight: "100vh",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        overflow: "hidden",
        background: "radial-gradient(circle at top right, rgba(255,255,255,0.15), transparent 25%),\n                    radial-gradient(circle at bottom left, rgba(255,111,97,0.17), transparent 20%),\n                    linear-gradient(135deg, #4f46e5 0%, #9333ea 45%, #ec4899 100%)",
        position: "relative",
      }}
    >
      {/* Decorative Elements */}
      <motion.div
        style={{
          position: "absolute",
          top: "-100px",
          right: "-100px",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        style={{
          position: "absolute",
          bottom: "-50px",
          left: "-50px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,111,97,0.2) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Text Section */}
      <motion.div
        style={{
          width: isMobile ? "100%" : "50%",
          minHeight: isMobile ? "60vh" : "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: isMobile ? "center" : "flex-start",
          padding: isMobile ? "80px 30px" : "80px 60px",
          boxSizing: "border-box",
          textAlign: isMobile ? "center" : "left",
          zIndex: 1,
        }}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.8)",
            marginBottom: "16px",
            letterSpacing: "3px",
            textTransform: "uppercase",
          }}
        >
          <motion.span
            style={{
              display: "inline-block",
              width: "40px",
              height: "2px",
              backgroundColor: "#ff6f61",
              marginRight: "12px",
              verticalAlign: "middle",
            }}
            animate={{ width: [40, 60, 40] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          Our Bestsellers
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: isMobile ? "42px" : "64px",
            fontWeight: "800",
            color: "#fff",
            margin: "16px 0",
            lineHeight: 1.1,
            letterSpacing: "-1px",
          }}
        >
          Latest{" "}
          <AnimatePresence mode="wait">
            <motion.span
              key={currentText}
              style={{ 
                color: "#ff6f61",
                display: "inline-block",
                background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              initial={{ opacity: 0, y: 20, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -20, rotateX: 90 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {texts[currentText]}
            </motion.span>
          </AnimatePresence>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            fontSize: "17px",
            color: "rgba(255,255,255,0.9)",
            maxWidth: "500px",
            lineHeight: 1.7,
            marginTop: "16px",
            marginBottom: "32px",
          }}
        >
          Discover premium, beautifully designed fashion pieces made for the bold and stylish. Don't miss the season's trendsetters.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0px 12px 36px rgba(255, 111, 97, 0.4)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/collection')}
          style={{
            display: "inline-block",
            background: "linear-gradient(135deg, #ff7a6c 0%, #ffb199 100%)",
            color: "#fff",
            padding: "18px 42px",
            borderRadius: "20px",
            fontWeight: 700,
            fontSize: "16px",
            cursor: "pointer",
            border: "none",
            boxShadow: "0px 10px 30px rgba(255, 111, 97, 0.28)",
            transition: "all 0.3s ease",
          }}
        >
          Shop Now →
        </motion.button>

        {/* Stats - Live Data from Products */}
        {hasProducts ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "48px",
              flexWrap: "wrap",
              justifyContent: isMobile ? "center" : "flex-start",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{ textAlign: isMobile ? "center" : "left" }}
            >
              <p style={{ fontSize: "28px", fontWeight: "800", color: "#fff", margin: 0 }}>
                {formatNumber(stats.products)}
              </p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: 0 }}>Products</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              style={{ textAlign: isMobile ? "center" : "left" }}
            >
              <p style={{ fontSize: "28px", fontWeight: "800", color: "#fff", margin: 0 }}>
                {stats.rating.toFixed(1)} ⭐
              </p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: 0 }}>Rating</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              style={{ textAlign: isMobile ? "center" : "left" }}
            >
              <p style={{ fontSize: "28px", fontWeight: "800", color: "#fff", margin: 0 }}>
                {stats.customers > 0 ? formatNumber(stats.customers) : '0+'}
              </p>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", margin: 0 }}>Customers</p>
            </motion.div>
          </motion.div>
        ) : null}
      </motion.div>

      {/* Image Section */}
      <motion.div
        style={{
          width: isMobile ? "100%" : "50%",
          minHeight: isMobile ? "40vh" : "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1,
        }}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <motion.div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <motion.img
            src={assets.hero_img}
            alt="Hero"
            style={{
              width: "100%",
              height: "auto",
              objectFit: "cover",
              borderRadius: "32px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          />
          {/* Floating Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            style={{
              position: "absolute",
              bottom: "30px",
              left: "30px",
              backgroundColor: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(10px)",
              padding: "20px 24px",
              borderRadius: "16px",
              boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            }}
          >
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937", margin: 0 }}>🔥 Trending Now</p>
            <p style={{ fontSize: "12px", color: "#6b7280", margin: "4px 0 0 0" }}>New collection available</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
