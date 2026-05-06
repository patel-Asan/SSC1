import React, { useContext } from "react";
import { Shopcontext } from "../context/shopcontext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist, addToCart, currency, isInWishlist, clearWishlist } = useContext(Shopcontext);
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    addToCart(product._id, "M");
    removeFromWishlist(product._id);
    toast.success(`${product.name} moved to cart!`);
  };

  const handleRemove = (product) => {
    removeFromWishlist(product._id);
  };

  const handleContinueShopping = () => {
    navigate("/collection");
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: "60px 40px 60px",
        minHeight: "100vh",
        backgroundColor: "#fafafa",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          maxWidth: "1400px",
          margin: "0 auto 40px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "36px",
                fontWeight: "800",
                color: "#1f2937",
                marginBottom: "8px",
                letterSpacing: "-0.5px",
              }}
            >
              My Wishlist
            </h1>
            <p
              style={{
                fontSize: "16px",
                color: "#6b7280",
                margin: 0,
              }}
            >
              {wishlistItems.length} {wishlistItems.length === 1 ? "item" : "items"} saved
            </p>
          </div>

          {wishlistItems.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearWishlist}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #ef4444",
                color: "#ef4444",
                padding: "12px 24px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              Clear Wishlist
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Section Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          maxWidth: "1400px",
          margin: "0 auto 30px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            backgroundColor: "#fff",
            padding: "8px",
            borderRadius: "16px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
            border: "1px solid #f3f4f6",
          }}
        >
          {[
            { label: "All Items", count: wishlistItems.length, active: true },
            { label: "In Stock", count: wishlistItems.filter(i => i.stock !== 0).length, active: false },
            { label: "On Sale", count: wishlistItems.filter(i => i.oldPrice > i.price).length, active: false },
          ].map((tab, index) => (
            <motion.button
              key={tab.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: "10px 20px",
                borderRadius: "12px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                border: "none",
                backgroundColor: tab.active ? "#ff6f61" : "transparent",
                color: tab.active ? "#fff" : "#6b7280",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {tab.label}
              <span
                style={{
                  backgroundColor: tab.active ? "rgba(255,255,255,0.2)" : "#f3f4f6",
                  padding: "2px 8px",
                  borderRadius: "10px",
                  fontSize: "12px",
                }}
              >
                {tab.count}
              </span>
            </motion.button>
          ))}

          <div style={{ flex: 1 }} />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/collection")}
            style={{
              padding: "10px 20px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              border: "1px solid #e5e7eb",
              backgroundColor: "#fff",
              color: "#374151",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            Browse Shop
          </motion.button>
        </div>
      </motion.div>

      {/* Wishlist Content */}
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {wishlistItems.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px 20px",
              backgroundColor: "#fff",
              borderRadius: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 111, 97, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "24px",
              }}
            >
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ff6f61"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </motion.div>

            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#1f2937",
                marginBottom: "12px",
              }}
            >
              Your wishlist is empty
            </h2>

            <p
              style={{
                fontSize: "16px",
                color: "#6b7280",
                marginBottom: "32px",
                textAlign: "center",
                maxWidth: "400px",
                lineHeight: "1.6",
              }}
            >
              Save items you love to your wishlist and find them here anytime
            </p>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(255,111,97,0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleContinueShopping}
              style={{
                backgroundColor: "#ff6f61",
                color: "#fff",
                border: "none",
                padding: "16px 40px",
                borderRadius: "14px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(255,111,97,0.25)",
                transition: "all 0.2s ease",
              }}
            >
              Continue Shopping
            </motion.button>
          </motion.div>
        ) : (
          /* Wishlist Grid */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "24px",
            }}
          >
            {wishlistItems.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                  border: "1px solid #f3f4f6",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Product Image */}
                <div
                  style={{
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                  onClick={() => handleProductClick(product._id)}
                >
                  <motion.img
                    src={Array.isArray(product.image) ? product.image[0] : product.image}
                    alt={product.name}
                    style={{
                      width: "100%",
                      height: "280px",
                      objectFit: "cover",
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Remove Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(product);
                    }}
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.95)",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </motion.button>
                </div>

                {/* Product Info */}
                <div style={{ padding: "20px" }}>
                  <h3
                    onClick={() => handleProductClick(product._id)}
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1f2937",
                      marginBottom: "8px",
                      cursor: "pointer",
                      lineHeight: "1.4",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {product.name}
                  </h3>

                  <p
                    style={{
                      fontSize: "13px",
                      color: "#9ca3af",
                      marginBottom: "12px",
                      textTransform: "capitalize",
                    }}
                  >
                    {product.category} • {product.subCategory}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "16px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#ff6f61",
                      }}
                    >
                      {currency}
                      {product.price}
                    </span>

                    {product.bestseller && (
                      <span
                        style={{
                          backgroundColor: "rgba(255, 111, 97, 0.1)",
                          color: "#ff6f61",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        Bestseller
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMoveToCart(product)}
                      style={{
                        flex: 1,
                        backgroundColor: "#ff6f61",
                        color: "#fff",
                        border: "none",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(255,111,97,0.25)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      Move to Cart
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleProductClick(product._id)}
                      style={{
                        backgroundColor: "#f3f4f6",
                        color: "#4b5563",
                        border: "none",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                    >
                      View
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Wishlist;
