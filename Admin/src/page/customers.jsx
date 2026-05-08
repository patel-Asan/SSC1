import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Search, User, Mail, Phone, DollarSign, ShoppingCart, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";

const Customers = ({ token }) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const isMobile = window.innerWidth <= 768;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const currency = "₹";

    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/customer/list`, {
                headers: { 'token': token }
            });
            const data = await response.json();
            if (data.success) {
                setCustomers(data.customers);
            } else {
                toast.error(data.message || "Failed to fetch customers");
            }
        } catch (error) {
            console.error("Failed to fetch customers:", error);
            toast.error("Failed to fetch customers");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (customerId) => {
        const result = await Swal.fire({
            title: 'Delete Customer?',
            text: "Are you sure you want to delete this customer?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });
        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`${backendUrl}/api/customer/${customerId}`, {
                method: 'DELETE',
                headers: { 'token': token }
            });
            const data = await response.json();
            if (data.success) {
                Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Customer deleted successfully', timer: 2000, showConfirmButton: false });
                fetchCustomers();
            } else {
                toast.error(data.message || "Failed to delete customer");
            }
        } catch (error) {
            console.error("Failed to delete customer:", error);
            toast.error("Failed to delete customer");
        }
    };

    const handleViewDetails = async (customerId) => {
        try {
            const response = await fetch(`${backendUrl}/api/customer/${customerId}`, {
                headers: { 'token': token }
            });
            const data = await response.json();
            if (data.success) {
                setSelectedCustomer(data.customer);
                setShowModal(true);
            } else {
                toast.error(data.message || "Failed to fetch customer details");
            }
        } catch (error) {
            console.error("Failed to fetch customer details:", error);
            toast.error("Failed to fetch customer details");
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, [token]);

    const filteredCustomers = customers.filter(customer =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                minHeight: "400px",
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
            }}>
                <p style={{ color: "#6b7280" }}>Loading customers...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: isMobile ? "16px" : "24px", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", minHeight: "100vh" }}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "32px",
                flexWrap: "wrap",
                gap: isMobile ? "12px" : "0"
            }}>
                <div>
                    <h1 style={{ 
                        fontSize: isMobile ? "1.5rem" : "2rem", 
                        fontWeight: "700", 
                        color: "#1f2937",
                        margin: "0 0 8px 0"
                    }}>
                        Customer Management
                    </h1>
                    <p style={{ color: "#6b7280", margin: 0, fontSize: isMobile ? "13px" : "14px" }}>
                        {filteredCustomers.length} customers found
                    </p>
                </div>
            </div>

            {/* Search */}
            <div style={{
                background: "white",
                padding: isMobile ? "16px" : "20px",
                borderRadius: "16px",
                marginBottom: "24px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
            }}>
                <div style={{ position: "relative" }}>
                    <Search size={20} style={{ 
                        position: "absolute", 
                        left: "16px", 
                        top: "50%", 
                        transform: "translateY(-50%)",
                        color: "#9ca3af" 
                    }} />
                    <input
                        type="text"
                        placeholder="Search customers by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "14px 14px 14px 48px",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            fontSize: "15px",
                            outline: "none",
                            transition: "all 0.2s ease"
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = "#8b5cf6";
                            e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = "#e5e7eb";
                            e.target.style.boxShadow = "none";
                        }}
                    />
                </div>
            </div>

            {/* Customer List */}
            <div style={{
                display: "grid",
                gap: "16px"
            }}>
                {filteredCustomers.length === 0 ? (
                    <div style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        background: "white",
                        borderRadius: "16px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
                    }}>
                        <User size={48} style={{ color: "#9ca3af", marginBottom: "16px" }} />
                        <h3 style={{ color: "#374151", marginBottom: "8px" }}>No customers found</h3>
                        <p style={{ color: "#6b7280", margin: 0 }}>
                            {searchTerm ? "Try adjusting your search" : "Customers will appear here when they register"}
                        </p>
                    </div>
                ) : (
                    filteredCustomers.map((customer, index) => (
                        <div key={index} style={{
                            background: "white",
                            padding: "24px",
                            borderRadius: "16px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                            transition: "all 0.3s ease",
                            animation: "fadeIn 0.5s ease-out"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
                        }}
                        >
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "16px"
                            }}>
                                <div style={{ flex: 1, minWidth: "300px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                        <div style={{
                                            width: "48px",
                                            height: "48px",
                                            borderRadius: "12px",
                                            background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            <User size={24} color="white" />
                                        </div>
                                        <div>
                                            <h3 style={{ 
                                                margin: 0, 
                                                color: "#1f2937", 
                                                fontSize: "16px", 
                                                fontWeight: "600" 
                                            }}>
                                                {customer.name}
                                            </h3>
                                            <p style={{ 
                                                margin: 0, 
                                                color: "#6b7280", 
                                                fontSize: "14px" 
                                            }}>
                                                {customer.email}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <ShoppingCart size={16} style={{ color: "#6b7280" }} />
                                            <span style={{ fontSize: "14px", color: "#374151" }}>
                                                {customer.totalOrders || 0} orders
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <DollarSign size={16} style={{ color: "#6b7280" }} />
                                            <span style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}>
                                                {currency}{customer.totalSpent?.toLocaleString() || 0}
                                            </span>
                                        </div>
                                        {customer.phone && (
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <Phone size={16} style={{ color: "#6b7280" }} />
                                                <span style={{ fontSize: "14px", color: "#374151" }}>
                                                    {customer.phone}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <button
                                        onClick={() => handleViewDetails(customer._id)}
                                        style={{
                                            padding: "10px 20px",
                                            borderRadius: "10px",
                                            border: "1px solid #e5e7eb",
                                            background: "white",
                                            color: "#374151",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            transition: "all 0.2s ease"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = "#f9fafb";
                                            e.target.style.borderColor = "#8b5cf6";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = "white";
                                            e.target.style.borderColor = "#e5e7eb";
                                        }}
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => handleDelete(customer._id)}
                                        style={{
                                            padding: "10px 20px",
                                            borderRadius: "10px",
                                            border: "none",
                                            background: "#fee2e2",
                                            color: "#dc2626",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            transition: "all 0.2s ease"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = "#fecaca";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = "#fee2e2";
                                        }}
                                    >
                                        <Trash2 size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Customer Details Modal */}
            {showModal && selectedCustomer && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                    animation: "fadeIn 0.3s ease-out"
                }} onClick={() => setShowModal(false)}>
                    <div style={{
                        background: "white",
                        borderRadius: "20px",
                        padding: "32px",
                        maxWidth: "800px",
                        width: "90%",
                        maxHeight: "90vh",
                        overflow: "auto",
                        animation: "slideIn 0.3s ease-out"
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px"
                        }}>
                            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#1f2937" }}>
                                Customer Details
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "10px",
                                    border: "none",
                                    background: "#f3f4f6",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                onMouseEnter={(e) => e.target.style.background = "#e5e7eb"}
                                onMouseLeave={(e) => e.target.style.background = "#f3f4f6"}
                            >
                                <X size={20} color="#6b7280" />
                            </button>
                        </div>

                        <div style={{ display: "grid", gap: "20px", marginBottom: "24px" }}>
                            <div style={{
                                padding: "16px",
                                background: "#f9fafb",
                                borderRadius: "12px"
                            }}>
                                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>
                                    NAME
                                </p>
                                <p style={{ margin: 0, fontSize: "16px", color: "#1f2937", fontWeight: "500" }}>
                                    {selectedCustomer.name}
                                </p>
                            </div>
                            <div style={{
                                padding: "16px",
                                background: "#f9fafb",
                                borderRadius: "12px"
                            }}>
                                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>
                                    EMAIL
                                </p>
                                <p style={{ margin: 0, fontSize: "16px", color: "#1f2937", fontWeight: "500" }}>
                                    {selectedCustomer.email}
                                </p>
                            </div>
                            {selectedCustomer.phone && (
                                <div style={{
                                    padding: "16px",
                                    background: "#f9fafb",
                                    borderRadius: "12px"
                                }}>
                                    <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>
                                        PHONE
                                    </p>
                                    <p style={{ margin: 0, fontSize: "16px", color: "#1f2937", fontWeight: "500" }}>
                                        {selectedCustomer.phone}
                                    </p>
                                </div>
                            )}
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                                gap: "16px"
                            }}>
                                <div style={{
                                    padding: "16px",
                                    background: "#f9fafb",
                                    borderRadius: "12px"
                                }}>
                                    <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>
                                        TOTAL ORDERS
                                    </p>
                                    <p style={{ margin: 0, fontSize: "20px", color: "#1f2937", fontWeight: "700" }}>
                                        {selectedCustomer.totalOrders || 0}
                                    </p>
                                </div>
                                <div style={{
                                    padding: "16px",
                                    background: "#f9fafb",
                                    borderRadius: "12px"
                                }}>
                                    <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>
                                        TOTAL SPENT
                                    </p>
                                    <p style={{ margin: 0, fontSize: "20px", color: "#1f2937", fontWeight: "700" }}>
                                        {currency}{selectedCustomer.totalSpent?.toLocaleString() || 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>
                            Order History
                        </h3>
                        {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                {selectedCustomer.orders.map((order, index) => (
                                    <div key={index} style={{
                                        padding: "16px",
                                        background: "#f9fafb",
                                        borderRadius: "12px",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}>
                                        <div>
                                            <p style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600", color: "#1f2937" }}>
                                                Order #{order._id?.slice(-8)}
                                            </p>
                                            <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                                                {new Date(order.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <p style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "700", color: "#1f2937" }}>
                                                {currency}{order.amount}
                                            </p>
                                            <span style={{
                                                padding: "4px 12px",
                                                borderRadius: "20px",
                                                fontSize: "11px",
                                                fontWeight: "600",
                                                background: 
                                                    order.status === 'Delivered' ? "#dcfce7" :
                                                    order.status === 'Shipped' ? "#dbeafe" :
                                                    order.status === 'Processing' ? "#fef3c7" :
                                                    order.status === 'Cancelled' ? "#fee2e2" : "#f3f4f6",
                                                color: 
                                                    order.status === 'Delivered' ? "#166534" :
                                                    order.status === 'Shipped' ? "#1e40af" :
                                                    order.status === 'Processing' ? "#92400e" :
                                                    order.status === 'Cancelled' ? "#dc2626" : "#374151"
                                            }}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ color: "#6b7280", textAlign: "center", padding: "20px" }}>
                                No orders yet
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;
