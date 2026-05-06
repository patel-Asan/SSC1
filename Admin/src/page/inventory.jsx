import React, { useState, useEffect } from "react";
import { Package, AlertTriangle, RefreshCw, TrendingUp, DollarSign } from "lucide-react";
import { toast } from "react-toastify";

const Inventory = ({ token }) => {
    const [summary, setSummary] = useState(null);
    const [lowStockProducts, setLowStockProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [threshold, setThreshold] = useState(10);
    const isMobile = window.innerWidth <= 768;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const currency = "₹";

    const fetchSummary = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/inventory/summary`, {
                headers: { 'token': token }
            });
            const data = await response.json();
            if (data.success) {
                setSummary(data.summary);
            } else {
                toast.error(data.message || "Failed to fetch inventory summary");
            }
        } catch (error) {
            console.error("Failed to fetch inventory summary:", error);
            toast.error("Failed to fetch inventory summary");
        }
    };

    const fetchLowStock = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/inventory/low-stock?threshold=${threshold}`, {
                headers: { 'token': token }
            });
            const data = await response.json();
            if (data.success) {
                setLowStockProducts(data.lowStockProducts);
            } else {
                toast.error(data.message || "Failed to fetch low stock products");
            }
        } catch (error) {
            console.error("Failed to fetch low stock products:", error);
            toast.error("Failed to fetch low stock products");
        }
    };

    const handleUpdateStock = async (productId, newStock) => {
        try {
            const response = await fetch(`${backendUrl}/api/inventory/update/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({ stock: parseInt(newStock) })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Stock updated successfully");
                fetchSummary();
                fetchLowStock();
            } else {
                toast.error(data.message || "Failed to update stock");
            }
        } catch (error) {
            console.error("Failed to update stock:", error);
            toast.error("Failed to update stock");
        }
    };

    const loadData = async () => {
        setLoading(true);
        await Promise.all([fetchSummary(), fetchLowStock()]);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [token]);

    useEffect(() => {
        fetchLowStock();
    }, [threshold]);

    if (loading) {
        return (
            <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                minHeight: "400px",
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
            }}>
                <p style={{ color: "#6b7280" }}>Loading inventory...</p>
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Products",
            value: summary?.totalProducts || 0,
            icon: Package,
            color: "#3b82f6",
            bg: "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(96,165,250,0.1) 100%)"
        },
        {
            title: "In Stock",
            value: summary?.inStock || 0,
            icon: TrendingUp,
            color: "#10b981",
            bg: "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(52,211,153,0.1) 100%)"
        },
        {
            title: "Low Stock",
            value: summary?.lowStock || 0,
            icon: AlertTriangle,
            color: "#f59e0b",
            bg: "linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(251,191,36,0.1) 100%)"
        },
        {
            title: "Out of Stock",
            value: summary?.outOfStock || 0,
            icon: Package,
            color: "#ef4444",
            bg: "linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(248,113,113,0.1) 100%)"
        },
        {
            title: "Stock Value",
            value: currency + (summary?.totalStockValue || 0).toLocaleString(),
            icon: DollarSign,
            color: "#8b5cf6",
            bg: "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(167,139,250,0.1) 100%)"
        }
    ];

    return (
        <div style={{ padding: isMobile ? "16px" : "24px", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", minHeight: "100vh" }}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>

            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "32px",
                flexWrap: "wrap",
                gap: isMobile ? "16px" : "0"
            }}>
                <div>
                    <h1 style={{ 
                        fontSize: isMobile ? "1.5rem" : "2rem", 
                        fontWeight: "700", 
                        color: "#1f2937",
                        margin: "0 0 8px 0"
                    }}>
                        Inventory Management
                    </h1>
                    <p style={{ color: "#6b7280", margin: 0, fontSize: isMobile ? "13px" : "14px" }}>
                        Monitor and manage product stock levels
                    </p>
                </div>
                <button
                    onClick={loadData}
                    style={{
                        background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                        color: "white",
                        border: "none",
                        padding: isMobile ? "12px 20px" : "14px 28px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontSize: isMobile ? "13px" : "15px",
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
                    <RefreshCw size={20} />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div style={{ 
                display: "grid", 
                gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(auto-fit, minmax(200px, 1fr))", 
                gap: isMobile ? "12px" : "20px", 
                marginBottom: "32px" 
            }}>
                {statCards.map((stat, index) => (
                    <div key={index} style={{
                        background: stat.bg,
                        padding: isMobile ? "16px" : "24px",
                        borderRadius: "16px",
                        border: "2px solid " + stat.color + "20",
                        transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                    >
                        <div style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            background: stat.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "16px"
                        }}>
                            <stat.icon size={24} color="white" />
                        </div>
                        <p style={{ color: "#6b7280", fontSize: "14px", margin: "0 0 8px 0", fontWeight: "500" }}>
                            {stat.title}
                        </p>
                        <p style={{ 
                            color: "#1f2937", 
                            fontSize: "28px", 
                            fontWeight: "700", 
                            margin: 0 
                        }}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Low Stock Alerts */}
            <div style={{
                background: "white",
                padding: "24px",
                borderRadius: "16px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                marginBottom: "24px"
            }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}>
                            <AlertTriangle size={24} color="white" />
                        </div>
                        <div>
                            <h2 style={{
                                fontSize: "1.25rem",
                                fontWeight: "700",
                                color: "#1f2937",
                                margin: "0 0 4px 0",
                            }}>
                                Low Stock Alerts
                            </h2>
                            <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                                Products with stock below threshold
                            </p>
                        </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <label style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}>
                            Threshold:
                        </label>
                        <input
                            type="number"
                            value={threshold}
                            onChange={(e) => setThreshold(parseInt(e.target.value))}
                            min="0"
                            style={{
                                width: "80px",
                                padding: "8px 12px",
                                borderRadius: "8px",
                                border: "1px solid #e5e7eb",
                                fontSize: "14px",
                                outline: "none"
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
                
                {lowStockProducts.length === 0 ? (
                    <div style={{
                        textAlign: "center",
                        padding: "40px 20px",
                        background: "#f9fafb",
                        borderRadius: "12px"
                    }}>
                        <Package size={48} style={{ color: "#9ca3af", marginBottom: "16px" }} />
                        <h3 style={{ color: "#374151", marginBottom: "8px" }}>No low stock products</h3>
                        <p style={{ color: "#6b7280", margin: 0 }}>
                            All products have sufficient stock
                        </p>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {lowStockProducts.map((product, index) => (
                            <div key={index} style={{
                                padding: "16px",
                                background: product.stock === 0 ? "#fee2e2" : "#fef3c7",
                                borderRadius: "12px",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "16px",
                                animation: "fadeIn 0.5s ease-out"
                            }}>
                                <div style={{ flex: 1, minWidth: "300px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        {product.image && (
                                            <img 
                                                src={product.image} 
                                                alt={product.name}
                                                style={{
                                                    width: "48px",
                                                    height: "48px",
                                                    borderRadius: "8px",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        )}
                                        <div>
                                            <h4 style={{ 
                                                margin: "0 0 4px 0", 
                                                fontSize: "15px", 
                                                fontWeight: "600", 
                                                color: "#1f2937" 
                                            }}>
                                                {product.name}
                                            </h4>
                                            <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                                                {product.category || 'No category'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                                    <div style={{ textAlign: "center" }}>
                                        <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>
                                            Current Stock
                                        </p>
                                        <p style={{ 
                                            margin: 0, 
                                            fontSize: "24px", 
                                            fontWeight: "700", 
                                            color: product.stock === 0 ? "#dc2626" : "#f59e0b" 
                                        }}>
                                            {product.stock || 0}
                                        </p>
                                    </div>
                                    
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <input
                                            type="number"
                                            defaultValue={product.stock}
                                            min="0"
                                            style={{
                                                width: "80px",
                                                padding: "8px 12px",
                                                borderRadius: "8px",
                                                border: "1px solid #e5e7eb",
                                                fontSize: "14px",
                                                outline: "none"
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = "#8b5cf6";
                                                e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = "#e5e7eb";
                                                e.target.style.boxShadow = "none";
                                            }}
                                            id={`stock-${product._id}`}
                                        />
                                        <button
                                            onClick={() => {
                                                const input = document.getElementById(`stock-${product._id}`);
                                                if (input && input.value !== product.stock) {
                                                    handleUpdateStock(product._id, input.value);
                                                }
                                            }}
                                            style={{
                                                padding: "8px 16px",
                                                borderRadius: "8px",
                                                border: "none",
                                                background: "#8b5cf6",
                                                color: "white",
                                                cursor: "pointer",
                                                fontSize: "14px",
                                                fontWeight: "500",
                                                transition: "all 0.2s ease"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = "#a78bfa";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = "#8b5cf6";
                                            }}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inventory;
