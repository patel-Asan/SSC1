import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Users, Send, Trash2, RefreshCw, Search, X, Mail, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

const Newsletter = ({ token }) => {
    const [subscribers, setSubscribers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkForm, setBulkForm] = useState({ subject: "", message: "" });
    const [sending, setSending] = useState(false);
    const isMobile = window.innerWidth <= 768;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const fetchSubscribers = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/subscribe/list`, {
                headers: { token }
            });
            if (response.data.success) {
                setSubscribers(response.data.subscribers);
            }
        } catch (error) {
            console.error("Fetch subscribers error:", error);
            toast.error("Failed to fetch subscribers");
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveSubscriber = async (id) => {
        const result = await Swal.fire({
            title: 'Remove Subscriber?',
            text: "Are you sure you want to remove this subscriber?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, remove!',
            cancelButtonText: 'Cancel'
        });
        if (!result.isConfirmed) return;
        try {
            const response = await axios.delete(`${backendUrl}/api/subscribe/${id}`, {
                headers: { token }
            });
            if (response.data.success) {
                Swal.fire({ icon: 'success', title: 'Removed!', text: 'Subscriber removed successfully', timer: 2000, showConfirmButton: false });
                fetchSubscribers();
            }
        } catch (error) {
            toast.error("Failed to remove subscriber");
        }
    };

    const handleSendBulk = async () => {
        if (!bulkForm.subject || !bulkForm.message) {
            toast.error("Fill in subject and message");
            return;
        }
        setSending(true);
        try {
            const response = await axios.post(`${backendUrl}/api/subscribe/send-bulk`, bulkForm, {
                headers: { token }
            });
            if (response.data.success) {
                toast.success(response.data.message);
                setShowBulkModal(false);
                setBulkForm({ subject: "", message: "" });
            }
        } catch (error) {
            toast.error("Failed to send newsletter");
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        fetchSubscribers();
    }, []);

    const filteredSubscribers = subscribers.filter(s =>
        s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeCount = subscribers.filter(s => s.status === 'active').length;
    const unsubscribedCount = subscribers.filter(s => s.status === 'unsubscribed').length;

    return (
        <div style={{ padding: isMobile ? "16px" : "24px", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", minHeight: "100vh" }}>
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
                        Newsletter Management
                    </h1>
                    <p style={{ color: "#6b7280", margin: 0, fontSize: isMobile ? "13px" : "14px" }}>
                        {activeCount} active subscribers • {unsubscribedCount} unsubscribed
                    </p>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                    <button
                        onClick={fetchSubscribers}
                        style={{
                            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
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
                            boxShadow: "0 4px 15px rgba(99,102,241,0.3)",
                        }}
                    >
                        <RefreshCw size={18} /> Refresh
                    </button>
                    <button
                        onClick={() => setShowBulkModal(true)}
                        disabled={activeCount === 0}
                        style={{
                            background: activeCount === 0 ? "#9ca3af" : "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                            color: "white",
                            border: "none",
                            padding: isMobile ? "12px 20px" : "14px 28px",
                            borderRadius: "12px",
                            cursor: activeCount === 0 ? "default" : "pointer",
                            fontSize: isMobile ? "13px" : "15px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            boxShadow: activeCount > 0 ? "0 4px 15px rgba(16,185,129,0.3)" : "none",
                        }}
                    >
                        <Send size={18} /> Send Newsletter
                    </button>
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
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "14px 14px 14px 48px",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            fontSize: "14px",
                            outline: "none"
                        }}
                    />
                </div>
            </div>

            {/* Subscribers List */}
            {loading ? (
                <div style={{ textAlign: "center", padding: "60px", color: "#6b7280" }}>Loading...</div>
            ) : filteredSubscribers.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "60px",
                    background: "white",
                    borderRadius: "16px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
                }}>
                    <Users size={48} style={{ color: "#9ca3af", marginBottom: "16px" }} />
                    <h3 style={{ color: "#374151" }}>No subscribers found</h3>
                </div>
            ) : (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(350px, 1fr))",
                    gap: "16px"
                }}>
                    {filteredSubscribers.map((sub) => (
                        <div key={sub._id} style={{
                            background: "white",
                            padding: isMobile ? "16px" : "20px",
                            borderRadius: "16px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                            borderLeft: sub.status === 'active' ? "4px solid #10b981" : "4px solid #ef4444"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                                        <div style={{
                                            width: "40px",
                                            height: "40px",
                                            borderRadius: "50%",
                                            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "white",
                                            fontWeight: "700",
                                            fontSize: "16px"
                                        }}>
                                            {sub.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, color: "#1f2937", fontSize: "15px" }}>{sub.name}</h4>
                                            <p style={{ margin: 0, color: "#6b7280", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                                                <Mail size={12} /> {sub.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: "flex", gap: "12px", fontSize: "12px", color: "#9ca3af", marginTop: "8px" }}>
                                        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                            <Calendar size={12} /> Subscribed: {new Date(sub.subscribedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {sub.couponCode && (
                                        <div style={{
                                            marginTop: "12px",
                                            padding: "8px 12px",
                                            background: "#f3f4f6",
                                            borderRadius: "8px",
                                            fontSize: "13px",
                                            fontWeight: "700",
                                            color: "#6366f1",
                                            letterSpacing: "1px"
                                        }}>
                                            Coupon: {sub.couponCode}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                                    <span style={{
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        fontSize: "11px",
                                        fontWeight: "600",
                                        background: sub.status === 'active' ? "#dcfce7" : "#fee2e2",
                                        color: sub.status === 'active' ? "#166534" : "#dc2626"
                                    }}>
                                        {sub.status}
                                    </span>
                                    <button
                                        onClick={() => handleRemoveSubscriber(sub._id)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "#9ca3af",
                                            padding: "4px"
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Bulk Send Modal */}
            {showBulkModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                    padding: "20px"
                }}>
                    <div style={{
                        background: "white",
                        borderRadius: "20px",
                        padding: isMobile ? "24px" : "32px",
                        maxWidth: "500px",
                        width: "100%",
                        maxHeight: "90vh",
                        overflowY: "auto"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#1f2937" }}>Send Newsletter</h2>
                            <button onClick={() => setShowBulkModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7280" }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            <div>
                                <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px", display: "block" }}>Subject</label>
                                <input
                                    type="text"
                                    placeholder="Email subject line"
                                    value={bulkForm.subject}
                                    onChange={(e) => setBulkForm({ ...bulkForm, subject: e.target.value })}
                                    style={{
                                        width: "100%",
                                        padding: "14px",
                                        borderRadius: "12px",
                                        border: "1px solid #e5e7eb",
                                        fontSize: "14px",
                                        outline: "none"
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: "14px", fontWeight: "600", color: "#374151", marginBottom: "8px", display: "block" }}>Message</label>
                                <textarea
                                    placeholder="Write your newsletter message..."
                                    value={bulkForm.message}
                                    onChange={(e) => setBulkForm({ ...bulkForm, message: e.target.value })}
                                    rows={6}
                                    style={{
                                        width: "100%",
                                        padding: "14px",
                                        borderRadius: "12px",
                                        border: "1px solid #e5e7eb",
                                        fontSize: "14px",
                                        outline: "none",
                                        resize: "vertical",
                                        fontFamily: "inherit"
                                    }}
                                />
                            </div>
                            <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
                                Will be sent to <strong>{activeCount}</strong> active subscribers
                            </p>
                            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
                                <button
                                    onClick={() => setShowBulkModal(false)}
                                    style={{
                                        flex: 1,
                                        padding: "14px",
                                        background: "#f3f4f6",
                                        color: "#374151",
                                        border: "none",
                                        borderRadius: "12px",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        fontSize: "14px"
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendBulk}
                                    disabled={sending}
                                    style={{
                                        flex: 1,
                                        padding: "14px",
                                        background: sending ? "#9ca3af" : "linear-gradient(135deg, #10b981, #34d399)",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "12px",
                                        cursor: sending ? "default" : "pointer",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px"
                                    }}
                                >
                                    <Send size={16} /> {sending ? "Sending..." : "Send to All"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Newsletter;
