import React, { useContext, useEffect, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import Title from "./title";
import Productitem from "./productitem";
import ProductSkeleton from "./ProductSkeleton";
import { motion } from "framer-motion";

const Latestcollection = () => {
  const { products, loading, error } = useContext(Shopcontext);
  const [latestproducts, setlatestproducts] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (products && products.length > 0) {
      const sortedProducts = [...products].sort((a, b) => new Date(b.date) - new Date(a.date));
      setlatestproducts(sortedProducts.slice(0, isMobile ? 4 : 8));
    }
  }, [products, isMobile]);

  if (loading) {
    return (
      <div style={{ padding: "80px 20px", backgroundColor: "#fafbfc" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Title text1="NEW_" text2="COLLECTIONS" />
        </div>
        <ProductSkeleton count={isMobile ? 4 : 8} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "80px 20px", textAlign: "center", backgroundColor: "#fafbfc" }}>
        <p style={{ color: "#e74c3c", fontSize: "16px" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        padding: isMobile ? "60px 20px" : "100px 40px",
        fontFamily: "'Inter', sans-serif",
        background: "linear-gradient(180deg, #fafbfc 0%, #f0f4ff 50%, #fafbfc 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating Decorative Elements */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "5%",
          right: "10%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,111,97,0.15) 0%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ 
          y: [0, 25, 0],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      {/* Title Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ textAlign: "center", marginBottom: "60px", position: "relative", zIndex: 1 }}
      >
        {/* New Tag */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "10px 20px",
            background: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(255,255,255,0.9) 100%)",
            borderRadius: "50px",
            border: "1px solid rgba(16,185,129,0.2)",
            marginBottom: "20px",
          }}
        >
          <motion.span
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ fontSize: "16px" }}
          >
            ✨
          </motion.span>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#10b981", letterSpacing: "1px" }}>
            JUST ARRIVED
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Title text1="NEW_" text2="COLLECTIONS" />
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "80px" }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
          style={{
            height: "4px",
            background: "linear-gradient(90deg, transparent, #ff6f61, #ff8a7a, transparent)",
            margin: "20px auto",
            borderRadius: "2px",
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            fontSize: isMobile ? "14px" : "15px",
            lineHeight: "1.8",
            color: "#6b7280",
            fontWeight: "400",
          }}
        >
          Discover our freshest styles and top picks for the season. Whether you're into modern basics or bold statements, we've got something new just for you.
        </motion.p>

        {/* Product Count */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.4 }}
          style={{
            marginTop: "20px",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "linear-gradient(135deg, rgba(255,111,97,0.1) 0%, rgba(255,255,255,0.9) 100%)",
            borderRadius: "20px",
            border: "1px solid rgba(255,111,97,0.2)",
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ fontSize: "14px" }}
          >
            🆕
          </motion.span>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#ff6f61" }}>
            {latestproducts.length} New Items
          </span>
        </motion.div>
      </motion.div>

      {/* Product Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          display: "grid",
          gridTemplateColumns: isMobile 
            ? "repeat(2, 1fr)" 
            : "repeat(auto-fill, minmax(280px, 1fr))",
          gap: isMobile ? "16px" : "32px",
          justifyItems: "center",
          maxWidth: "1400px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        {latestproducts.length > 0 ? (
          latestproducts.map((item, index) => (
            <motion.div
              key={item._id || index}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.08, 
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              whileHover={{ 
                y: -12, 
                scale: 1.02,
                transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
              }}
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
                width: "100%",
              }}
            >
              {/* Glow Effect */}
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  inset: "-2px",
                  background: "linear-gradient(135deg, rgba(255,111,97,0.3) 0%, rgba(16,185,129,0.1) 50%, rgba(255,111,97,0.3) 100%)",
                  borderRadius: "18px",
                  zIndex: -1,
                  filter: "blur(8px)",
                }}
              />

              {/* Shine Effect */}
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                whileHover={{ x: "100%", opacity: [0, 0.4, 0] }}
                transition={{ duration: 0.7 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                  zIndex: 2,
                  pointerEvents: "none",
                }}
              />

              <Productitem
                id={item._id}
                image={item.image}
                name={item.name}
                price={item.price}
              />
            </motion.div>
          ))
        ) : (
          <div style={{ 
            gridColumn: "1 / -1", 
            textAlign: "center", 
            padding: "60px 20px",
            color: "#9ca3af"
          }}>
            <p style={{ fontSize: "18px" }}>No products available at the moment.</p>
          </div>
        )}
      </motion.div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
        style={{ textAlign: "center", marginTop: "70px", position: "relative", zIndex: 1 }}
      >
        <motion.button
          whileHover={{ 
            scale: 1.05, 
            boxShadow: "0 15px 35px rgba(255, 111, 97, 0.4)",
            background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
            color: "#fff",
            borderColor: "transparent",
          }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: "#fff",
            color: "#ff6f61",
            border: "2px solid #ff6f61",
            padding: "16px 40px",
            borderRadius: "50px",
            fontWeight: "700",
            fontSize: "15px",
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 15px rgba(255, 111, 97, 0.15)",
          }}
        >
          <span>View All Collections</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Latestcollection;


