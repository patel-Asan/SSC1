import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  PlusCircle,
  ListOrdered,
  ShoppingCart,
  LayoutDashboard,
  Package,
  TrendingUp,
  MessageSquare,
  BarChart3,
  X,
  Menu,
  Tag,
  Warehouse,
  Star,
  TicketPercent,
  UserCheck,
  Mail,
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

  const containerStyle = {
    width: isMobile ? (sidebarOpen ? "260px" : "0px") : "240px",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #1e1e2f 0%, #16162a 100%)",
    padding: isMobile ? (sidebarOpen ? "24px 16px" : "0") : "24px 16px",
    display: "flex",
    flexDirection: "column",
    boxShadow: isMobile && sidebarOpen ? "4px 0 30px rgba(0, 0, 0, 0.5)" : "4px 0 20px rgba(0, 0, 0, 0.3)",
    position: isMobile ? "fixed" : "sticky",
    top: 0,
    left: 0,
    zIndex: isMobile ? 10000 : 100,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
    opacity: isMobile && !sidebarOpen ? 0 : 1,
  };

  const logoContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "0 8px 24px 8px",
    marginBottom: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  };

  const logoIconStyle = {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    flexShrink: 0,
  };

  const logoTextStyle = {
    fontSize: "20px",
    color: "#fff",
    fontWeight: "700",
    letterSpacing: "0.5px",
  };

  const logoSubtextStyle = {
    fontSize: "12px",
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
  };

  const menuLabelStyle = {
    fontSize: "11px",
    color: "rgba(255,255,255,0.4)",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    fontWeight: "600",
    padding: "0 12px",
    marginBottom: "12px",
    marginTop: "8px",
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
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 9999,
          }}
        />
      )}
      <div style={containerStyle}>
        <div style={logoContainerStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={logoIconStyle}>👑</div>
            <div>
              <div style={logoTextStyle}>SSC Admin</div>
              <div style={logoSubtextStyle}>Management</div>
            </div>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
              }}
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div style={menuLabelStyle}>Main Menu</div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto" }}>
          {navItems.map((item) => {
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
                  gap: "14px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  fontWeight: isActive ? "600" : "500",
                  fontSize: "15px",
                  background: isActive
                    ? "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)"
                    : isHovered
                    ? "rgba(255,111,97,0.15)"
                    : "transparent",
                  transform: isActive ? "translateX(6px)" : isHovered ? "translateX(3px)" : "translateX(0)",
                  boxShadow: isActive ? "0 4px 15px rgba(255,111,97,0.3)" : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "3px",
                      height: "24px",
                      backgroundColor: "#fff",
                      borderRadius: "0 3px 3px 0",
                    }}
                  />
                )}

                <item.icon
                  size={20}
                  style={{
                    color: isActive ? "#fff" : isHovered ? "#ff6f61" : "rgba(255,255,255,0.7)",
                    transition: "color 0.3s ease",
                    flexShrink: 0,
                  }}
                />
                <span>{item.label}</span>

                {isActive && (
                  <span style={{ marginLeft: "auto", fontSize: "12px" }}>›</span>
                )}
              </NavLink>
            );
          })}
        </div>

        <div style={menuLabelStyle}>Management</div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", overflowY: "auto" }}>
          {managementItems.map((item) => {
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
                  gap: "14px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  fontWeight: isActive ? "600" : "500",
                  fontSize: "15px",
                  background: isActive
                    ? "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)"
                    : isHovered
                    ? "rgba(255,111,97,0.15)"
                    : "transparent",
                  transform: isActive ? "translateX(6px)" : isHovered ? "translateX(3px)" : "translateX(0)",
                  boxShadow: isActive ? "0 4px 15px rgba(255,111,97,0.3)" : "none",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "3px",
                      height: "24px",
                      backgroundColor: "#fff",
                      borderRadius: "0 3px 3px 0",
                    }}
                  />
                )}

                <item.icon
                  size={20}
                  style={{
                    color: isActive ? "#fff" : isHovered ? "#ff6f61" : "rgba(255,255,255,0.7)",
                    transition: "color 0.3s ease",
                    flexShrink: 0,
                  }}
                />
                <span>{item.label}</span>

                {isActive && (
                  <span style={{ marginLeft: "auto", fontSize: "12px" }}>›</span>
                )}
              </NavLink>
            );
          })}
        </div>

        <div style={{ marginTop: "auto", paddingTop: "24px" }}>
          <div
            style={{
              background: "rgba(255,111,97,0.1)",
              borderRadius: "12px",
              padding: "16px",
              border: "1px solid rgba(255,111,97,0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
              <TrendingUp size={16} color="#ff6f61" />
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", fontWeight: "500" }}>
                Quick Stats
              </span>
            </div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#fff" }}>
              Admin
            </div>
            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginTop: "2px" }}>
              Full Access
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Side;
