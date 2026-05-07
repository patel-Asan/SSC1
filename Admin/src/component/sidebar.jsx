import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  PlusCircle,
  ShoppingCart,
  LayoutDashboard,
  Package,
  MessageSquare,
  BarChart3,
  X,
  Tag,
  Warehouse,
  Star,
  TicketPercent,
  UserCheck,
  Mail,
  Shield
} from "lucide-react";

const Side = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);
  const isMobile = window.innerWidth <= 768;

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/add", icon: PlusCircle, label: "Add Product" },
    { path: "/list", icon: Package, label: "Products" },
    { path: "/order", icon: ShoppingCart, label: "Orders" },
    { path: "/messages", icon: MessageSquare, label: "Messages" },
    { path: "/reports", icon: BarChart3, label: "Reports" },
  ];

  const managementItems = [
    { path: "/customers", icon: UserCheck, label: "Customers" },
    { path: "/categories", icon: Tag, label: "Categories" },
    { path: "/inventory", icon: Warehouse, label: "Inventory" },
    { path: "/reviews", icon: Star, label: "Reviews" },
    { path: "/coupons", icon: TicketPercent, label: "Coupons" },
    { path: "/newsletter", icon: Mail, label: "Newsletter" },
  ];

  const sidebarWidth = "260px";

  const containerStyle = {
    width: isMobile ? (sidebarOpen ? sidebarWidth : "0px") : sidebarWidth,
    height: isMobile ? "100vh" : "100vh",
    background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
    padding: isMobile ? (sidebarOpen ? "20px 14px" : "0") : "20px 14px",
    display: "flex",
    flexDirection: "column",
    boxShadow: isMobile && sidebarOpen
      ? "4px 0 40px rgba(0,0,0,0.6)"
      : "2px 0 20px rgba(0,0,0,0.08)",
    position: isMobile ? "fixed" : "sticky",
    top: 0,
    left: 0,
    alignSelf: "flex-start",
    zIndex: isMobile ? 10000 : 100,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
    opacity: isMobile && !sidebarOpen ? 0 : 1,
    flexShrink: 0,
  };

  const renderNavItem = (item) => {
    const isActive = location.pathname === item.path;
    const isHovered = hoveredItem === item.path;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        onClick={() => isMobile && setSidebarOpen(false)}
        onMouseEnter={() => setHoveredItem(item.path)}
        onMouseLeave={() => setHoveredItem(null)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "11px 14px",
          borderRadius: "10px",
          color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
          textDecoration: "none",
          fontWeight: isActive ? "600" : "400",
          fontSize: "14px",
          background: isActive
            ? "linear-gradient(135deg, rgba(139,92,246,0.3) 0%, rgba(255,111,97,0.2) 100%)"
            : isHovered
            ? "rgba(255,255,255,0.06)"
            : "transparent",
          borderLeft: isActive ? "3px solid #ff6f61" : "3px solid transparent",
          transition: "all 0.25s ease",
          whiteSpace: "nowrap",
        }}
      >
        <item.icon
          size={19}
          style={{
            color: isActive ? "#a78bfa" : isHovered ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)",
            transition: "color 0.25s ease",
            flexShrink: 0,
          }}
        />
        <span>{item.label}</span>
      </NavLink>
    );
  };

  return (
    <>
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            zIndex: 9999,
            backdropFilter: "blur(4px)",
          }}
        />
      )}
      <div style={containerStyle}>
        {/* Logo */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 4px 20px 4px",
          marginBottom: "16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #8b5cf6 0%, #ff6f61 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(139,92,246,0.3)",
            }}>
              <Shield size={22} color="white" />
            </div>
            <div>
              <div style={{ fontSize: "18px", color: "#fff", fontWeight: "700", letterSpacing: "0.3px", lineHeight: 1.2 }}>
                SSC Admin
              </div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: "500" }}>
                Management
              </div>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "none",
                borderRadius: "8px",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "rgba(255,255,255,0.6)",
                flexShrink: 0,
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <div style={{
          fontSize: "10px",
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
          letterSpacing: "1.2px",
          fontWeight: "600",
          padding: "0 14px",
          marginBottom: "10px",
        }}>
          Main Menu
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflowY: "auto", marginBottom: "20px" }}>
          {navItems.map(renderNavItem)}
        </div>

        <div style={{
          fontSize: "10px",
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
          letterSpacing: "1.2px",
          fontWeight: "600",
          padding: "0 14px",
          marginBottom: "10px",
        }}>
          Management
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflowY: "auto" }}>
          {managementItems.map(renderNavItem)}
        </div>
        
      </div>
    </>
  );
};

export default Side;
