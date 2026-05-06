
import React, { useContext, useEffect, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import Title from "./title";
import { motion } from "framer-motion";

const CartTotal = ({ hideCheckout }) => {
  const { currency, delivery_fee, getCartAmount, navigate, discount } = useContext(Shopcontext);
  const subtotal = getCartAmount();
  const afterDiscount = subtotal - discount;
  const total = subtotal === 0 ? 0 : afterDiscount + delivery_fee;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        backgroundColor: "#fff",
        padding: "32px",
        borderRadius: "24px",
        boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
        border: "1px solid #f3f4f6",
      }}
    >
      <Title text1="CART_" text2="TOTAL" />

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px" }}>
          <span style={{ color: "#6b7280" }}>Subtotal</span>
          <span style={{ fontWeight: "600", color: "#1f2937" }}>{currency}{subtotal.toFixed(2)}</span>
        </div>
        <hr style={{ border: "none", borderTop: "1px solid #f3f4f6" }} />
        
        {discount > 0 && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px" }}>
              <span style={{ color: "#166534", fontWeight: "600" }}>Discount</span>
              <span style={{ fontWeight: "700", color: "#166534" }}>-{currency}{discount.toFixed(2)}</span>
            </div>
            <hr style={{ border: "none", borderTop: "1px solid #f3f4f6" }} />
          </>
        )}
        
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px" }}>
          <span style={{ color: "#6b7280" }}>Shipping Fee</span>
          <span style={{ fontWeight: "600", color: "#1f2937" }}>{currency}{delivery_fee.toFixed(2)}</span>
        </div>
        <hr style={{ border: "none", borderTop: "2px solid #1f2937" }} />
        
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "700" }}>
          <span style={{ color: "#1f2937" }}>Total</span>
          <span style={{ color: "#ff6f61" }}>{currency}{total.toFixed(2)}</span>
        </div>
      </div>

      {!hideCheckout && subtotal > 0 && (
        <motion.button
          onClick={() => navigate('/placeorder')}
          whileHover={{ scale: 1.02, boxShadow: "0 8px 25px rgba(255,111,97,0.3)" }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: "100%",
            padding: "18px",
            backgroundColor: "#ff6f61",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(255,111,97,0.2)",
            transition: "all 0.3s ease",
          }}
        >
          Proceed to Checkout →
        </motion.button>
      )}
    </motion.div>
  );
};

export default CartTotal;

