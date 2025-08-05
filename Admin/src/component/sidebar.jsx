import React from "react";
import { NavLink } from "react-router-dom";
import {
  PlusCircle,
  ListOrdered,
  ShoppingCart,
  BarChart3,
  Users,
} from "lucide-react";

const Side = () => {
  const navItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderRadius: "8px",
    color: "white",
    textDecoration: "none",
    fontWeight: 500,
    fontSize: "16px",
    transition: "background 0.3s ease, transform 0.2s ease",
  };

  const activeStyle = {
    backgroundColor: "aqua",
    transform: "translateX(4px)",
    boxShadow: "2px 2px 6px rgba(0,0,0,0.3)",
  };

  const containerStyle = {
    width: "130px",
    height: "100vh",
    backgroundColor: "#1e1e2f",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    boxShadow: "2px 0 10px rgba(0, 0, 0, 0.2)",
  };

  const logoStyle = {
    fontSize: "20px",
    color: "#fff",
    marginBottom: "30px",
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: "1px",
  };

  return (
    <div style={containerStyle}>
      <div style={logoStyle}>🍴 Admin Panel</div>

      <NavLink
        to="/dashboard"
        style={({ isActive }) =>
          isActive
            ? { ...navItemStyle, ...activeStyle }
            : { ...navItemStyle }
        }
      >
        <BarChart3 size={20} />
        Dashboard
      </NavLink>

      <NavLink
        to="/add"
        style={({ isActive }) =>
          isActive
            ? { ...navItemStyle, ...activeStyle }
            : { ...navItemStyle }
        }
      >
        <PlusCircle size={20} />
        Add Item
      </NavLink>

      <NavLink
        to="/list"
        style={({ isActive }) =>
          isActive
            ? { ...navItemStyle, ...activeStyle }
            : { ...navItemStyle }
        }
      >
        <ListOrdered size={20} />
        List Items
      </NavLink>

      <NavLink
        to="/order"
        style={({ isActive }) =>
          isActive
            ? { ...navItemStyle, ...activeStyle }
            : { ...navItemStyle }
        }
      >
        <ShoppingCart size={20} />
        Orders
      </NavLink>

      <NavLink
        to="/users"
        style={({ isActive }) =>
          isActive
            ? { ...navItemStyle, ...activeStyle }
            : { ...navItemStyle }
        }
      >
        <Users size={20} />
        Users
      </NavLink>
    </div>
  );
};

export default Side;
