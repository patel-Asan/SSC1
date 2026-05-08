import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { currency } from "../App";
import { Search, Filter, RefreshCw, Eye, Edit3, Calendar, User, DollarSign, Package, ShoppingBag, Truck, CheckCircle, XCircle, Clock, ChevronDown, Download } from "lucide-react";

const Orders = ({ token }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage, setOrdersPerPage] = useState(10);
    const isMobile = window.innerWidth <= 768;

    const fetchAllOrders = async () => {
        if (!token) {
            return null;
        }
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/list`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'token': token 
                },
                body: JSON.stringify({})
            });
            
            const data = await response.json();
            
            if (data.success) {
                setOrders(data.orders || []);
            } else {
                toast.error(data.message || "Failed to fetch orders");
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, [token]);

    const handleExportOrders = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/export/orders`, {
                method: 'GET',
                headers: { 'token': token }
            });
            
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success("Orders exported successfully");
            } else {
                toast.error("Failed to export orders");
            }
        } catch (error) {
            console.error('Error exporting orders:', error);
            toast.error("Failed to export orders");
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/order/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({ 
                    orderId, 
                    status: newStatus 
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                toast.success(`Order status updated to ${newStatus}`);
                fetchAllOrders();
            } else {
                toast.error(data.message || "Failed to update order status");
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            toast.error("Failed to update order status");
        }
    };

    // Filter and search orders
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            order.userId?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === "all" || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

    const getPageNumbers = () => {
      const range = [];
      const rangeWithDots = [];
      let l;
      for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
          range.push(i);
        }
      }
      range.forEach((i) => {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push("...");
          }
        }
        rangeWithDots.push(i);
        l = i;
      });
      return rangeWithDots;
    };

    const statusBadgeStyle = (status) => ({
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "0.8rem",
        fontWeight: "700",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        backgroundColor: 
            status === 'Delivered' ? "rgba(16,185,129,0.1)" :
            status === 'Shipped' ? "rgba(59,130,246,0.1)" :
            status === 'Processing' ? "rgba(245,158,11,0.1)" :
            status === 'Cancelled' ? "rgba(239,68,68,0.1)" :
            status === 'Order Placed' ? "rgba(139,92,246,0.1)" : "rgba(107,114,128,0.1)",
        color: 
            status === 'Delivered' ? "#10b981" :
            status === 'Shipped' ? "#3b82f6" :
            status === 'Processing' ? "#f59e0b" :
            status === 'Cancelled' ? "#ef4444" :
            status === 'Order Placed' ? "#8b5cf6" : "#6b7280",
        border: `2px solid ${
            status === 'Delivered' ? "rgba(16,185,129,0.2)" :
            status === 'Shipped' ? "rgba(59,130,246,0.2)" :
            status === 'Processing' ? "rgba(245,158,11,0.2)" :
            status === 'Cancelled' ? "rgba(239,68,68,0.2)" :
            status === 'Order Placed' ? "rgba(139,92,246,0.2)" : "rgba(107,114,128,0.2)"
        }`
    });

    const getStatusIcon = (status) => {
        switch(status) {
            case 'Delivered': return <CheckCircle size={14} />;
            case 'Shipped': return <Truck size={14} />;
            case 'Processing': return <Clock size={14} />;
            case 'Cancelled': return <XCircle size={14} />;
            case 'Order Placed': return <ShoppingBag size={14} />;
            default: return <Package size={14} />;
        }
    };

    const cardStyle = {
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "16px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        transform: "translateY(0)"
    };

    const cardHoverStyle = {
        ...cardStyle,
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.15)",
        transform: "translateY(-4px)",
        borderColor: "#3b82f6"
    };

    const modalStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        animation: "fadeIn 0.3s ease-out"
    };

    const modalContentStyle = {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "32px",
        maxWidth: "800px",
        width: "90%",
        maxHeight: "90vh",
        overflow: "auto",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        animation: "slideIn 0.3s ease-out"
    };

    // Add CSS animations
    const animationStyles = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from { 
                opacity: 0; 
                transform: translateY(-20px) scale(0.95);
            }
            to { 
                opacity: 1; 
                transform: translateY(0) scale(1);
            }
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .order-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .order-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            border-color: #3b82f6;
        }
        
        .status-badge {
            transition: all 0.2s ease;
        }
        
        .status-badge:hover {
            transform: scale(1.05);
        }
        
        .button-hover {
            transition: all 0.2s ease;
        }
        
        .button-hover:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
    `;

    // Calculate order stats
    const orderStats = {
        total: orders.length,
        placed: orders.filter(o => o.status === 'Order Placed').length,
        processing: orders.filter(o => o.status === 'Processing').length,
        shipped: orders.filter(o => o.status === 'Shipped').length,
        delivered: orders.filter(o => o.status === 'Delivered').length,
        cancelled: orders.filter(o => o.status === 'Cancelled').length,
        revenue: orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + (o.amount || 0), 0)
    };

    return (
        <div style={{ padding: isMobile ? "16px" : "32px", backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            {/* Add CSS animations */}
            <style>{animationStyles}</style>
            
            {/* Premium Header Card */}
            <div style={{
                background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
                borderRadius: isMobile ? "12px" : "20px",
                padding: isMobile ? "16px" : "28px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                border: "1px solid #f3f4f6",
                marginBottom: isMobile ? "16px" : "24px"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
                    <div style={{
                        width: isMobile ? "36px" : "44px",
                        height: isMobile ? "36px" : "44px",
                        borderRadius: "12px",
                        background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                    }}>
                        <ShoppingBag size={isMobile ? 18 : 24} />
                    </div>
                    <div>
                        <h1 style={{ 
                            fontSize: isMobile ? "1.25rem" : "1.5rem", 
                            fontWeight: "800",
                            color: "#1f2937",
                            margin: "0 0 4px 0"
                        }}>
                            Order Management
                        </h1>
                        <p style={{ margin: 0, fontSize: isMobile ? "12px" : "14px", color: "#6b7280" }}>
                            {filteredOrders.length} orders • {currency}{orderStats.revenue.toFixed(2)} revenue
                        </p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "repeat(3, 1fr)" : "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: isMobile ? "10px" : "16px",
                    marginBottom: "24px"
                }}>
                    {[
                        { label: "Total", value: orderStats.total, color: "#6b7280", bg: "rgba(107,114,128,0.1)" },
                        { label: "Placed", value: orderStats.placed, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
                        { label: "Processing", value: orderStats.processing, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
                        { label: "Shipped", value: orderStats.shipped, color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
                        { label: "Delivered", value: orderStats.delivered, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
                        { label: "Cancelled", value: orderStats.cancelled, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
                    ].map((stat, idx) => (
                        <div key={idx} style={{
                            background: stat.bg,
                            borderRadius: "12px",
                            padding: isMobile ? "12px" : "16px",
                            textAlign: "center",
                            border: `2px solid ${stat.bg}`,
                            transition: "all 0.3s ease"
                        }}>
                            <div style={{ fontSize: isMobile ? "1.25rem" : "1.5rem", fontWeight: "800", color: stat.color, marginBottom: "4px" }}>
                                {stat.value}
                            </div>
                            <div style={{ fontSize: isMobile ? "10px" : "12px", fontWeight: "600", color: "#6b7280", textTransform: "uppercase" }}>
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
                
                <div style={{ display: "flex", gap: "12px" }}>
                    <button
                        onClick={fetchAllOrders}
                        style={{
                            background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
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
                            boxShadow: "0 4px 15px rgba(139,92,246,0.3)",
                            transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 20px rgba(139,92,246,0.4)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 15px rgba(139,92,246,0.3)";
                        }}
                    >
                        <RefreshCw size={18} /> Refresh Orders
                    </button>
                    <button
                        onClick={handleExportOrders}
                        style={{
                            background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
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
                            boxShadow: "0 4px 15px rgba(16,185,129,0.3)",
                            transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 20px rgba(16,185,129,0.4)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 15px rgba(16,185,129,0.3)";
                        }}
                    >
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div style={{
                background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
                borderRadius: "20px",
                padding: "24px",
                marginBottom: "24px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                border: "1px solid #f3f4f6"
            }}>
                <div style={{
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap",
                    alignItems: "center"
                }}>
                    {/* Search */}
                    <div style={{ flex: 1, minWidth: "300px", position: "relative" }}>
                        <Search size={20} style={{ 
                            position: "absolute", 
                            left: "16px", 
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#9ca3af" 
                        }} />
                        <input
                            type="text"
                            placeholder="Search orders by ID or customer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "14px 16px 14px 48px",
                                borderRadius: "12px",
                                border: "2px solid #e5e7eb",
                                fontSize: "15px",
                                outline: "none",
                                transition: "all 0.3s ease",
                                backgroundColor: "#f9fafb"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#8b5cf6";
                                e.target.style.backgroundColor = "#ffffff";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#e5e7eb";
                                e.target.style.backgroundColor = "#f9fafb";
                            }}
                        />
                    </div>

                    {/* Status Filter */}
                    <div style={{ position: "relative", minWidth: "200px" }}>
                        <Filter size={18} style={{
                            position: "absolute",
                            left: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#9ca3af"
                        }} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "14px 16px 14px 42px",
                                borderRadius: "12px",
                                border: "2px solid #e5e7eb",
                                fontSize: "15px",
                                backgroundColor: "#f9fafb",
                                cursor: "pointer",
                                outline: "none",
                                transition: "all 0.3s ease",
                                appearance: "none"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#8b5cf6";
                                e.target.style.backgroundColor = "#ffffff";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#e5e7eb";
                                e.target.style.backgroundColor = "#f9fafb";
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="Order Placed">📦 Order Placed</option>
                            <option value="Processing">⏳ Processing</option>
                            <option value="Shipped">🚚 Shipped</option>
                            <option value="Delivered">✅ Delivered</option>
                            <option value="Cancelled">❌ Cancelled</option>
                        </select>
                        <ChevronDown size={18} style={{
                            position: "absolute",
                            right: "14px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "#9ca3af",
                            pointerEvents: "none"
                        }} />
                    </div>
                </div>
            </div>
            
            {loading ? (
                <div style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center", 
                    minHeight: "400px",
                    flexDirection: "column",
                    gap: "16px"
                }}>
                    <div style={{
                        width: "48px",
                        height: "48px",
                        border: "3px solid #f3f4f6",
                        borderTop: "3px solid #8b5cf6",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                    }}></div>
                    <p style={{ color: "#6b7280", fontWeight: 500 }}>Loading orders...</p>
                </div>
            ) : (
                <div>
                    {currentOrders.length === 0 ? (
                        <div style={{
                            textAlign: "center",
                            padding: "60px 20px",
                            backgroundColor: "#ffffff",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            animation: "fadeIn 0.5s ease-out"
                        }}>
                            <Package size={48} style={{ color: "#9ca3af", marginBottom: "16px" }} />
                            <h3 style={{ color: "#374151", marginBottom: "8px" }}>No orders found</h3>
                            <p style={{ color: "#6b7280", margin: 0 }}>
                                {searchTerm || statusFilter !== "all" 
                                    ? "Try adjusting your search or filters" 
                                    : "Orders will appear here when customers place them"
                                }
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Orders Grid */}
                            <div style={{
                                display: "grid",
                                gap: "20px",
                                marginBottom: "24px"
                            }}>
                                {currentOrders.map((order, index) => (
                                    <div 
                                        key={index} 
                                        className="order-card"
                                        style={{
                                            background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
                                            borderRadius: "20px",
                                            padding: "24px",
                                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                                            border: "1px solid #f3f4f6",
                                            transition: "all 0.3s ease",
                                            cursor: "pointer"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-4px)";
                                            e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.1)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                                        }}
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setShowOrderModal(true);
                                        }}
                                    >
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'flex-start',
                                            flexWrap: "wrap",
                                            gap: "20px"
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "12px",
                                                    marginBottom: "16px",
                                                    flexWrap: "wrap"
                                                }}>
                                                    <div style={{
                                                        width: "44px",
                                                        height: "44px",
                                                        borderRadius: "12px",
                                                        background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        color: "white",
                                                        fontSize: "18px",
                                                        fontWeight: "700"
                                                    }}>
                                                        {order._id?.slice(-2).toUpperCase() || '??'}
                                                    </div>
                                                    <div>
                                                        <h3 style={{ 
                                                            margin: "0 0 4px 0", 
                                                            color: "#1f2937",
                                                            fontSize: "1.125rem",
                                                            fontWeight: "700"
                                                        }}>
                                                            Order #{order._id?.slice(-8) || 'N/A'}
                                                        </h3>
                                                        <span className="status-badge" style={statusBadgeStyle(order.status)}>
                                                            {getStatusIcon(order.status)} {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                                                    gap: "16px"
                                                }}>
                                                    <div style={{ 
                                                        display: "flex", 
                                                        alignItems: "center", 
                                                        gap: "10px",
                                                        padding: "12px",
                                                        backgroundColor: "rgba(59,130,246,0.05)",
                                                        borderRadius: "10px"
                                                    }}>
                                                        <div style={{
                                                            width: "32px",
                                                            height: "32px",
                                                            borderRadius: "8px",
                                                            backgroundColor: "rgba(59,130,246,0.1)",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center"
                                                        }}>
                                                            <User size={16} style={{ color: "#3b82f6" }} />
                                                        </div>
                                                        <div>
                                                            <p style={{ margin: "0 0 2px 0", fontSize: "11px", color: "#6b7280", fontWeight: "600" }}>CUSTOMER</p>
                                                            <p style={{ margin: 0, fontSize: "13px", color: "#1f2937", fontWeight: "600" }}>
                                                                {order.userId?.slice(-8) || 'Unknown'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div style={{ 
                                                        display: "flex", 
                                                        alignItems: "center", 
                                                        gap: "10px",
                                                        padding: "12px",
                                                        backgroundColor: "rgba(16,185,129,0.05)",
                                                        borderRadius: "10px"
                                                    }}>
                                                        <div style={{
                                                            width: "32px",
                                                            height: "32px",
                                                            borderRadius: "8px",
                                                            backgroundColor: "rgba(16,185,129,0.1)",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center"
                                                        }}>
                                                            <DollarSign size={16} style={{ color: "#10b981" }} />
                                                        </div>
                                                        <div>
                                                            <p style={{ margin: "0 0 2px 0", fontSize: "11px", color: "#6b7280", fontWeight: "600" }}>AMOUNT</p>
                                                            <p style={{ margin: 0, fontSize: "13px", color: "#10b981", fontWeight: "700" }}>
                                                                {currency}{order.amount}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div style={{ 
                                                        display: "flex", 
                                                        alignItems: "center", 
                                                        gap: "10px",
                                                        padding: "12px",
                                                        backgroundColor: "rgba(245,158,11,0.05)",
                                                        borderRadius: "10px"
                                                    }}>
                                                        <div style={{
                                                            width: "32px",
                                                            height: "32px",
                                                            borderRadius: "8px",
                                                            backgroundColor: "rgba(245,158,11,0.1)",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center"
                                                        }}>
                                                            <Calendar size={16} style={{ color: "#f59e0b" }} />
                                                        </div>
                                                        <div>
                                                            <p style={{ margin: "0 0 2px 0", fontSize: "11px", color: "#6b7280", fontWeight: "600" }}>DATE</p>
                                                            <p style={{ margin: 0, fontSize: "13px", color: "#1f2937", fontWeight: "600" }}>
                                                                {new Date(order.date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div style={{ minWidth: "220px" }}>
                                                <label style={{ 
                                                    display: "block", 
                                                    marginBottom: "10px",
                                                    fontWeight: "600",
                                                    color: "#374151",
                                                    fontSize: "13px",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.05em"
                                                }}>
                                                    Update Status
                                                </label>
                                                <select 
                                                    value={order.status}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        updateOrderStatus(order._id, e.target.value);
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                        padding: '12px 14px',
                                                        borderRadius: '12px',
                                                        border: '2px solid #e5e7eb',
                                                        fontSize: "14px",
                                                        backgroundColor: "#ffffff",
                                                        cursor: "pointer",
                                                        transition: "all 0.3s ease",
                                                        outline: "none"
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = "#8b5cf6";
                                                        e.target.style.boxShadow = "0 0 0 4px rgba(139,92,246,0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = "#e5e7eb";
                                                        e.target.style.boxShadow = "none";
                                                    }}
                                                >
                                                    <option value="Order Placed">📦 Order Placed</option>
                                                    <option value="Processing">⏳ Processing</option>
                                                    <option value="Shipped">🚚 Shipped</option>
                                                    <option value="Delivered">✅ Delivered</option>
                                                    <option value="Cancelled">❌ Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        {/* Quick Actions */}
                                        <div style={{
                                            display: "flex",
                                            gap: "12px",
                                            marginTop: "20px",
                                            paddingTop: "20px",
                                            borderTop: "1px solid #f3f4f6"
                                        }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedOrder(order);
                                                    setShowOrderModal(true);
                                                }}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    padding: "10px 16px",
                                                    borderRadius: "10px",
                                                    border: "none",
                                                    background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                                                    color: "white",
                                                    fontSize: "13px",
                                                    fontWeight: "600",
                                                    cursor: "pointer",
                                                    boxShadow: "0 4px 15px rgba(139,92,246,0.3)",
                                                    transition: "all 0.3s ease"
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.transform = "translateY(-2px)";
                                                    e.target.style.boxShadow = "0 6px 20px rgba(139,92,246,0.4)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = "translateY(0)";
                                                    e.target.style.boxShadow = "0 4px 15px rgba(139,92,246,0.3)";
                                                }}
                                            >
                                                <Eye size={16} />
                                                View Details
                                            </button>
                                            <span style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "6px",
                                                padding: "10px 16px",
                                                fontSize: "13px",
                                                color: "#6b7280"
                                            }}>
                                                <Package size={16} />
                                                {order.items?.length || 0} items
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div style={{
                                    display: "flex",
                                    flexDirection: isMobile ? "column" : "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: isMobile ? "12px" : "16px",
                                    marginTop: "24px",
                                    padding: isMobile ? "16px" : "16px 20px",
                                    backgroundColor: "#fff",
                                    borderRadius: "14px",
                                    border: "1px solid #e5e7eb"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                                        <span style={{ fontSize: "13px", color: "#6b7280", fontWeight: "500", whiteSpace: "nowrap" }}>
                                            {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length}
                                        </span>
                                        <select
                                            value={ordersPerPage}
                                            onChange={(e) => { setOrdersPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                            style={{
                                                padding: "6px 10px", borderRadius: "8px", border: "1px solid #d1d5db",
                                                fontSize: "12px", backgroundColor: "#fff", cursor: "pointer", outline: "none"
                                            }}
                                        >
                                            <option value={10}>10 / page</option>
                                            <option value={25}>25 / page</option>
                                            <option value={50}>50 / page</option>
                                            <option value={100}>100 / page</option>
                                        </select>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                        <button
                                            onClick={() => setCurrentPage(1)}
                                            disabled={currentPage === 1}
                                            style={{
                                                padding: "8px 10px", borderRadius: "8px", border: "1px solid #d1d5db",
                                                backgroundColor: currentPage === 1 ? "#f3f4f6" : "#fff",
                                                color: currentPage === 1 ? "#9ca3af" : "#374151",
                                                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                                fontSize: "13px", fontWeight: "600", transition: "all 0.2s ease", lineHeight: "1"
                                            }}
                                        >«</button>
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            style={{
                                                padding: "8px 10px", borderRadius: "8px", border: "1px solid #d1d5db",
                                                backgroundColor: currentPage === 1 ? "#f3f4f6" : "#fff",
                                                color: currentPage === 1 ? "#9ca3af" : "#374151",
                                                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                                fontSize: "13px", fontWeight: "600", transition: "all 0.2s ease", lineHeight: "1"
                                            }}
                                        >‹</button>
                                        {getPageNumbers().map((page, idx) =>
                                            page === "..." ? (
                                                <span key={`e${idx}`} style={{ padding: "8px 6px", fontSize: "13px", color: "#9ca3af" }}>...</span>
                                            ) : (
                                                <button
                                                    key={page}
                                                    onClick={() => setCurrentPage(page)}
                                                    style={{
                                                        minWidth: "36px", padding: "8px 0", borderRadius: "8px", border: "none",
                                                        backgroundColor: currentPage === page ? "#8b5cf6" : "transparent",
                                                        color: currentPage === page ? "#fff" : "#374151",
                                                        cursor: "pointer", fontSize: "13px", fontWeight: currentPage === page ? "700" : "500",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                    onMouseEnter={(e) => { if (currentPage !== page) e.target.style.backgroundColor = "#f3f4f6"; }}
                                                    onMouseLeave={(e) => { if (currentPage !== page) e.target.style.backgroundColor = "transparent"; }}
                                                >{page}</button>
                                            )
                                        )}
                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            style={{
                                                padding: "8px 10px", borderRadius: "8px", border: "1px solid #d1d5db",
                                                backgroundColor: currentPage === totalPages ? "#f3f4f6" : "#fff",
                                                color: currentPage === totalPages ? "#9ca3af" : "#374151",
                                                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                                fontSize: "13px", fontWeight: "600", transition: "all 0.2s ease", lineHeight: "1"
                                            }}
                                        >›</button>
                                        <button
                                            onClick={() => setCurrentPage(totalPages)}
                                            disabled={currentPage === totalPages}
                                            style={{
                                                padding: "8px 10px", borderRadius: "8px", border: "1px solid #d1d5db",
                                                backgroundColor: currentPage === totalPages ? "#f3f4f6" : "#fff",
                                                color: currentPage === totalPages ? "#9ca3af" : "#374151",
                                                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                                fontSize: "13px", fontWeight: "600", transition: "all 0.2s ease", lineHeight: "1"
                                            }}
                                        >»</button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
            
            {/* Order Details Modal */}
            {showOrderModal && selectedOrder && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1000,
                    padding: "20px"
                }} onClick={() => setShowOrderModal(false)}>
                    <div style={{
                        background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
                        borderRadius: "24px",
                        maxWidth: "800px",
                        width: "100%",
                        maxHeight: "90vh",
                        overflow: "auto",
                        boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
                    }} onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div style={{
                            padding: "24px 24px 0 24px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{
                                    width: "44px",
                                    height: "44px",
                                    borderRadius: "12px",
                                    background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "white"
                                }}>
                                    <ShoppingBag size={24} />
                                </div>
                                <div>
                                    <h2 style={{ margin: "0 0 4px 0", fontSize: "1.5rem", fontWeight: "800", color: "#1f2937" }}>
                                        Order Details
                                    </h2>
                                    <span className="status-badge" style={statusBadgeStyle(selectedOrder.status)}>
                                        {getStatusIcon(selectedOrder.status)} {selectedOrder.status}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowOrderModal(false)}
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "10px",
                                    border: "none",
                                    backgroundColor: "#f3f4f6",
                                    cursor: "pointer",
                                    fontSize: "20px",
                                    color: "#6b7280",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    transition: "all 0.3s ease"
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = "#ef4444";
                                    e.target.style.color = "white";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = "#f3f4f6";
                                    e.target.style.color = "#6b7280";
                                }}
                            >
                                ✕
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div style={{ padding: "24px" }}>
                            {/* Info Cards Grid */}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                gap: "16px",
                                marginBottom: "24px"
                            }}>
                                <div style={{
                                    background: "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(167,139,250,0.1) 100%)",
                                    padding: "16px",
                                    borderRadius: "12px",
                                    border: "2px solid rgba(139,92,246,0.1)"
                                }}>
                                    <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "#6b7280", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em" }}>Order ID</p>
                                    <p style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#8b5cf6" }}>#{selectedOrder._id?.slice(-8)}</p>
                                </div>
                                <div style={{
                                    background: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(52,211,153,0.1) 100%)",
                                    padding: "16px",
                                    borderRadius: "12px",
                                    border: "2px solid rgba(16,185,129,0.1)"
                                }}>
                                    <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "#6b7280", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em" }}>Total Amount</p>
                                    <p style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#10b981" }}>{currency}{selectedOrder.amount}</p>
                                </div>
                                <div style={{
                                    background: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(96,165,250,0.1) 100%)",
                                    padding: "16px",
                                    borderRadius: "12px",
                                    border: "2px solid rgba(59,130,246,0.1)"
                                }}>
                                    <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "#6b7280", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em" }}>Customer</p>
                                    <p style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#3b82f6" }}>{selectedOrder.userId?.slice(-8) || 'Unknown'}</p>
                                </div>
                                <div style={{
                                    background: "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(251,191,36,0.1) 100%)",
                                    padding: "16px",
                                    borderRadius: "12px",
                                    border: "2px solid rgba(245,158,11,0.1)"
                                }}>
                                    <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "#6b7280", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em" }}>Date</p>
                                    <p style={{ margin: 0, fontSize: "13px", fontWeight: "600", color: "#f59e0b" }}>{new Date(selectedOrder.date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div style={{
                                backgroundColor: "#f9fafb",
                                padding: "16px",
                                borderRadius: "12px",
                                marginBottom: "24px",
                                display: "flex",
                                alignItems: "center",
                                gap: "12px"
                            }}>
                                <div style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "10px",
                                    backgroundColor: "#e5e7eb",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}>
                                    <DollarSign size={20} style={{ color: "#6b7280" }} />
                                </div>
                                <div>
                                    <p style={{ margin: "0 0 2px 0", fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>Payment Method</p>
                                    <p style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#1f2937" }}>{selectedOrder.paymentMethod || 'Cash on Delivery'}</p>
                                </div>
                            </div>
                            
                            {/* Order Items */}
                            {selectedOrder.items && selectedOrder.items.length > 0 && (
                                <div>
                                    <h3 style={{ 
                                        marginBottom: "16px", 
                                        color: "#1f2937", 
                                        fontSize: "1.1rem",
                                        fontWeight: "700",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "8px"
                                    }}>
                                        <Package size={20} style={{ color: "#8b5cf6" }} />
                                        Order Items ({selectedOrder.items.length})
                                    </h3>
                                    <div style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                                        gap: "12px"
                                    }}>
                                        {selectedOrder.items.map((item, itemIndex) => (
                                            <div key={itemIndex} style={{
                                                padding: '16px',
                                                background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
                                                borderRadius: '16px',
                                                border: '1px solid #f3f4f6',
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                                transition: "all 0.3s ease"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "translateY(-2px)";
                                                e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "translateY(0)";
                                                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                                            }}
                                            >
                                                <div style={{ fontWeight: "700", marginBottom: "12px", color: "#1f2937", fontSize: "15px" }}>
                                                    {item.name}
                                                </div>
                                                <div style={{ 
                                                    fontSize: "13px", 
                                                    color: "#6b7280",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "6px"
                                                }}>
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <span>Size:</span>
                                                        <span style={{ fontWeight: "600", color: "#374151" }}>{item.size}</span>
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <span>Quantity:</span>
                                                        <span style={{ fontWeight: "600", color: "#374151" }}>{item.quantity}</span>
                                                    </div>
                                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                                        <span>Price:</span>
                                                        <span style={{ fontWeight: "700", color: "#10b981" }}>{currency}{item.price}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Actions */}
                            <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                                <button
                                    onClick={() => setShowOrderModal(false)}
                                    style={{
                                        backgroundColor: "#f3f4f6",
                                        color: "#6b7280",
                                        border: "none",
                                        padding: "12px 24px",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = "#e5e7eb";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = "#f3f4f6";
                                    }}
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => setShowOrderModal(false)}
                                    style={{
                                        background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                                        color: "white",
                                        border: "none",
                                        padding: "12px 24px",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        boxShadow: "0 4px 15px rgba(139,92,246,0.3)",
                                        transition: "all 0.3s ease"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = "translateY(-2px)";
                                        e.target.style.boxShadow = "0 6px 20px rgba(139,92,246,0.4)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = "translateY(0)";
                                        e.target.style.boxShadow = "0 4px 15px rgba(139,92,246,0.3)";
                                    }}
                                >
                                    Print Invoice
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <ToastContainer />
        </div>
    );
};

export default Orders;