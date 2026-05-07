import React, { useState, useEffect } from "react";
import { Bell, User, LogOut, Package, CheckCircle, XCircle, UserPlus, Trash2, Check, Menu, Shield } from "lucide-react";
import { toast } from "react-toastify";

const Navbar = ({ setToken, setSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const isMobile = window.innerWidth <= 768;

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/notification/list`, {
        headers: { 'token': localStorage.getItem('token') }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/api/notification/read/${id}`, {
        method: 'PUT',
        headers: { 'token': localStorage.getItem('token') }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/notification/read-all`, {
        method: 'PUT',
        headers: { 'token': localStorage.getItem('token') }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success("All notifications marked as read");
      }
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/api/notification/delete/${id}`, {
        method: 'DELETE',
        headers: { 'token': localStorage.getItem('token') }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(prev => prev.filter(n => n._id !== id));
        const deletedNotif = notifications.find(n => n._id === id);
        if (deletedNotif && !deletedNotif.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const getNotificationIcon = (type) => {
    const iconStyle = { size: 16 };
    switch (type) {
      case 'order': return <Package {...iconStyle} color="#8b5cf6" />;
      case 'user': return <UserPlus {...iconStyle} color="#3b82f6" />;
      case 'cancel': return <XCircle {...iconStyle} color="#ef4444" />;
      case 'delivery': return <CheckCircle {...iconStyle} color="#10b981" />;
      default: return <Bell {...iconStyle} color="#6b7280" />;
    }
  };

  const getNotificationBg = (type) => {
    switch (type) {
      case 'order': return "linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(167,139,250,0.08) 100%)";
      case 'user': return "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(96,165,250,0.08) 100%)";
      case 'cancel': return "linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(248,113,113,0.08) 100%)";
      case 'delivery': return "linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(52,211,153,0.08) 100%)";
      default: return "linear-gradient(135deg, rgba(107,114,128,0.08) 0%, rgba(156,163,175,0.08) 100%)";
    }
  };

  const getRelativeTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = (now - notifDate) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return notifDate.toLocaleDateString();
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showNotifications && !e.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: isMobile ? "12px 16px" : "14px 28px",
      background: "#fff",
      borderBottom: "1px solid #e5e7eb",
      gap: "12px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      {/* Left */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "none",
              border: "none",
              borderRadius: "8px",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#374151",
              flexShrink: 0,
            }}
          >
            <Menu size={20} />
          </button>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #8b5cf6 0%, #ff6f61 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <Shield size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: isMobile ? "13px" : "14px", fontWeight: "600", color: "#111827" }}>
              Welcome back, Admin
            </div>
            <div style={{ fontSize: "11px", color: "#9ca3af" }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "12px" }}>
        {/* Notifications */}
        <div className="notification-container" style={{ position: "relative" }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: "relative",
              padding: "8px",
              background: showNotifications ? "#f3f4f6" : "transparent",
              borderRadius: "10px",
              cursor: "pointer",
              border: "none",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              if (!showNotifications) e.currentTarget.style.background = "#f3f4f6";
            }}
            onMouseLeave={(e) => {
              if (!showNotifications) e.currentTarget.style.background = "transparent";
            }}
          >
            <Bell size={20} color="#374151" />
            {unreadCount > 0 && (
              <div style={{
                position: "absolute",
                top: "3px",
                right: "3px",
                minWidth: "16px",
                height: "16px",
                backgroundColor: "#ef4444",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: "700",
                color: "#fff",
                padding: "0 3px",
                boxShadow: "0 2px 4px rgba(239,68,68,0.3)",
              }}>
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </button>

          {showNotifications && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: isMobile ? "-40px" : "0",
              width: isMobile ? "320px" : "380px",
              maxHeight: "480px",
              background: "#fff",
              borderRadius: "16px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
              zIndex: 1000,
              overflow: "hidden",
              border: "1px solid #e5e7eb",
            }}>
              {/* Header */}
              <div style={{
                padding: "16px 20px",
                borderBottom: "1px solid #f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                    <Bell size={16} color="white" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700", color: "#111827" }}>
                      Notifications
                    </h3>
                    <p style={{ margin: "1px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
                      {unreadCount} unread
                    </p>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      padding: "6px 10px",
                      background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Check size={12} /> Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div style={{ maxHeight: "360px", overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: "40px 20px", textAlign: "center" }}>
                    <div style={{
                      width: "56px", height: "56px", borderRadius: "50%",
                      background: "#f3f4f6", display: "flex", alignItems: "center",
                      justifyContent: "center", margin: "0 auto 12px"
                    }}>
                      <Bell size={22} color="#9ca3af" />
                    </div>
                    <p style={{ margin: 0, fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>
                      No notifications yet
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                      New orders and registrations appear here
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => !notification.isRead && markAsRead(notification._id)}
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid #f3f4f6",
                        background: notification.isRead ? "#fff" : getNotificationBg(notification.type),
                        cursor: notification.isRead ? "default" : "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                      }}
                      onMouseEnter={(e) => {
                        if (!notification.isRead) {
                          e.currentTarget.style.background = getNotificationBg(notification.type).replace('0.08)', '0.12)');
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!notification.isRead) {
                          e.currentTarget.style.background = getNotificationBg(notification.type);
                        }
                      }}
                    >
                      <div style={{
                        width: "34px", height: "34px", borderRadius: "10px",
                        background: notification.isRead ? "#f3f4f6" : "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, boxShadow: notification.isRead ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
                      }}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                          <p style={{
                            margin: 0, fontSize: "13px",
                            fontWeight: notification.isRead ? "500" : "700",
                            color: notification.isRead ? "#6b7280" : "#111827",
                            flex: 1,
                          }}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#ff6f61", flexShrink: 0 }} />
                          )}
                        </div>
                        <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280", lineHeight: 1.35 }}>
                          {notification.message}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                            {getRelativeTime(notification.createdAt)}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteNotification(notification._id); }}
                            style={{
                              padding: "3px", background: "transparent", border: "none",
                              cursor: "pointer", borderRadius: "4px", opacity: 0.4,
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = "1";
                              e.currentTarget.style.background = "#fee2e2";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = "0.4";
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <Trash2 size={13} color="#ef4444" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {notifications.length > 0 && (
                <div style={{
                  padding: "10px 16px", borderTop: "1px solid #f3f4f6",
                  background: "#f9fafb", textAlign: "center",
                }}>
                  <p style={{ margin: 0, fontSize: "11px", color: "#9ca3af" }}>
                    Showing last {notifications.length} notifications
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => setToken('')}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: isMobile ? "8px" : "8px 14px",
            background: "linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)",
            borderRadius: "10px",
            cursor: "pointer",
            border: "none",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(239,68,68,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <div style={{
            width: "28px", height: "28px", borderRadius: "7px",
            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <LogOut size={14} color="white" />
          </div>
          {!isMobile && <span style={{ fontSize: "13px", fontWeight: "600", color: "#991b1b" }}>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
