import React, { useContext, useState, useEffect } from "react";
import { Shopcontext } from "../context/shopcontext";
import Title from "../componet/title";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

const Order = () => {
  const { backendUrl, token, currency, navigate } = useContext(Shopcontext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(null);

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
        const rawOrders = response.data.orders || [];
        setOrders(rawOrders.reverse());
      } else {
        setError("Failed to load orders");
      }
    } catch (error) {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'Cancel Order?',
      text: "Are you sure you want to cancel this order? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'Keep Order',
    });

    if (!result.isConfirmed) return;

    setCancelling(orderId);
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/cancel`,
        { orderId },
        { headers: { token } }
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Cancelled!',
          text: 'Your order has been cancelled successfully.',
          timer: 2000,
          showConfirmButton: false,
        });
        loadOrderData();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed!',
          text: response.data.message || 'Failed to cancel order',
          confirmButtonColor: '#ef4444',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data?.message || 'Something went wrong',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setCancelling(null);
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
        backgroundColor: "#f8fafc",
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

        {!loading && !error && orders.length === 0 && (
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
          {!loading && !error && orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                backgroundColor: "#fff",
                marginBottom: "24px",
                borderRadius: "20px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                border: "1px solid #f3f4f6",
                overflow: "hidden",
              }}
            >
              {/* Order Header */}
              <div style={{
                padding: "16px 24px",
                background: statusColors[order.status?.toLowerCase()]?.bg || "#f9fafb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px",
                borderBottom: "1px solid #e5e7eb",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: "500" }}>
                    #{order._id?.slice(-8).toUpperCase()}
                  </span>
                  <span style={{
                    padding: "4px 14px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    backgroundColor: statusColors[order.status?.toLowerCase()]?.bg || "#f3f4f6",
                    color: statusColors[order.status?.toLowerCase()]?.text || "#374151",
                  }}>
                    {order.status || "Pending"}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "13px", color: "#6b7280" }}>
                  <span>{order.date ? new Date(order.date).toLocaleDateString() : "N/A"}</span>
                  <span style={{ fontWeight: "700", color: "#ff6f61", fontSize: "16px" }}>
                    {currency}{order.amount?.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ padding: "20px 24px" }}>
                {order.items?.map((item, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    padding: idx < order.items.length - 1 ? "12px 0 12px 0" : "0",
                    borderBottom: idx < order.items.length - 1 ? "1px solid #f3f4f6" : "none",
                  }}>
                    <img
                      src={item.image?.[0] || '/placeholder-image.jpg'}
                      alt={item.name}
                      style={{
                        width: "64px",
                        height: "64px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        flexShrink: 0,
                        border: "1px solid #f3f4f6",
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "600", color: "#1f2937" }}>
                        {item.name}
                      </p>
                      <div style={{ display: "flex", gap: "12px", fontSize: "13px", color: "#6b7280" }}>
                        <span>Qty: {item.quantity || 0}</span>
                        <span>Size: {item.size || "N/A"}</span>
                        <span style={{ fontWeight: "700", color: "#ff6f61" }}>
                          {currency}{item.price || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cancel Button */}
              {order.status?.toLowerCase() === "pending" && (
                <div style={{
                  padding: "12px 24px",
                  borderTop: "1px solid #f3f4f6",
                  background: "#fafbfc",
                  display: "flex",
                  justifyContent: "flex-end",
                }}>
                  <motion.button
                    onClick={() => handleCancelOrder(order._id)}
                    disabled={cancelling === order._id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      padding: "10px 24px",
                      backgroundColor: cancelling === order._id ? "#9ca3af" : "#fee2e2",
                      color: "#dc2626",
                      border: "none",
                      borderRadius: "10px",
                      fontWeight: "600",
                      fontSize: "13px",
                      cursor: cancelling === order._id ? "default" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {cancelling === order._id ? "Cancelling..." : "✕ Cancel Order"}
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Order;
