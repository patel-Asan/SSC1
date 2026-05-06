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

            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: isMobile ? "1.5rem" : "2rem", fontWeight: "700", color: "#1f2937", margin: "0 0 8px 0" }}>
                    Messages
                </h1>
                <p style={{ color: "#6b7280", margin: 0, fontSize: isMobile ? "13px" : "14px" }}>
                    Manage customer inquiries and feedback
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                <div style={{ background: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Mail size={20} color="white" />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Total</p>
                            <p style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#1f2937" }}>{stats.total}</p>
                        </div>
                    </div>
                </div>
                <div style={{ background: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Clock size={20} color="white" />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Unread</p>
                            <p style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#ef4444" }}>{stats.unread}</p>
                        </div>
                    </div>
                </div>
                <div style={{ background: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <CheckCircle size={20} color="white" />
                        </div>
                        <div>
                            <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>Read</p>
                            <p style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#10b981" }}>{stats.read}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ background: "white", padding: "20px", borderRadius: "16px", marginBottom: "24px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", flexDirection: isMobile ? "column" : "row" }}>
                    <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
                        <Search size={20} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                        <input
                            type="text"
                            placeholder="Search by name, email or message..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "14px 14px 14px 48px", borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "15px", outline: "none" }}
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        style={{ padding: "14px 20px", borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "15px", outline: "none", cursor: "pointer", background: "white" }}
                    >
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
                            background: msg.status === 'unread' ? "linear-gradient(135deg, #fff 0%, #fef3c7 100%)" : "white",
                            padding: "24px",
                            borderRadius: "16px",
                            boxShadow: msg.status === 'unread' ? "0 4px 15px rgba(251,191,36,0.2)" : "0 4px 6px rgba(0,0,0,0.05)",
                            borderLeft: msg.status === 'unread' ? "4px solid #f59e0b" : "4px solid transparent",
                            animation: "fadeIn 0.5s ease-out"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
                                <div style={{ flex: 1, minWidth: isMobile ? "100%" : "250px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                        <div style={{ width: isMobile ? "36px" : "44px", height: isMobile ? "36px" : "44px", borderRadius: "12px", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: isMobile ? "14px" : "18px" }}>
                                            {msg.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 style={{ margin: 0, color: "#1f2937", fontSize: isMobile ? "14px" : "16px", fontWeight: "600" }}>
                                                {msg.name}
                                                {msg.status === 'unread' && (
                                                    <span style={{ marginLeft: "8px", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: "600", background: "#f59e0b", color: "white" }}>NEW</span>
                                                )}
                                            </h3>
                                            <p style={{ margin: 0, color: "#6b7280", fontSize: isMobile ? "12px" : "14px" }}>{msg.email}</p>
                                        </div>
                                    </div>
                                    <p style={{ margin: "0 0 8px 0", color: "#374151", fontSize: isMobile ? "13px" : "14px", lineHeight: "1.6", maxHeight: "60px", overflow: "hidden" }}>
                                        {msg.message}
                                    </p>
                                    <p style={{ margin: 0, color: "#9ca3af", fontSize: "12px" }}>
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div style={{ display: "flex", gap: "8px", width: isMobile ? "100%" : "auto", justifyContent: isMobile ? "flex-end" : "flex-start" }}>
                                    <button onClick={() => handleViewMessage(msg)} style={{ padding: isMobile ? "8px 12px" : "10px 16px", borderRadius: "10px", border: "1px solid #e5e7eb", background: "white", color: "#374151", cursor: "pointer", fontSize: isMobile ? "13px" : "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                                        <Eye size={16} /> View
                                    </button>
                                    <button onClick={() => handleDelete(msg._id)} style={{ padding: isMobile ? "8px 12px" : "10px 16px", borderRadius: "10px", border: "none", background: "#fee2e2", color: "#dc2626", cursor: "pointer", fontSize: isMobile ? "13px" : "14px", display: "flex", alignItems: "center", gap: "6px" }}>
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && selectedMessage && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, animation: "fadeIn 0.3s ease-out" }} onClick={() => setShowModal(false)}>
                    <div style={{ background: "white", borderRadius: "20px", padding: "32px", maxWidth: "600px", width: "90%", maxHeight: "90vh", overflow: "auto", animation: "slideIn 0.3s ease-out" }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#1f2937" }}>Message Details</h2>
                            <button onClick={() => setShowModal(false)} style={{ width: "40px", height: "40px", borderRadius: "10px", border: "none", background: "#f3f4f6", cursor: "pointer" }}>X</button>
                        </div>
                        <div style={{ display: "grid", gap: "16px" }}>
                            <div style={{ padding: "16px", background: "#f9fafb", borderRadius: "12px" }}>
                                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>FROM</p>
                                <p style={{ margin: 0, fontSize: "16px", color: "#1f2937", fontWeight: "500" }}>{selectedMessage.name}</p>
                            </div>
                            <div style={{ padding: "16px", background: "#f9fafb", borderRadius: "12px" }}>
                                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>EMAIL</p>
                                <a href={`mailto:${selectedMessage.email}`} style={{ margin: 0, fontSize: "16px", color: "#6366f1", fontWeight: "500" }}>{selectedMessage.email}</a>
                            </div>
                            <div style={{ padding: "16px", background: "#f9fafb", borderRadius: "12px" }}>
                                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>MESSAGE</p>
                                <p style={{ margin: 0, fontSize: "15px", color: "#374151", lineHeight: "1.7" }}>{selectedMessage.message}</p>
                            </div>
                            <div style={{ padding: "16px", background: "#f9fafb", borderRadius: "12px" }}>
                                <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>RECEIVED</p>
                                <p style={{ margin: 0, fontSize: "14px", color: "#374151" }}>{new Date(selectedMessage.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Messages;
