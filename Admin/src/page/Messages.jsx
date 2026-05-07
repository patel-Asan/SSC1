import React, { useState, useEffect } from "react";
import { Mail, Search, Trash2, Eye, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { toast } from "react-toastify";

const Messages = ({ token }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const isMobile = window.innerWidth <= 768;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const fetchMessages = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/message/all`, {
                headers: { 'token': token }
            });
            const data = await response.json();
            if (data.success) {
                setMessages(data.messages);
            } else {
                toast.error(data.message || "Failed to fetch messages");
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            toast.error("Failed to fetch messages");
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/api/message/read/${id}`, {
                method: 'PUT',
                headers: { 'token': token }
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Message marked as read");
                fetchMessages();
            }
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;

        try {
            const response = await fetch(`${backendUrl}/api/message/${id}`, {
                method: 'DELETE',
                headers: { 'token': token }
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Message deleted successfully");
                fetchMessages();
            } else {
                toast.error(data.message || "Failed to delete message");
            }
        } catch (error) {
            console.error("Failed to delete message:", error);
            toast.error("Failed to delete message");
        }
    };

    const handleViewMessage = async (msg) => {
        setSelectedMessage(msg);
        setShowModal(true);
        if (msg.status === 'unread') {
            await handleMarkAsRead(msg._id);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [token]);

    const filteredMessages = messages.filter(msg => {
        const matchesSearch = msg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.message?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === "all" || msg.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: messages.length,
        unread: messages.filter(m => m.status === 'unread').length,
        read: messages.filter(m => m.status === 'read').length,
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
                <p style={{ color: "#6b7280" }}>Loading messages...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: isMobile ? "16px" : "24px", minHeight: "100vh" }}>
            <style>{`
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideIn { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Mail size={22} color="white" />
                </div>
                <div>
                    <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", margin: "0 0 2px 0" }}>Messages</h1>
                    <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>Manage customer inquiries and feedback</p>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", marginBottom: "20px" }}>
                {[
                    { label: "Total", value: stats.total, icon: Mail, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
                    { label: "Unread", value: stats.unread, icon: Clock, color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
                    { label: "Read", value: stats.read, icon: CheckCircle, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
                ].map((s, i) => (
                    <div key={i} style={{ background: "#fff", padding: "16px 20px", borderRadius: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #f3f4f6" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <s.icon size={20} color={s.color} />
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: "11px", color: "#6b7280", fontWeight: "600" }}>{s.label}</p>
                                <p style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: s.color }}>{s.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ background: "#fff", padding: "16px 20px", borderRadius: "14px", marginBottom: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>
                    <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
                        <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                        <input type="text" placeholder="Search by name, email or message..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "12px 14px 12px 44px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", transition: "all 0.2s ease" }}
                            onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
                            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
                    </div>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ padding: "12px 16px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", cursor: "pointer", background: "#fff" }}>
                        <option value="all">All Messages</option>
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                    </select>
                </div>
            </div>

            <div style={{ display: "grid", gap: "16px" }}>
                {filteredMessages.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px 20px", background: "white", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                        <MessageSquare size={48} style={{ color: "#9ca3af", marginBottom: "16px" }} />
                        <h3 style={{ color: "#374151", marginBottom: "8px" }}>No messages found</h3>
                        <p style={{ color: "#6b7280", margin: 0 }}>
                            {searchTerm || filterStatus !== "all" ? "Try adjusting your filters" : "Customer messages will appear here"}
                        </p>
                    </div>
                ) : (
                    filteredMessages.map((msg, index) => (
                        <div key={index} style={{
                            background: "#fff",
                            padding: "20px",
                            borderRadius: "14px",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                            border: msg.status === 'unread' ? "1px solid #fbbf24" : "1px solid #f3f4f6",
                            borderLeft: msg.status === 'unread' ? "4px solid #f59e0b" : "4px solid transparent",
                            animation: "fadeIn 0.4s ease-out",
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
                                <div style={{ flex: 1, minWidth: isMobile ? "100%" : "250px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "16px", flexShrink: 0 }}>
                                            {msg.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, color: "#111827", fontSize: "14px", fontWeight: "600" }}>
                                                {msg.name}
                                                {msg.status === 'unread' && (
                                                    <span style={{ marginLeft: "6px", padding: "2px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: "700", background: "#f59e0b", color: "white" }}>NEW</span>
                                                )}
                                            </h3>
                                            <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>{msg.email}</p>
                                        </div>
                                    </div>
                                    <p style={{ margin: "0 0 6px 0", color: "#374151", fontSize: "13px", lineHeight: "1.5", maxHeight: "48px", overflow: "hidden" }}>
                                        {msg.message}
                                    </p>
                                    <p style={{ margin: 0, color: "#9ca3af", fontSize: "11px" }}>
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div style={{ display: "flex", gap: "8px", width: isMobile ? "100%" : "auto", justifyContent: isMobile ? "flex-end" : "flex-start", flexShrink: 0 }}>
                                    <button onClick={() => handleViewMessage(msg)}
                                        style={{ padding: "8px 14px", borderRadius: "8px", border: "1px solid #e5e7eb", background: "#fff", color: "#374151", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", transition: "all 0.2s ease" }}
                                        onMouseEnter={(e) => { e.target.style.borderColor = "#8b5cf6"; e.target.style.color = "#8b5cf6"; }}
                                        onMouseLeave={(e) => { e.target.style.borderColor = "#e5e7eb"; e.target.style.color = "#374151"; }}>
                                        <Eye size={15} /> View
                                    </button>
                                    <button onClick={() => handleDelete(msg._id)}
                                        style={{ padding: "8px 14px", borderRadius: "8px", border: "none", background: "#fee2e2", color: "#dc2626", cursor: "pointer", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", fontWeight: "500", transition: "all 0.2s ease" }}
                                        onMouseEnter={(e) => { e.target.style.background = "#fecaca"; }}
                                        onMouseLeave={(e) => { e.target.style.background = "#fee2e2"; }}>
                                        <Trash2 size={15} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && selectedMessage && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, padding: "20px", backdropFilter: "blur(4px)" }} onClick={() => setShowModal(false)}>
                    <div style={{ background: "#fff", borderRadius: "20px", padding: "28px", maxWidth: "560px", width: "100%", maxHeight: "90vh", overflow: "auto", boxShadow: "0 25px 60px rgba(0,0,0,0.2)" }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Mail size={18} color="white" />
                                </div>
                                <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#111827" }}>Message Details</h2>
                            </div>
                            <button onClick={() => setShowModal(false)}
                                style={{ width: "36px", height: "36px", borderRadius: "10px", border: "none", background: "#f3f4f6", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "#6b7280", transition: "all 0.2s" }}
                                onMouseEnter={(e) => { e.target.style.background = "#ef4444"; e.target.style.color = "white"; }}
                                onMouseLeave={(e) => { e.target.style.background = "#f3f4f6"; e.target.style.color = "#6b7280"; }}>
                                ✕
                            </button>
                        </div>
                        <div style={{ display: "grid", gap: "12px" }}>
                            {[
                                { label: "FROM", value: selectedMessage.name },
                                { label: "EMAIL", value: selectedMessage.email, isLink: true },
                                { label: "MESSAGE", value: selectedMessage.message, isLong: true },
                                { label: "RECEIVED", value: new Date(selectedMessage.createdAt).toLocaleString() },
                            ].map((item, i) => (
                                <div key={i} style={{ padding: "14px 16px", background: "#f9fafb", borderRadius: "10px" }}>
                                    <p style={{ margin: "0 0 6px 0", fontSize: "11px", color: "#6b7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</p>
                                    {item.isLink ? (
                                        <a href={`mailto:${item.value}`} style={{ margin: 0, fontSize: "15px", color: "#8b5cf6", fontWeight: "500", textDecoration: "none" }}>{item.value}</a>
                                    ) : (
                                        <p style={{ margin: 0, fontSize: "15px", color: "#111827", lineHeight: item.isLong ? "1.6" : "1.3" }}>{item.value}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
