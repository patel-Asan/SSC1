import React, { useContext, useEffect, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import Title from "./title";
import Productitem from "./productitem";
import ProductSkeleton from "./ProductSkeleton";
import { motion } from "framer-motion";

const Bestseller = () => {
  const { products, loading, error, getBestsellerProducts } = useContext(Shopcontext);
  const [bestseller, setBestseller] = useState([]);
  const [columns, setColumns] = useState(5);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    if (products && products.length > 0) {
      const bestProducts = getBestsellerProducts();
      setBestseller(bestProducts.slice(0, 5));
    }
  }, [products, getBestsellerProducts]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      if (width < 640) setColumns(2);
      else if (width < 768) setColumns(3);
      else if (width < 1024) setColumns(4);
      else setColumns(5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div style={{
        margin: "100px 0",
        padding: "0 40px",
        backgroundColor: "#fff",
      }}>
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
          <Title text1="BEST_" text2="SELLERS" />
        </div>
        <ProductSkeleton count={columns} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        margin: "100px 0",
        padding: "60px 40px",
        textAlign: "center",
        backgroundColor: "#fff",
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
        <h3 style={{ color: "#dc2626", marginBottom: "8px" }}>Something went wrong</h3>
        <p style={{ color: "#991b1b" }}>{error}</p>
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
        margin: "100px 0",
        padding: isMobile ? "0 16px" : "0 40px",
        backgroundColor: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating Decorative Circles */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,111,97,0.2) 0%, transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        style={{
          position: "absolute",
          bottom: "20%",
          right: "8%",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* TITLE SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ textAlign: "center", paddingBottom: "60px" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Title text1="BEST_" text2="SELLERS" />
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "60px" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          style={{
            height: "3px",
            background: "linear-gradient(90deg, transparent, #ff6f61, transparent)",
            margin: "20px auto",
            borderRadius: "2px",
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.5 }}
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            fontSize: isMobile ? "14px" : "15px",
            fontWeight: "400",
            lineHeight: "1.8",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          Discover our top-rated picks — handpicked by the community, curated for style and quality
        </motion.p>

        {/* Product Count */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45, duration: 0.4 }}
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
            🔥
          </motion.span>
          <span style={{ fontSize: "13px", fontWeight: "600", color: "#ff6f61" }}>
            {bestseller.length} Hot Products
          </span>
        </motion.div>
      </motion.div>

      {/* PRODUCT GRID */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5 }}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: isMobile ? "16px" : "28px",
          alignItems: "stretch",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {bestseller.map((item, index) => (
          <motion.div
            key={item._id || index}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
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
            }}
          >
            {/* Glow Effect on Hover */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "absolute",
                inset: "-2px",
                background: "linear-gradient(135deg, rgba(255,111,97,0.3) 0%, rgba(255,138,122,0.1) 50%, rgba(255,111,97,0.3) 100%)",
                borderRadius: "18px",
                zIndex: -1,
                filter: "blur(8px)",
              }}
            />

            {/* Shine Effect */}
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              whileHover={{ x: "100%", opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.6 }}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                zIndex: 2,
                pointerEvents: "none",
              }}
            />

            <Productitem
              id={item._id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.5 }}
        style={{
          textAlign: "center",
          marginTop: "60px",
          display: "flex",
          justifyContent: "center",
          gap: "14px",
          flexWrap: "wrap",
        }}
      >
        {[
          { icon: "⭐", text: "Top Rated", color: "#fbbf24" },
          { icon: "🔥", text: "Trending", color: "#ff6f61" }, 
          { icon: "💎", text: "Premium", color: "#60a5fa" }
        ].map((badge, index) => (
          <motion.div
            key={badge.text}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
            whileHover={{ 
              scale: 1.08, 
              y: -4,
              boxShadow: `0 8px 25px ${badge.color}40`,
              transition: { duration: 0.2 }
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 22px",
              backgroundColor: "#fff",
              borderRadius: "50px",
              fontSize: "13px",
              fontWeight: "600",
              color: "#4b5563",
              cursor: "default",
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            <motion.span
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: index * 0.3,
                ease: "easeInOut"
              }}
              style={{ 
                fontSize: "14px",
                filter: `drop-shadow(0 2px 4px ${badge.color}40)`,
              }}
            >
              {badge.icon}
            </motion.span>
            <span>{badge.text}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Bestseller;


