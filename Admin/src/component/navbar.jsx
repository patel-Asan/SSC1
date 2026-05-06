import React, { useState, useEffect } from "react";
import { Bell, User, LogOut, Package, CheckCircle, XCircle, UserPlus, Truck, Trash2, Check, Menu } from "lucide-react";
import { toast } from "react-toastify";

const Navbar = ({ setToken, setSidebarOpen }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/notification/list`, {
        headers: {
          'token': localStorage.getItem('token')
        }
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

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/api/notification/read/${id}`, {
        method: 'PUT',
        headers: {
          'token': localStorage.getItem('token')
        }
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

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/notification/read-all`, {
        method: 'PUT',
        headers: {
          'token': localStorage.getItem('token')
        }
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

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      const response = await fetch(`${backendUrl}/api/notification/delete/${id}`, {
        method: 'DELETE',
        headers: {
          'token': localStorage.getItem('token')
        }
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

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    const iconStyle = { size: 18 };
    switch (type) {
      case 'order': return <Package {...iconStyle} color="#8b5cf6" />;
      case 'user': return <UserPlus {...iconStyle} color="#3b82f6" />;
      case 'cancel': return <XCircle {...iconStyle} color="#ef4444" />;
      case 'delivery': return <CheckCircle {...iconStyle} color="#10b981" />;
      default: return <Bell {...iconStyle} color="#6b7280" />;
    }
  };

  // Get notification background color
  const getNotificationBg = (type) => {
    switch (type) {
      case 'order': return "linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(167,139,250,0.1) 100%)";
      case 'user': return "linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(96,165,250,0.1) 100%)";
      case 'cancel': return "linear-gradient(135deg, rgba(239,68,68,0.1) 0%, rgba(248,113,113,0.1) 100%)";
      case 'delivery': return "linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(52,211,153,0.1) 100%)";
      default: return "linear-gradient(135deg, rgba(107,114,128,0.1) 0%, rgba(156,163,175,0.1) 100%)";
    }
  };

  // Format relative time
  const getRelativeTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = (now - notifDate) / 1000; // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return notifDate.toLocaleDateString();
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
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
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "12px 16px" : "16px 32px",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        color: "white",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        flexWrap: "wrap",
        gap: "12px",
      }}
    >
      {/* Left - Hamburger + Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {isMobile && (
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: "8px",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
              flexShrink: 0,
            }}
          >
            <Menu size={20} />
          </button>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: isMobile ? "6px 12px" : "8px 16px",
            backgroundColor: "rgba(255,255,255,0.05)",
            borderRadius: "10px",
          }}
        >
          <span style={{ fontSize: isMobile ? "12px" : "14px", color: "rgba(255,255,255,0.6)" }}>
            Welcome back,
          </span>
          <span style={{ fontSize: isMobile ? "12px" : "14px", fontWeight: "600", color: "#fff" }}>
            Admin
          </span>
        </div>
      </div>

      {/* Right - Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "10px" : "16px" }}>
        {/* Notification */}
        <div className="notification-container" style={{ position: "relative" }}>
          <div
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: "relative",
              padding: "10px",
              backgroundColor: showNotifications ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)",
              borderRadius: "10px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              if (!showNotifications) {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!showNotifications) {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              }
            }}
          >
            <Bell size={20} color="rgba(255,255,255,0.8)" />
            {/* Notification Badge */}
            {unreadCount > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  minWidth: "18px",
                  height: "18px",
                  backgroundColor: "#ff6f61",
                  borderRadius: "50%",
                  border: "2px solid #0f172a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "0 4px",
                }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </div>
            )}
          </div>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 12px)",
                right: isMobile ? "-60px" : "0",
                width: isMobile ? "300px" : "380px",
                maxHeight: "500px",
                background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
                borderRadius: "16px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
                zIndex: 1000,
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "8px",
                      background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Bell size={16} color="white" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1f2937" }}>
                      Notifications
                    </h3>
                    <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
                      {unreadCount} unread
                    </p>
                  </div>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      padding: "6px 12px",
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

              {/* Notifications List */}
              <div style={{ maxHeight: "380px", overflowY: "auto" }}>
                {notifications.length === 0 ? (
                  <div
                    style={{
                      padding: "40px 20px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 16px",
                      }}
                    >
                      <Bell size={24} color="#9ca3af" />
                    </div>
                    <p style={{ margin: 0, fontSize: "14px", color: "#6b7280", fontWeight: "500" }}>
                      No notifications yet
                    </p>
                    <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                      New orders and user registrations will appear here
                    </p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => !notification.isRead && markAsRead(notification._id)}
                      style={{
                        padding: "14px 20px",
                        borderBottom: "1px solid #f3f4f6",
                        background: notification.isRead ? "#ffffff" : getNotificationBg(notification.type),
                        cursor: notification.isRead ? "default" : "pointer",
                        transition: "all 0.2s ease",
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                      }}
                      onMouseEnter={(e) => {
                        if (!notification.isRead) {
                          e.currentTarget.style.background = getNotificationBg(notification.type).replace('0.1)', '0.15)');
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!notification.isRead) {
                          e.currentTarget.style.background = getNotificationBg(notification.type);
                        }
                      }}
                    >
                      {/* Icon */}
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "10px",
                          background: notification.isRead ? "#f3f4f6" : "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "13px",
                              fontWeight: notification.isRead ? "500" : "700",
                              color: notification.isRead ? "#6b7280" : "#1f2937",
                              flex: 1,
                            }}
                          >
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: "#ff6f61",
                                flexShrink: 0,
                              }}
                            />
                          )}
                        </div>
                        <p
                          style={{
                            margin: "0 0 4px 0",
                            fontSize: "12px",
                            color: "#6b7280",
                            lineHeight: 1.4,
                          }}
                        >
                          {notification.message}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                            {getRelativeTime(notification.createdAt)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification._id);
                            }}
                            style={{
                              padding: "4px",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              borderRadius: "4px",
                              opacity: 0.5,
                              transition: "all 0.2s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.opacity = "1";
                              e.currentTarget.style.background = "#fee2e2";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.opacity = "0.5";
                              e.currentTarget.style.background = "transparent";
                            }}
                          >
                            <Trash2 size={14} color="#ef4444" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div
                  style={{
                    padding: "12px 20px",
                    borderTop: "1px solid #f3f4f6",
                    background: "#f9fafb",
                    textAlign: "center",
                  }}
                >
                  <p style={{ margin: 0, fontSize: "12px", color: "#9ca3af" }}>
                    Showing last {notifications.length} notifications
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile / Logout */}
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setToken('')}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: isMobile ? "8px" : "8px 12px",
              background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
              borderRadius: "12px",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(255,111,97,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <User size={18} color="#fff" />
            </div>
            {!isMobile && <span style={{ fontSize: "14px", fontWeight: "600" }}>Logout</span>}
            {!isMobile && <LogOut size={16} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
