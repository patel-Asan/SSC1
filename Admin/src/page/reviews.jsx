import React, { useState, useEffect } from "react";
import { Search, Star, Trash2, User, Package, Calendar, Shield } from "lucide-react";
import { toast } from "react-toastify";

const Reviews = ({ token }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const isMobile = window.innerWidth <= 768;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/review/admin/all`, {
                headers: { 'token': token }
            });
            const data = await response.json();
            if (data.success) {
                setReviews(data.reviews);
            } else {
                toast.error(data.message || "Failed to fetch reviews");
            }
        } catch (error) {
            console.error("Failed to fetch reviews:", error);
            toast.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            const response = await fetch(`${backendUrl}/api/review/admin/${reviewId}`, {
                method: 'DELETE',
                headers: { 'token': token }
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Review deleted successfully");
                fetchReviews();
            } else {
                toast.error(data.message || "Failed to delete review");
            }
        } catch (error) {
            console.error("Failed to delete review:", error);
            toast.error("Failed to delete review");
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [token]);

    const filteredReviews = reviews.filter(review =>
        review.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.productId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <Star
                    key={i}
                    size={16}
                    fill={i <= rating ? "#fbbf24" : "none"}
                    color={i <= rating ? "#fbbf24" : "#d1d5db"}
                />
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                minHeight: "400px",
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
            }}>
                <p style={{ color: "#6b7280" }}>Loading reviews...</p>
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
                        Reviews Management
                    </h1>
                    <p style={{ color: "#6b7280", margin: 0, fontSize: isMobile ? "13px" : "14px" }}>
                        {filteredReviews.length} reviews found
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
                        placeholder="Search reviews by user, product, or comment..."
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

            {/* Review List */}
            <div style={{
                display: "grid",
                gap: "16px"
            }}>
                {filteredReviews.length === 0 ? (
                    <div style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        background: "white",
                        borderRadius: "16px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
                    }}>
                        <Star size={48} style={{ color: "#9ca3af", marginBottom: "16px" }} />
                        <h3 style={{ color: "#374151", marginBottom: "8px" }}>No reviews found</h3>
                        <p style={{ color: "#6b7280", margin: 0 }}>
                            {searchTerm ? "Try adjusting your search" : "Reviews will appear here when customers leave them"}
                        </p>
                    </div>
                ) : (
                    filteredReviews.map((review, index) => (
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
                                alignItems: "flex-start",
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
                                                {review.userName || 'Anonymous'}
                                            </h3>
                                            <p style={{ 
                                                margin: 0, 
                                                color: "#6b7280", 
                                                fontSize: "14px" 
                                            }}>
                                                {review.userId?.email || 'No email'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                                        {renderStars(review.rating)}
                                    </div>
                                    
                                    <p style={{ 
                                        margin: "0 0 16px 0", 
                                        fontSize: "15px", 
                                        color: "#374151",
                                        lineHeight: "1.6"
                                    }}>
                                        {review.comment || 'No comment provided'}
                                    </p>
                                    
                                    <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", fontSize: "13px", color: "#6b7280" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <Package size={14} />
                                            <span>
                                                {review.productId?.name || 'Unknown Product'}
                                            </span>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                            <Calendar size={14} />
                                            <span>
                                                {new Date(review.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <button
                                        onClick={() => handleDelete(review._id)}
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
        </div>
    );
};

export default Reviews;
