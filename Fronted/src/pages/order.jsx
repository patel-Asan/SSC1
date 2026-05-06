
import React, { useContext, useState, useEffect } from "react";
import { Shopcontext } from "../context/shopcontext";
import Title from "../componet/title";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const Order = () => {
  const { backendUrl, token, currency, navigate } = useContext(Shopcontext);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadOrderData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!token) {
        navigate("/login");
        return;
      }
      
      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } });
      
      if (response.data.success) {
        let allOrdersItem = [];
        
        if (response.data.orders && Array.isArray(response.data.orders)) {
          response.data.orders.forEach((order) => {
            if (order.items && Array.isArray(order.items)) {
              order.items.forEach((item) => {
                item['status'] = order.status;
                item['payment'] = order.payment;
                item['paymentMethod'] = order.paymentMethod;
                item['date'] = order.date;
                allOrdersItem.push(item);
              });
            }
          });
        }
        
        setOrderData(allOrdersItem.reverse());
      } else {
        setError("Failed to load orders");
      }
    } catch (error) {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      loadOrderData();
    }
  }, [token]);

  const statusColors = {
    "pending": { bg: "#fef3c7", text: "#92400e" },
    "processing": { bg: "#dbeafe", text: "#1e40af" },
    "shipped": { bg: "#e0e7ff", text: "#3730a3" },
    "delivered": { bg: "#d1fae5", text: "#065f46" },
    "cancelled": { bg: "#fee2e2", text: "#991b1b" },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        padding: "80px 40px",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#fff",
        minHeight: "100vh",
      }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ marginBottom: "40px" }}
      >
        <Title text1="MY_" text2="ORDERS" />
      </motion.div>

      <motion.div
        style={{ maxWidth: "1000px", margin: "0 auto" }}
      >
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ textAlign: "center", padding: "60px" }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              style={{
                width: 40,
                height: 40,
                border: "3px solid #e5e7eb",
                borderTop: "3px solid #ff6f61",
                borderRadius: "50%",
                margin: "0 auto",
              }}
            />
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#991b1b",
              backgroundColor: "#fef2f2",
              borderRadius: "20px",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <p style={{ marginBottom: "16px", fontWeight: "600" }}>{error}</p>
            <motion.button
              onClick={loadOrderData}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "12px 24px",
                backgroundColor: "#ff6f61",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Try Again
            </motion.button>
          </motion.div>
        )}
        
        {!loading && !error && orderData.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: "center", padding: "80px 20px" }}
          >
            <p style={{ fontSize: "64px", marginBottom: "16px" }}>📦</p>
            <p style={{ color: "#374151", fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>No orders yet</p>
            <p style={{ color: "#9ca3af", marginBottom: "32px" }}>Start shopping to see your orders here</p>
            <motion.button
              onClick={() => navigate("/collection")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "16px 32px",
                backgroundColor: "#ff6f61",
                color: "#fff",
                border: "none",
                borderRadius: "14px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(255,111,97,0.3)",
              }}
            >
              Browse Collection →
            </motion.button>
          </motion.div>
        )}
        
        <AnimatePresence>
          {!loading && !error && orderData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              style={{
                backgroundColor: "#fff",
                marginBottom: "20px",
                padding: "24px",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                border: "1px solid #f3f4f6",
              }}
              whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.1)", y: -2 }}
            >
              <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
                <motion.img
                  src={item.image && item.image[0] ? item.image[0] : '/placeholder-image.jpg'}
                  alt="product"
                  whileHover={{ scale: 1.05 }}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    flexShrink: 0,
                  }}
                />
                
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <p style={{ fontSize: "16px", fontWeight: "600", color: "#1f2937", marginBottom: "8px" }}>
                    {item.name || 'Product Name'}
                  </p>
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "14px", color: "#6b7280" }}>
                    <span style={{ fontWeight: "700", color: "#ff6f61" }}>{currency}{item.price || 0}</span>
                    <span>Qty: {item.quantity || 0}</span>
                    <span>Size: {item.size || 'N/A'}</span>
                  </div>
                  <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>
                    <span>{item.date ? new Date(item.date).toDateString() : 'N/A'}</span>
                    <span>{item.paymentMethod || 'N/A'}</span>
                  </div>
                </div>

                <motion.div
                  style={{
                    padding: "8px 16px",
                    backgroundColor: statusColors[item.status?.toLowerCase()]?.bg || "#f3f4f6",
                    color: statusColors[item.status?.toLowerCase()]?.text || "#374151",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {item.status || 'Pending'}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Order;
