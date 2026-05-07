import React, { useEffect, useState } from "react";
import { currency } from "../App";
import { toast } from "react-toastify";
import { BarChart3, TrendingUp, Users, ShoppingCart, Package, DollarSign, RefreshCw, ChevronRight } from "lucide-react";

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [trends, setTrends] = useState([]);
  const [period, setPeriod] = useState('daily');

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  const isMobile = window.innerWidth <= 768;

  const fetchStats = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/analytics/stats`, {
        headers: { 'token': token }
      });
      const data = await response.json();
      if (data.success) setStats(data.stats);
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
      if (data.success) setRecentOrders(data.orders);
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
      if (data.success) setTopProducts(data.data);
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
      if (data.success) setTrends(data.data);
    } catch (error) {
      console.error("Failed to fetch trends:", error);
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchRecentOrders(), fetchTopProducts(), fetchTrends()]);
    setLoading(false);
  };

  useEffect(() => { fetchDashboardData(); }, [token]);
  useEffect(() => { fetchTrends(); }, [period]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: "40px", height: "40px", border: "3px solid #e5e7eb",
            borderTopColor: "#8b5cf6", borderRadius: "50%",
            animation: "spin 0.8s linear infinite", margin: "0 auto 12px"
          }} />
          <p style={{ color: "#6b7280", fontSize: "14px" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statsData = [
    { key: "totalUsers", label: "Total Users", icon: Users, color: "#3b82f6", bgColor: "rgba(59,130,246,0.1)", progress: 75 },
    { key: "totalProducts", label: "Total Products", icon: Package, color: "#10b981", bgColor: "rgba(16,185,129,0.1)", progress: 60 },
    { key: "totalOrders", label: "Total Orders", icon: ShoppingCart, color: "#8b5cf6", bgColor: "rgba(139,92,246,0.1)", progress: 85 },
    { key: "totalRevenue", label: "Total Revenue", icon: DollarSign, color: "#f59e0b", bgColor: "rgba(245,158,11,0.1)", progress: 90, isCurrency: true },
    { key: "monthlyOrders", label: "Orders This Month", icon: TrendingUp, color: "#ff6f61", bgColor: "rgba(255,111,97,0.1)", progress: 70 },
    { key: "monthlyRevenue", label: "Revenue This Month", icon: DollarSign, color: "#ec4899", bgColor: "rgba(236,72,153,0.1)", progress: 65, isCurrency: true },
  ];

  return (
    <div style={{ padding: isMobile ? "16px" : "24px" }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center",
        marginBottom: "28px", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "16px" : "0",
      }}>
        <div>
          <h1 style={{ fontSize: isMobile ? "20px" : "26px", fontWeight: "800", color: "#111827", margin: "0 0 4px 0", letterSpacing: "-0.5px" }}>
            Dashboard Overview
          </h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: isMobile ? "13px" : "14px" }}>
            Here's what's happening with your store today.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          style={{
            background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
            color: "white", border: "none", padding: "10px 20px", borderRadius: "10px",
            cursor: "pointer", fontSize: "13px", fontWeight: "600",
            display: "flex", alignItems: "center", gap: "8px",
            boxShadow: "0 4px 15px rgba(139,92,246,0.3)",
            transition: "all 0.3s ease", alignSelf: isMobile ? "stretch" : "auto",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 6px 20px rgba(139,92,246,0.4)"; }}
          onMouseLeave={(e) => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 15px rgba(139,92,246,0.3)"; }}
        >
          <RefreshCw size={18} /> Refresh Data
        </button>
      </div>

      {stats && (
        <>
          {/* Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(220px, 1fr))",
            gap: isMobile ? "10px" : "20px",
            marginBottom: "28px"
          }}>
            {statsData.map((stat) => (
              <div
                key={stat.key}
                style={{
                  background: "#fff",
                  borderRadius: "14px",
                  padding: isMobile ? "14px" : "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
                  border: "1px solid #f3f4f6",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.08)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}
              >
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: stat.bgColor, display: "flex", alignItems: "center",
                  justifyContent: "center", marginBottom: "12px",
                }}>
                  <stat.icon size={20} color={stat.color} />
                </div>
                <div style={{ fontSize: isMobile ? "20px" : "28px", fontWeight: "800", color: "#111827", marginBottom: "2px", lineHeight: 1.1 }}>
                  {stat.isCurrency ? currency : ''}{typeof stats[stat.key] === 'number' ? stats[stat.key].toLocaleString() : (stats[stat.key] || '0')}
                </div>
                <div style={{ fontSize: isMobile ? "11px" : "13px", color: "#6b7280", fontWeight: "500" }}>
                  {stat.label}
                </div>
                <div style={{
                  width: "100%", height: "3px", background: "#f3f4f6",
                  borderRadius: "2px", marginTop: "12px", overflow: "hidden"
                }}>
                  <div style={{
                    width: `${stat.progress}%`, height: "100%",
                    background: `linear-gradient(90deg, ${stat.color} 0%, ${stat.color}cc 100%)`,
                    borderRadius: "2px", transition: "width 1s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "20px"
          }}>
            {/* Recent Orders */}
            <div style={{
              background: "#fff", borderRadius: "14px", padding: isMobile ? "16px" : "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #f3f4f6",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "10px",
                  background: "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(255,111,97,0.1) 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <ShoppingCart size={20} color="#8b5cf6" />
                </div>
                <div>
                  <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 2px 0" }}>
                    Recent Orders
                  </h2>
                  <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                    Latest customer orders
                  </p>
                </div>
              </div>

              {recentOrders.length > 0 ? (
                recentOrders.map((order, index) => (
                  <div key={index} style={{
                    padding: "12px 0",
                    borderBottom: index < recentOrders.length - 1 ? "1px solid #f3f4f6" : "none",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    gap: "12px",
                  }}>
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: "600", color: "#111827", marginBottom: "2px" }}>
                        Order #{order._id?.slice(-8) || 'N/A'}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "#111827" }}>
                        {currency}{order.amount}
                      </span>
                      <span style={{
                        padding: "3px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: "600",
                        background: order.status === 'delivered' ? "#dcfce7" : order.status === 'shipped' ? "#dbeafe" : order.status === 'processing' ? "#fef3c7" : order.status === 'cancelled' ? "#fee2e2" : "#f3f4f6",
                        color: order.status === 'delivered' ? "#166534" : order.status === 'shipped' ? "#1e40af" : order.status === 'processing' ? "#92400e" : order.status === 'cancelled' ? "#dc2626" : "#374151",
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p style={{ color: "#6b7280", textAlign: "center", padding: "24px 0", fontSize: "13px" }}>
                  No recent orders
                </p>
              )}
            </div>

            {/* Top Products */}
            {topProducts.length > 0 && (
              <div style={{
                background: "#fff", borderRadius: "14px", padding: isMobile ? "16px" : "24px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #f3f4f6",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <div style={{
                    width: "40px", height: "40px", borderRadius: "10px",
                    background: "rgba(16,185,129,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <TrendingUp size={20} color="#10b981" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 2px 0" }}>
                      Top Selling Products
                    </h2>
                    <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                      Best performers
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {topProducts.slice(0, 5).map((product, index) => (
                    <div key={index} style={{
                      display: "flex", alignItems: "center", gap: "10px",
                      padding: "10px 12px", background: index % 2 === 0 ? "#f9fafb" : "transparent",
                      borderRadius: "8px",
                    }}>
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "8px",
                        background: index === 0 ? "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)" :
                                      index === 1 ? "linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%)" :
                                      index === 2 ? "linear-gradient(135deg, #d97706 0%, #f59e0b 100%)" :
                                      "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "white", fontWeight: "700", fontSize: "12px", flexShrink: 0,
                      }}>
                        #{index + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: "0 0 1px 0", fontSize: "13px", fontWeight: "600", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {product.name}
                        </p>
                        <p style={{ margin: 0, fontSize: "11px", color: "#6b7280" }}>
                          {product.totalSold} sold
                        </p>
                      </div>
                      <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#8b5cf6", flexShrink: 0 }}>
                        {currency}{product.totalRevenue?.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
