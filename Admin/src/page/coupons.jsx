import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Plus, Trash2, X, Calendar, Percent, DollarSign, Check, XCircle } from "lucide-react";
import { toast } from "react-toastify";

const Coupons = ({ token }) => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "0",
        maxDiscount: "",
        usageLimit: "",
        expiryDate: ""
    });
    const isMobile = window.innerWidth <= 768;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const currency = "₹";

    const fetchCoupons = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/coupon/list`, {
                headers: { 'token': token }
            });
            const data = await response.json();
            if (data.success) {
                setCoupons(data.coupons.filter(c => !c.code.startsWith('WELCOME-')));
            } else {
                toast.error(data.message || "Failed to fetch coupons");
            }
        } catch (error) {
            console.error("Failed to fetch coupons:", error);
            toast.error("Failed to fetch coupons");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${backendUrl}/api/coupon/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({
                    ...formData,
                    discountValue: parseFloat(formData.discountValue),
                    minOrderAmount: parseFloat(formData.minOrderAmount),
                    maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : null,
                    usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null
                })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Coupon created successfully");
                setShowModal(false);
                setFormData({
                    code: "",
                    discountType: "percentage",
                    discountValue: "",
                    minOrderAmount: "0",
                    maxDiscount: "",
                    usageLimit: "",
                    expiryDate: ""
                });
                fetchCoupons();
            } else {
                toast.error(data.message || "Failed to create coupon");
            }
        } catch (error) {
            console.error("Failed to create coupon:", error);
            toast.error("Failed to create coupon");
        }
    };

    const handleDelete = async (couponId) => {
        const result = await Swal.fire({
            title: 'Delete Coupon?',
            text: "Are you sure you want to delete this coupon?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });
        if (!result.isConfirmed) return;

        try {
            const response = await fetch(`${backendUrl}/api/coupon/${couponId}`, {
                method: 'DELETE',
                headers: { 'token': token }
            });
            const data = await response.json();
            if (data.success) {
                Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Coupon deleted successfully', timer: 2000, showConfirmButton: false });
                fetchCoupons();
            } else {
                toast.error(data.message || "Failed to delete coupon");
            }
        } catch (error) {
            console.error("Failed to delete coupon:", error);
            toast.error("Failed to delete coupon");
        }
    };

    const handleToggleStatus = async (couponId, currentStatus) => {
        try {
            const response = await fetch(`${backendUrl}/api/coupon/${couponId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Coupon status updated");
                fetchCoupons();
            } else {
                toast.error(data.message || "Failed to update coupon");
            }
        } catch (error) {
            console.error("Failed to update coupon:", error);
            toast.error("Failed to update coupon");
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [token]);

    if (loading) {
        return (
            <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                minHeight: "400px",
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
            }}>
                <p style={{ color: "#6b7280" }}>Loading coupons...</p>
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
                gap: isMobile ? "16px" : "0"
            }}>
                <div>
                    <h1 style={{ 
                        fontSize: isMobile ? "1.5rem" : "2rem", 
                        fontWeight: "700", 
                        color: "#1f2937",
                        margin: "0 0 8px 0"
                    }}>
                        Coupons & Discounts
                    </h1>
                    <p style={{ color: "#6b7280", margin: 0, fontSize: isMobile ? "13px" : "14px" }}>
                        {coupons.length} coupons available
                    </p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
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
                    <Plus size={20} />
                    Create Coupon
                </button>
            </div>

            {/* Coupon List */}
            <div style={{
                display: "grid",
                gap: "16px"
            }}>
                {coupons.length === 0 ? (
                    <div style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        background: "white",
                        borderRadius: "16px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
                    }}>
                        <Percent size={48} style={{ color: "#9ca3af", marginBottom: "16px" }} />
                        <h3 style={{ color: "#374151", marginBottom: "8px" }}>No coupons found</h3>
                        <p style={{ color: "#6b7280", margin: 0 }}>
                            Create your first coupon to offer discounts
                        </p>
                    </div>
                ) : (
                    coupons.map((coupon, index) => (
                        <div key={index} style={{
                            background: "white",
                            padding: "24px",
                            borderRadius: "16px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                            transition: "all 0.3s ease",
                            animation: "fadeIn 0.5s ease-out",
                            borderLeft: coupon.isActive ? "4px solid #10b981" : "4px solid #ef4444"
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
                                            padding: "8px 16px",
                                            background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                                            borderRadius: "8px",
                                            color: "white",
                                            fontSize: "16px",
                                            fontWeight: "700",
                                            letterSpacing: "0.05em"
                                        }}>
                                            {coupon.code}
                                        </div>
                                        <span style={{
                                            padding: "4px 12px",
                                            borderRadius: "20px",
                                            fontSize: "12px",
                                            fontWeight: "600",
                                            background: coupon.isActive ? "#dcfce7" : "#fee2e2",
                                            color: coupon.isActive ? "#166534" : "#dc2626"
                                        }}>
                                            {coupon.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                    
                                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            {coupon.discountType === 'percentage' ? (
                                                <Percent size={16} style={{ color: "#6b7280" }} />
                                            ) : (
                                                <DollarSign size={16} style={{ color: "#6b7280" }} />
                                            )}
                                            <span style={{ fontSize: "14px", color: "#374151", fontWeight: "500" }}>
                                                {coupon.discountType === 'percentage' ? `${coupon.discountValue}% off` : `${currency}${coupon.discountValue} off`}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <Calendar size={16} style={{ color: "#6b7280" }} />
                                            <span style={{ fontSize: "14px", color: "#374151" }}>
                                                Expires: {new Date(coupon.expiryDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {coupon.usedCount !== undefined && (
                                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                <Check size={16} style={{ color: "#6b7280" }} />
                                                <span style={{ fontSize: "14px", color: "#374151" }}>
                                                    Used: {coupon.usedCount}/{coupon.usageLimit || '∞'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {coupon.minOrderAmount > 0 && (
                                        <p style={{ margin: "8px 0 0 0", fontSize: "13px", color: "#6b7280" }}>
                                            Min order: {currency}{coupon.minOrderAmount}
                                        </p>
                                    )}
                                </div>
                                
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <button
                                        onClick={() => handleToggleStatus(coupon._id, coupon.isActive)}
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
                                        {coupon.isActive ? "Disable" : "Enable"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(coupon._id)}
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

            {/* Create Coupon Modal */}
            {showModal && (
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
                        maxWidth: "500px",
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
                                Create New Coupon
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

                        <form onSubmit={handleCreate}>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                    Coupon Code
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    required
                                    placeholder="e.g., SUMMER2024"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: "10px",
                                        border: "1px solid #e5e7eb",
                                        fontSize: "15px",
                                        outline: "none",
                                        textTransform: "uppercase"
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

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                    Discount Type
                                </label>
                                <select
                                    value={formData.discountType}
                                    onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: "10px",
                                        border: "1px solid #e5e7eb",
                                        fontSize: "15px",
                                        outline: "none",
                                        background: "white"
                                    }}
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (₹)</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                    Discount Value
                                </label>
                                <input
                                    type="number"
                                    value={formData.discountValue}
                                    onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                                    required
                                    min="0"
                                    placeholder={formData.discountType === 'percentage' ? "e.g., 20" : "e.g., 500"}
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: "10px",
                                        border: "1px solid #e5e7eb",
                                        fontSize: "15px",
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

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                    Minimum Order Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    value={formData.minOrderAmount}
                                    onChange={(e) => setFormData({...formData, minOrderAmount: e.target.value})}
                                    min="0"
                                    placeholder="e.g., 1000"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: "10px",
                                        border: "1px solid #e5e7eb",
                                        fontSize: "15px",
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

                            {formData.discountType === 'percentage' && (
                                <div style={{ marginBottom: "20px" }}>
                                    <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                        Maximum Discount (₹) - Optional
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.maxDiscount}
                                        onChange={(e) => setFormData({...formData, maxDiscount: e.target.value})}
                                        min="0"
                                        placeholder="e.g., 500"
                                        style={{
                                            width: "100%",
                                            padding: "12px 16px",
                                            borderRadius: "10px",
                                            border: "1px solid #e5e7eb",
                                            fontSize: "15px",
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
                            )}

                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                    Usage Limit - Optional
                                </label>
                                <input
                                    type="number"
                                    value={formData.usageLimit}
                                    onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                                    min="1"
                                    placeholder="e.g., 100"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: "10px",
                                        border: "1px solid #e5e7eb",
                                        fontSize: "15px",
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

                            <div style={{ marginBottom: "24px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                    Expiry Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: "10px",
                                        border: "1px solid #e5e7eb",
                                        fontSize: "15px",
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

                            <button
                                type="submit"
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    border: "none",
                                    background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                                    color: "white",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease"
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = "translateY(-2px)";
                                    e.target.style.boxShadow = "0 6px 20px rgba(139,92,246,0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "none";
                                }}
                            >
                                Create Coupon
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;
