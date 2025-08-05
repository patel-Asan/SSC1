import React, { useEffect, useState } from "react";
import { currency } from "../App";
import { ToastContainer, toast } from "react-toastify";
import adminApi from "../services/adminApi.js";

const Dashboard = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getDashboardStats();
      
      if (response.success) {
        setStats(response.data);
        setRecentOrders(response.data.recentOrders || []);
      } else {
        toast.error(response.message || "Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error(error.message || "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

  const statCardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    flex: 1,
    minWidth: "200px"
  };

  const statValueStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "8px"
  };

  const statLabelStyle = {
    fontSize: "0.875rem",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.05em"
  };

  const orderCardStyle = {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "12px",
    border: "1px solid #e5e7eb",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
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

  return (
    <div style={{ padding: "20px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem"
      }}>
        <h1 style={{ 
          fontSize: "2.25rem", 
          fontWeight: "700",
          color: "#111827",
          margin: 0
        }}>
          Admin Dashboard
        </h1>
        
        <button
          onClick={fetchDashboardData}
          style={{
            backgroundColor: "#3b82f6",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "0.875rem"
          }}
        >
          Refresh
        </button>
      </div>

      {stats && (
        <>
          {/* Statistics Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "2rem"
          }}>
            <div style={statCardStyle}>
              <div style={statValueStyle}>{stats.totalUsers}</div>
              <div style={statLabelStyle}>Total Users</div>
            </div>
            
            <div style={statCardStyle}>
              <div style={statValueStyle}>{stats.totalProducts}</div>
              <div style={statLabelStyle}>Total Products</div>
            </div>
            
            <div style={statCardStyle}>
              <div style={statValueStyle}>{stats.totalOrders}</div>
              <div style={statLabelStyle}>Total Orders</div>
            </div>
            
            <div style={statCardStyle}>
              <div style={statValueStyle}>{currency}{stats.totalRevenue?.toFixed(2) || '0.00'}</div>
              <div style={statLabelStyle}>Total Revenue</div>
            </div>
            
            <div style={statCardStyle}>
              <div style={statValueStyle}>{stats.monthlyOrders}</div>
              <div style={statLabelStyle}>Orders This Month</div>
            </div>
            
            <div style={statCardStyle}>
              <div style={statValueStyle}>{currency}{stats.monthlyRevenue?.toFixed(2) || '0.00'}</div>
              <div style={statLabelStyle}>Revenue This Month</div>
            </div>
          </div>

          {/* Recent Orders */}
          <div style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            border: "1px solid #e5e7eb"
          }}>
            <h2 style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "1rem",
              marginTop: 0
            }}>
              Recent Orders
            </h2>
            
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
                        {order.userId?.name || 'Unknown User'} • {order.userId?.email || 'No email'}
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
                        {currency}{order.totalAmount || order.amount}
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
        </>
      )}

      <ToastContainer />
    </div>
  );
};

export default Dashboard; 