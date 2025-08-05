import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { currency } from "../App";
import { Search, Filter, RefreshCw, Eye, Edit, Calendar, User, DollarSign, Package } from "lucide-react";

const Orders = ({ token }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);

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

    const statusBadgeStyle = (status) => ({
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "0.75rem",
        fontWeight: "600",
        backgroundColor: 
            status === 'Delivered' ? "#dcfce7" :
            status === 'Shipped' ? "#dbeafe" :
            status === 'Processing' ? "#fef3c7" :
            status === 'Cancelled' ? "#fee2e2" : "#f3f4f6",
        color: 
            status === 'Delivered' ? "#166534" :
            status === 'Shipped' ? "#1e40af" :
            status === 'Processing' ? "#92400e" :
            status === 'Cancelled' ? "#dc2626" : "#374151"
    });

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

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            {/* Add CSS animations */}
            <style>{animationStyles}</style>
            
            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "2rem",
                flexWrap: "wrap",
                gap: "16px"
            }}>
                <div>
                    <h1 style={{ 
                        fontSize: "2.25rem", 
                        fontWeight: "700",
                        color: "#111827",
                        margin: 0,
                        marginBottom: "8px"
                    }}>
                        Order Management
                    </h1>
                    <p style={{ color: "#6b7280", margin: 0 }}>
                        {filteredOrders.length} orders found
                    </p>
                </div>
                
                <button
                    onClick={fetchAllOrders}
                    className="button-hover"
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        padding: "12px 20px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                    }}
                >
                    <RefreshCw size={16} />
                    Refresh
                </button>
            </div>

            {/* Filters and Search */}
            <div style={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "24px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                border: "1px solid #e5e7eb"
            }}>
                <div style={{
                    display: "flex",
                    gap: "16px",
                    flexWrap: "wrap",
                    alignItems: "center"
                }}>
                    {/* Search */}
                    <div style={{ flex: 1, minWidth: "300px" }}>
                        <div style={{
                            position: "relative",
                            display: "flex",
                            alignItems: "center"
                        }}>
                            <Search size={20} style={{ 
                                position: "absolute", 
                                left: "12px", 
                                color: "#9ca3af" 
                            }} />
                            <input
                                type="text"
                                placeholder="Search orders by ID or customer..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px 12px 12px 44px",
                                    borderRadius: "8px",
                                    border: "1px solid #d1d5db",
                                    fontSize: "0.875rem",
                                    outline: "none",
                                    transition: "all 0.2s ease"
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#3b82f6";
                                    e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#d1d5db";
                                    e.target.style.boxShadow = "none";
                                }}
                            />
                        </div>
                    </div>

                    {/* Status Filter */}
                    <div style={{ minWidth: "200px" }}>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px 16px",
                                borderRadius: "8px",
                                border: "1px solid #d1d5db",
                                fontSize: "0.875rem",
                                backgroundColor: "#ffffff",
                                cursor: "pointer",
                                outline: "none",
                                transition: "all 0.2s ease"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#3b82f6";
                                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#d1d5db";
                                e.target.style.boxShadow = "none";
                            }}
                        >
                            <option value="all">All Status</option>
                            <option value="Order Placed">Order Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
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
                        width: "40px",
                        height: "40px",
                        border: "4px solid #e5e7eb",
                        borderTop: "4px solid #3b82f6",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                    }}></div>
                    <p style={{ color: "#6b7280", margin: 0 }}>Loading orders...</p>
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
                                gap: "16px",
                                marginBottom: "24px"
                            }}>
                                {currentOrders.map((order, index) => (
                                    <div 
                                        key={index} 
                                        className="order-card"
                                        style={cardStyle}
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
                                            gap: "16px"
                                        }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "12px",
                                                    marginBottom: "12px",
                                                    flexWrap: "wrap"
                                                }}>
                                                    <h3 style={{ 
                                                        margin: 0, 
                                                        color: "#111827",
                                                        fontSize: "1.125rem",
                                                        fontWeight: "600"
                                                    }}>
                                                        #{order._id?.slice(-8) || 'N/A'}
                                                    </h3>
                                                    <span className="status-badge" style={statusBadgeStyle(order.status)}>
                                                        {order.status}
                                                    </span>
                                                </div>
                                                
                                                <div style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                                    gap: "12px",
                                                    marginBottom: "12px"
                                                }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <User size={16} style={{ color: "#6b7280" }} />
                                                        <span style={{ fontSize: "0.875rem", color: "#374151" }}>
                                                            {order.userId || 'Unknown'}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <DollarSign size={16} style={{ color: "#6b7280" }} />
                                                        <span style={{ fontSize: "0.875rem", color: "#374151", fontWeight: "500" }}>
                                                            {currency}{order.amount}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                        <Calendar size={16} style={{ color: "#6b7280" }} />
                                                        <span style={{ fontSize: "0.875rem", color: "#374151" }}>
                                                            {new Date(order.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div style={{ minWidth: "200px" }}>
                                                <label style={{ 
                                                    display: "block", 
                                                    marginBottom: "8px",
                                                    fontWeight: "500",
                                                    color: "#374151",
                                                    fontSize: "0.875rem"
                                                }}>
                                                    Update Status:
                                                </label>
                                                <select 
                                                    value={order.status}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        updateOrderStatus(order._id, e.target.value);
                                                    }}
                                                    style={{
                                                        width: "100%",
                                                        padding: '8px 12px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #d1d5db',
                                                        fontSize: "0.875rem",
                                                        backgroundColor: "#ffffff",
                                                        cursor: "pointer",
                                                        transition: "all 0.2s ease"
                                                    }}
                                                    onFocus={(e) => {
                                                        e.target.style.borderColor = "#3b82f6";
                                                        e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = "#d1d5db";
                                                        e.target.style.boxShadow = "none";
                                                    }}
                                                >
                                                    <option value="Order Placed">Order Placed</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Delivered">Delivered</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                        
                                        {/* Quick Actions */}
                                        <div style={{
                                            display: "flex",
                                            gap: "8px",
                                            marginTop: "16px",
                                            paddingTop: "16px",
                                            borderTop: "1px solid #e5e7eb"
                                        }}>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedOrder(order);
                                                    setShowOrderModal(true);
                                                }}
                                                className="button-hover"
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    padding: "6px 12px",
                                                    borderRadius: "6px",
                                                    border: "1px solid #d1d5db",
                                                    backgroundColor: "#ffffff",
                                                    color: "#374151",
                                                    fontSize: "0.75rem",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                <Eye size={14} />
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "8px",
                                    marginTop: "24px"
                                }}>
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="button-hover"
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            border: "1px solid #d1d5db",
                                            backgroundColor: currentPage === 1 ? "#f3f4f6" : "#ffffff",
                                            color: currentPage === 1 ? "#9ca3af" : "#374151",
                                            cursor: currentPage === 1 ? "not-allowed" : "pointer",
                                            fontSize: "0.875rem",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        Previous
                                    </button>
                                    
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className="button-hover"
                                            style={{
                                                padding: "8px 12px",
                                                borderRadius: "6px",
                                                border: "1px solid #d1d5db",
                                                backgroundColor: currentPage === page ? "#3b82f6" : "#ffffff",
                                                color: currentPage === page ? "#ffffff" : "#374151",
                                                cursor: "pointer",
                                                fontSize: "0.875rem",
                                                fontWeight: currentPage === page ? "600" : "400",
                                                transition: "all 0.2s ease"
                                            }}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="button-hover"
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: "6px",
                                            border: "1px solid #d1d5db",
                                            backgroundColor: currentPage === totalPages ? "#f3f4f6" : "#ffffff",
                                            color: currentPage === totalPages ? "#9ca3af" : "#374151",
                                            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                                            fontSize: "0.875rem",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
            
            {/* Order Details Modal */}
            {showOrderModal && selectedOrder && (
                <div style={modalStyle} onClick={() => setShowOrderModal(false)}>
                    <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px"
                        }}>
                            <h2 style={{ margin: 0, color: "#111827", fontSize: "1.5rem" }}>
                                Order Details
                            </h2>
                            <button
                                onClick={() => setShowOrderModal(false)}
                                style={{
                                    backgroundColor: "transparent",
                                    border: "none",
                                    fontSize: "1.5rem",
                                    cursor: "pointer",
                                    color: "#6b7280",
                                    padding: "4px",
                                    borderRadius: "4px",
                                    transition: "all 0.2s ease"
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundColor = "#f3f4f6";
                                    e.target.style.color = "#374151";
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundColor = "transparent";
                                    e.target.style.color = "#6b7280";
                                }}
                            >
                                ×
                            </button>
                        </div>
                        
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                            gap: "20px",
                            marginBottom: "24px"
                        }}>
                            <div>
                                <h3 style={{ marginBottom: "12px", color: "#374151", fontSize: "1rem" }}>
                                    Order Information
                                </h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <div><strong>Order ID:</strong> {selectedOrder._id}</div>
                                    <div><strong>Status:</strong> 
                                        <span className="status-badge" style={{ ...statusBadgeStyle(selectedOrder.status), marginLeft: "8px" }}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                    <div><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString()}</div>
                                    <div><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 style={{ marginBottom: "12px", color: "#374151", fontSize: "1rem" }}>
                                    Customer Information
                                </h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    <div><strong>Customer ID:</strong> {selectedOrder.userId}</div>
                                    <div><strong>Total Amount:</strong> {currency}{selectedOrder.amount}</div>
                                </div>
                            </div>
                        </div>
                        
                        {selectedOrder.items && selectedOrder.items.length > 0 && (
                            <div>
                                <h3 style={{ marginBottom: "16px", color: "#374151", fontSize: "1rem" }}>
                                    Order Items ({selectedOrder.items.length})
                                </h3>
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                                    gap: "12px"
                                }}>
                                    {selectedOrder.items.map((item, itemIndex) => (
                                        <div key={itemIndex} style={{
                                            padding: '16px',
                                            backgroundColor: '#f9fafb',
                                            borderRadius: '8px',
                                            border: '1px solid #e5e7eb',
                                            transition: "all 0.2s ease"
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.backgroundColor = '#f3f4f6';
                                            e.target.style.transform = 'translateY(-2px)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.backgroundColor = '#f9fafb';
                                            e.target.style.transform = 'translateY(0)';
                                        }}
                                        >
                                            <div style={{ fontWeight: "600", marginBottom: "8px", color: "#111827" }}>
                                                {item.name}
                                            </div>
                                            <div style={{ 
                                                fontSize: "0.875rem", 
                                                color: "#6b7280",
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "4px"
                                            }}>
                                                <div>Size: {item.size}</div>
                                                <div>Quantity: {item.quantity}</div>
                                                <div>Price: {currency}{item.price}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div style={{ marginTop: "24px", textAlign: "right" }}>
                            <button
                                onClick={() => setShowOrderModal(false)}
                                className="button-hover"
                                style={{
                                    backgroundColor: "#3b82f6",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "0.875rem",
                                    fontWeight: "500"
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <ToastContainer />
        </div>
    );
};

export default Orders;