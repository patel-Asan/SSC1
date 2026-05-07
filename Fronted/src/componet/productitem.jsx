import React, { useContext, useState, useEffect } from "react";
import { Shopcontext } from "../context/shopcontext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Productitem = ({ id, name, image, price, product }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, currency } = useContext(Shopcontext);
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlistAdding, setIsWishlistAdding] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const inWishlist = isInWishlist(id);

  const handleWishlistToggle = (e) => {
    e.stopPropagation();
    setIsWishlistAdding(true);

    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      // Create product object if not passed directly
      const productData = product || { _id: id, name, image, price };
      addToWishlist(productData);
    }

    setTimeout(() => setIsWishlistAdding(false), 300);
  };

  const handleImageError = (e) => {
    setImageError(true);
    e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center";
  };

  const handleImageClick = () => {
    navigate(`/product/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(id, "M");
    toast.success(`${name} added to cart!`, {
      position: "bottom-right",
      autoClose: 1500,
      hideProgressBar: true,
      closeButton: false,
    });
    setTimeout(() => setIsAdding(false), 600);
  };

  const getImageSrc = () => {
    if (imageError) {
      return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center";
    }
    
    if (Array.isArray(image) && image.length > 0) {
      return image[0];
    } else if (typeof image === 'string') {
      return image;
    }
    return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      style={{
        backgroundColor: "#fff",
        borderRadius: isMobile ? "16px" : "20px",
        padding: isMobile ? "10px" : "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        cursor: "pointer",
        border: "1px solid #f3f4f6",
        position: "relative",
        overflow: "hidden",
        transition: "box-shadow 0.3s ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quick Add Button - Hidden on mobile */}
      {!isMobile && (
        <motion.div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 2,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
        >
          <motion.button
            onClick={handleAddToCart}
            disabled={isAdding}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              backgroundColor: isAdding ? "#10b981" : "#ff6f61",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(255,111,97,0.3)",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            {isAdding ? "✓ Added" : "+ Add"}
          </motion.button>
        </motion.div>
      )}

      {/* Product Image */}
      <motion.div
        style={{
          marginBottom: isMobile ? "10px" : "16px",
          position: "relative",
          overflow: "hidden",
          borderRadius: isMobile ? "12px" : "16px",
          backgroundColor: "#f9fafb",
        }}
      >
        <motion.img
          src={getImageSrc()}
          alt={name}
          onClick={handleImageClick}
          onError={handleImageError}
          style={{
            width: "100%",
            height: isMobile ? "200px" : "280px",
            objectFit: "contain",
            cursor: "pointer",
          }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
        />

        {/* Wishlist Heart Button */}
        <motion.button
          onClick={handleWishlistToggle}
          disabled={isWishlistAdding}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: isHovered || isMobile ? 1 : 0, opacity: isHovered || isMobile ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.1 }}
          style={{
            position: "absolute",
            top: isMobile ? 8 : 16,
            left: isMobile ? 8 : 16,
            width: isMobile ? "32px" : "40px",
            height: isMobile ? "32px" : "40px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.95)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            zIndex: 2,
          }}
        >
          <svg
            width={isMobile ? "16" : "20"}
            height={isMobile ? "16" : "20"}
            viewBox="0 0 24 24"
            fill={inWishlist ? "#ff6f61" : "none"}
            stroke={inWishlist ? "#ff6f61" : "#4B5563"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </motion.button>
      </motion.div>

      {/* Product Info */}
      <div>
        <h3 
          onClick={handleImageClick}
          style={{
            fontSize: isMobile ? "14px" : "16px",
            fontWeight: "600",
            marginBottom: isMobile ? "6px" : "8px",
            color: "#1f2937",
            cursor: "pointer",
            lineHeight: "1.3",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {name}
        </h3>
        
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "8px",
        }}>
          <span style={{
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: "700",
            color: "#ff6f61",
            letterSpacing: "0.5px",
          }}>
            {currency}{price}
          </span>
          
          {!isMobile && (
            <motion.button
              onClick={handleAddToCart}
              disabled={isAdding}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: isAdding ? "#10b981" : "#1f2937",
                color: "white",
                border: "none",
                borderRadius: "10px",
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: isAdding ? "0 4px 12px rgba(16,185,129,0.3)" : "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {isAdding ? "✓" : "Cart"}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Productitem;
