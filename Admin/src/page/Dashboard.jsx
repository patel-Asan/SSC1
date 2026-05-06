import React, { useEffect, useState } from "react";
import { currency } from "../App";
import { ToastContainer, toast } from "react-toastify";
import { BarChart3, TrendingUp, Users, ShoppingCart, Package, DollarSign } from "lucide-react";

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [trends, setTrends] = useState([]);
  const [period, setPeriod] = useState('daily');

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const fetchStats = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/analytics/stats`, {
        headers: { 'token': token }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/analytics/recent-orders`, {
        headers: { 'token': token }
      });
      const data = await response.json();
      if (data.success) {
        setRecentOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch recent orders:", error);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/analytics/top-products`, {
        headers: { 'token': token }
      });
      const data = await response.json();
      if (data.success) {
        setTopProducts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch top products:", error);
    }
  };

  const fetchTrends = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/analytics/trends?period=${period}`, {
        headers: { 'token': token }
      });
      const data = await response.json();
      if (data.success) {
        setTrends(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch trends:", error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchRecentOrders(), fetchTopProducts(), fetchTrends()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [token]);

  useEffect(() => {
    fetchTrends();
  }, [period]);

  const isMobile = window.innerWidth <= 768;

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "400px" 
      }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const statCardStyle = (color) => ({
    background: "#ffffff",
    borderRadius: isMobile ? "12px" : "20px",
    padding: isMobile ? "16px" : "24px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
    border: "1px solid #f3f4f6",
    flex: 1,
    minWidth: "0",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
  });

  const statIconStyle = (bgColor) => ({
    width: "48px",
    height: "48px",
    borderRadius: "12px",
    backgroundColor: bgColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    marginBottom: "16px",
  });

  const statValueStyle = {
    fontSize: isMobile ? "1.25rem" : "2rem",
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: "4px",
    lineHeight: 1,
  };

  const statLabelStyle = {
    fontSize: isMobile ? "0.7rem" : "0.875rem",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: "600",
  };

  const progressBar = (percentage, color) => ({
    width: "100%",
    height: "4px",
    backgroundColor: "#f3f4f6",
    borderRadius: "2px",
    marginTop: "12px",
    overflow: "hidden",
  });

  const orderCardStyle = {
    background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
    borderRadius: isMobile ? "12px" : "16px",
    padding: isMobile ? "12px" : "20px",
    marginBottom: "12px",
    border: "1px solid #f3f4f6",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    transition: "all 0.3s ease",
    cursor: "pointer",
  };

  const statusBadgeStyle = (status) => ({
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    fontWeight: "500",
    backgroundColor: 
      status === 'delivered' ? "#dcfce7" :
      status === 'shipped' ? "#dbeafe" :
      status === 'processing' ? "#fef3c7" :
      status === 'cancelled' ? "#fee2e2" : "#f3f4f6",
    color: 
      status === 'delivered' ? "#166534" :
      status === 'shipped' ? "#1e40af" :
      status === 'processing' ? "#92400e" :
      status === 'cancelled' ? "#dc2626" : "#374151"
  });

  const statsData = [
    { key: "totalUsers", label: "Total Users", icon: Users, color: "#3b82f6", bgColor: "rgba(59,130,246,0.1)", progress: 75 },
    { key: "totalProducts", label: "Total Products", icon: Package, color: "#10b981", bgColor: "rgba(16,185,129,0.1)", progress: 60 },
    { key: "totalOrders", label: "Total Orders", icon: ShoppingCart, color: "#ff6f61", bgColor: "rgba(255,111,97,0.1)", progress: 85 },
    { key: "totalRevenue", label: "Total Revenue", icon: DollarSign, color: "#f59e0b", bgColor: "rgba(245,158,11,0.1)", progress: 90, isCurrency: true },
    { key: "monthlyOrders", label: "Orders This Month", icon: TrendingUp, color: "#8b5cf6", bgColor: "rgba(139,92,246,0.1)", progress: 70 },
    { key: "monthlyRevenue", label: "Revenue This Month", icon: DollarSign, color: "#ec4899", bgColor: "rgba(236,72,153,0.1)", progress: 65, isCurrency: true },
  ];

  return (
    <div style={{ padding: isMobile ? "16px" : "32px" }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "16px" : "0",
        alignItems: isMobile ? "flex-start" : "center",
      }}>
        <div>
          <h1 style={{ 
            fontSize: isMobile ? "1.5rem" : "2rem", 
            fontWeight: "800",
            color: "#1f2937",
            margin: "0 0 8px 0"
          }}>
            Dashboard Overview
          </h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: isMobile ? "13px" : "15px" }}>
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        
        <button
          onClick={fetchDashboardData}
          style={{
            background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "12px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 15px rgba(255,111,97,0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 20px rgba(255,111,97,0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 15px rgba(255,111,97,0.3)";
          }}
        >
          <span>🔄</span> Refresh Data
        </button>
      </div>

      {stats && (
        <>
          {/* Statistics Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(280px, 1fr))",
            gap: isMobile ? "12px" : "24px",
            marginBottom: "32px"
          }}>
            {statsData.map((stat, index) => (
              <div 
                key={stat.key} 
                style={statCardStyle(stat.color)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                }}
              >
                <div style={statIconStyle(stat.bgColor)}>
                  <stat.icon size={24} color={stat.color} />
                </div>
                <div style={statValueStyle}>
                  {stat.isCurrency ? currency : ''}{typeof stats[stat.key] === 'number' ? stats[stat.key].toLocaleString() : (stats[stat.key] || '0')}
                </div>
                <div style={statLabelStyle}>{stat.label}</div>
                {/* Progress Bar */}
                <div style={progressBar(stat.progress, stat.color)}>
                  <div style={{
                    width: `${stat.progress}%`,
                    height: "100%",
                    backgroundColor: stat.color,
                    borderRadius: "2px",
                    transition: "width 1s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div style={{
            background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
            borderRadius: isMobile ? "12px" : "20px",
            padding: isMobile ? "16px" : "28px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
            border: "1px solid #f3f4f6"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
              <div style={{
                width: isMobile ? "36px" : "44px",
                height: isMobile ? "36px" : "44px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <ShoppingCart size={isMobile ? 18 : 24} color="white" />
              </div>
              <div>
                <h2 style={{
                  fontSize: isMobile ? "1rem" : "1.25rem",
                  fontWeight: "700",
                  color: "#1f2937",
                  margin: "0 0 4px 0",
                }}>
                  Recent Orders
                </h2>
                <p style={{ margin: 0, fontSize: isMobile ? "11px" : "13px", color: "#6b7280" }}>
                  Latest customer orders and their status
                </p>
              </div>
            </div>
            
            {recentOrders.length > 0 ? (
              recentOrders.map((order, index) => (
                <div key={index} style={orderCardStyle}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "12px"
                  }}>
                    <div>
                      <div style={{
                        fontWeight: "600",
                        color: "#111827",
                        marginBottom: "4px"
                      }}>
                        Order #{order._id?.slice(-8) || 'N/A'}
                      </div>
                      <div style={{
                        fontSize: "0.875rem",
                        color: "#6b7280"
                      }}>
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}>
                      <div style={{
                        fontWeight: "600",
                        color: "#111827"
                      }}>
                        {currency}{order.amount}
                      </div>
                      <span style={statusBadgeStyle(order.status)}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ color: "#6b7280", textAlign: "center" }}>
                No recent orders
              </p>
            )}
          </div>

          {/* Top Products */}
          {topProducts.length > 0 && (
            <div style={{
              background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
              borderRadius: isMobile ? "12px" : "20px",
              padding: isMobile ? "16px" : "28px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              border: "1px solid #f3f4f6",
              marginTop: "24px"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{
                  width: isMobile ? "36px" : "44px",
                  height: isMobile ? "36px" : "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <TrendingUp size={isMobile ? 18 : 24} color="white" />
                </div>
                <div>
                  <h2 style={{
                    fontSize: isMobile ? "1rem" : "1.25rem",
                    fontWeight: "700",
                    color: "#1f2937",
                    margin: "0 0 4px 0",
                  }}>
                    Top Selling Products
                  </h2>
                  <p style={{ margin: 0, fontSize: isMobile ? "11px" : "13px", color: "#6b7280" }}>
                    Best performing products
                  </p>
                </div>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {topProducts.slice(0, 5).map((product, index) => (
                  <div key={index} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px",
                    background: "#f9fafb",
                    borderRadius: "12px"
                  }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: "700",
                      fontSize: "14px"
                    }}>
                      #{index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600", color: "#1f2937" }}>
                        {product.name}
                      </p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                        {product.totalSold} sold
                      </p>
                    </div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: "14px", 
                      fontWeight: "700", 
                      color: "#8b5cf6" 
                    }}>
                      {currency}{product.totalRevenue.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <ToastContainer />
    </div>
  );
};

export default Dashboard; 