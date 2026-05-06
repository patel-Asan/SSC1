import React, { useContext, useEffect, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import Title from "../componet/title";
import { assets } from "../assets/assets";
import CartTotal from "../componet/carttotal";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, token, navigate } = useContext(Shopcontext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if(products.length > 0){
      const tempData = [];
      for (const productId in cartItems) {
        for (const size in cartItems[productId]) {
          const quantity = cartItems[productId][size];
          if (quantity > 0) {
            tempData.push({
              _id: productId,
              size,
              quantity,
            });
          }
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, token]);

  const handleRemoveItem = (item) => {
    toast.info("Item removed from cart", { autoClose: 1500 });
    updateQuantity(item._id, item.size, 0);
  };

  if (!token) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          paddingTop: "6rem", 
          textAlign: "center",
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Title text1="YOUR_" text2="CART" />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          style={{
            backgroundColor: "#fff",
            padding: "3rem",
            borderRadius: "24px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
            maxWidth: "450px",
            marginTop: "2rem",
          }}
        >
          <p style={{ color: "#6b7280", marginBottom: "1.5rem", fontSize: "16px" }}>
            Please login to view your cart
          </p>
          <motion.button
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: "#ff6f61",
              color: "#fff",
              border: "none",
              padding: "16px 32px",
              borderRadius: "12px",
              fontSize: "15px",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 4px 15px rgba(255,111,97,0.3)",
            }}
          >
            Login →
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ 
        paddingTop: "6rem", 
        paddingLeft: "40px", 
        paddingRight: "40px",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <motion.div 
        style={{ marginBottom: "2rem" }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <Title text1="YOUR_" text2="CART" />
      </motion.div>

      <AnimatePresence mode="popLayout">
        {cartData.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              textAlign: "center", 
              padding: "100px 20px",
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                backgroundColor: "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "48px"
              }}
            >
              🛒
            </motion.div>
            <h3 style={{ fontSize: "24px", fontWeight: "600", color: "#374151", marginBottom: "12px" }}>Your cart is empty</h3>
            <p style={{ fontSize: "16px", color: "#9ca3af", marginBottom: "32px" }}>Looks like you haven't added anything yet</p>
            <motion.button
              onClick={() => navigate("/collection")}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(255,111,97,0.4)" }}
              whileTap={{ scale: 0.95 }}
              style={{
                backgroundColor: "#ff6f61",
                color: "#fff",
                border: "none",
                padding: "16px 40px",
                borderRadius: "14px",
                fontSize: "15px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(255,111,97,0.3)",
              }}
            >
              Start Shopping →
            </motion.button>
          </motion.div>
        ) : (
          <div>
            {cartData.map((item, index) => {
              const productData = products.find((p) => p._id === item._id);
              if (!productData) return null;

              return (
                <motion.div
                  key={`${item._id}-${item.size}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  style={{
                    padding: "24px",
                    borderBottom: "1px solid #f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    gap: "24px",
                    backgroundColor: "#fff",
                    borderRadius: "16px",
                    marginBottom: "16px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  }}
                  whileHover={{ 
                    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
                    y: -2,
                  }}
                >
                  <motion.img
                    src={productData.image[0]}
                    alt={productData.name}
                    style={{ 
                      width: "100px", 
                      height: "100px", 
                      objectFit: "cover",
                      borderRadius: "12px",
                      flexShrink: 0,
                    }}
                    whileHover={{ scale: 1.05 }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", marginBottom: "8px" }}>
                      {productData.name}
                    </h3>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                      <span style={{ fontSize: "18px", fontWeight: "700", color: "#ff6f61" }}>
                        {currency}{productData.price}
                      </span>
                      <span style={{
                        padding: "6px 12px",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "600",
                        color: "#374151",
                      }}>
                        Size: {item.size}
                      </span>
                    </div>
                  </div>

                  <motion.input
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val > 0) {
                        updateQuantity(item._id, item.size, val);
                      }
                    }}
                    style={{
                      border: "2px solid #e5e7eb",
                      width: "70px",
                      padding: "8px",
                      borderRadius: "10px",
                      textAlign: "center",
                      fontSize: "14px",
                      fontWeight: "500",
                      outline: "none",
                    }}
                    whileFocus={{ 
                      borderColor: "#ff6f61",
                      boxShadow: "0 0 0 3px rgba(255,111,97,0.2)"
                    }}
                  />

                  <motion.img
                    onClick={() => handleRemoveItem(item)}
                    src={assets.bin_icon}
                    alt="Delete"
                    style={{
                      width: "20px",
                      cursor: "pointer",
                      opacity: 0.5,
                    }}
                    whileHover={{ 
                      opacity: 1,
                      scale: 1.2,
                    }}
                    whileTap={{ scale: 0.9 }}
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Cart Total */}
      {cartData.length > 0 && (
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ marginTop: "40px", maxWidth: "500px" }}
        >
          <CartTotal />
        </motion.div>
      )}
    </motion.div>
  );
};

export default Cart;
