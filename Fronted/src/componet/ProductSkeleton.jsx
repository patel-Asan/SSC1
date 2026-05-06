import React from "react";
import { motion } from "framer-motion";

const ProductSkeleton = ({ count = 8 }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "30px",
        justifyItems: "center",
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.05 }}
          style={{
            backgroundColor: "#fff",
            borderRadius: "20px",
            padding: "16px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            border: "1px solid #f3f4f6",
            width: "100%",
            maxWidth: "300px",
          }}
        >
          {/* Image Skeleton */}
          <div
            style={{
              width: "100%",
              height: "280px",
              borderRadius: "16px",
              background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
              marginBottom: "16px",
            }}
          />

          {/* Title Skeleton */}
          <div
            style={{
              height: "20px",
              width: "80%",
              borderRadius: "8px",
              background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
              marginBottom: "12px",
            }}
          />

          {/* Price and Button Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "24px",
                width: "40%",
                borderRadius: "8px",
                background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
              }}
            />
            <div
              style={{
                height: "36px",
                width: "60px",
                borderRadius: "10px",
                background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.5s infinite",
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
