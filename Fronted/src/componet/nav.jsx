import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { Shopcontext } from "../context/shopcontext";
 import { Link } from "react-router-dom";


const Nav = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);// Change this based on real cart logic
 const{setShowSearch, getCartCount , navigate, token, setToken,setCartIItems}=useContext(Shopcontext);

const Logout =() =>{
   navigate('/login')
  localStorage.removeItem('token')
  setToken('')
  setCartIItems({})
 
}

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = ["Home", "Collection", "About", "Contact"];
  const cartCount=getCartCount();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 20px",
        fontWeight: "500",
        position: "relative",
        backgroundColor: "#fff",
        zIndex: 999,
        boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
      }}
    >
      {/* Logo */}
      <img src={assets.logo} alt="Logo" style={{ width: "50px" }} />

      {/* Nav Links */}
      {!isMobile && (
        <ul
          style={{
            display: "flex",
            gap: "20px",
            fontSize: "14px",
            color: "#4B5563",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {navLinks.map((label) => {
            const path = label === "Home" ? "/" : `/${label.toLowerCase()}`;
            return (
              <li
                key={label}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <a
                  href={path}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingBottom: "4px",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    const underline = e.currentTarget.querySelector(".underline");
                    underline.style.transform = "scaleX(1)";
                  }}
                  onMouseLeave={(e) => {
                    const underline = e.currentTarget.querySelector(".underline");
                    underline.style.transform = "scaleX(0)";
                  }}
                >
                  {label}
                  <span
                    className="underline"
                    style={{
                      position: "absolute",
                      bottom: "0",
                      height: "2px",
                      width: "50%",
                      backgroundColor: "#1F2937",
                      transform: "scaleX(0)",
                      transformOrigin: "center",
                      transition: "transform 0.3s ease-in-out",
                    }}
                  ></span>
                </a>
              </li>
            );
          })}
        </ul>
      )}

      {/* Right section: icons + hamburger */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        {/* Search Icon */}
        <img onClick={()=>setShowSearch(true)}
          src={assets.search_icon}
          
          style={{ width: "20px", cursor: "pointer" }}
        />

        {/* Cart Icon with count */}
      



<Link to="/cart" style={{ textDecoration: "none" }}>
  <div style={{ position: "relative", cursor: "pointer", display: "inline-block" }}>
    <img src={assets.cart_icon} alt="Cart" style={{ width: "20px" }} />
    {cartCount > 0 && (
      <span
        style={{
          position: "absolute",
          top: "-6px",
          right: "-6px",
          backgroundColor: "#ef4444",
          color: "#fff",
          borderRadius: "999px",
          fontSize: "10px",
          padding: "2px 6px",
          fontWeight: "bold",
        }}
      >
        {cartCount}
      </span>
    )}
  </div>
</Link>
        {/* Profile Dropdown */}
        <div
          style={{ position: "relative", display: "inline-block" }}
          onMouseEnter={(e) => {
            const menu = e.currentTarget.querySelector(".dropdown-menu");
            if (menu) menu.style.display = "block";
          }}
          onMouseLeave={(e) => {
            const menu = e.currentTarget.querySelector(".dropdown-menu");
            if (menu) menu.style.display = "none";
          }}
        > 
          <img onClick={()=> token ? null : navigate('/login')}
            src={assets.profile_icon}
            alt="Profile"
            style={{ width: "20px", cursor: "pointer" }}
          />

          {token &&
          <div
            className="dropdown-menu"
            style={{
              position: "absolute",
              right: 0,
              paddingTop: "16px",
              display: "none",
            }} 
          > 
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                width: "144px",
                padding: "12px 20px",
                backgroundColor: "#f1f5f9",
                color: "#6b7280",
                borderRadius: "8px",
              }}
            >
              {["My Profile", "Order", "Logout"].map((item) => (
               <p
  key={item}
  style={{
    cursor: "pointer",
    transition: "color 0.2s ease",
  }}
  onMouseEnter={(e) => (e.target.style.color = "#000")}
  onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
  onClick={() => {
    if (item === "Logout") {
      Logout();
    } else if (item === "Order") {
      navigate("/order");
    } else if (item === "My Profile") {
      navigate("/profile");
    }
  }}
>
  {item}
</p>

                 
              ))}
            </div>
          </div> }
        </div>

        {/* Hamburger Toggle - Mobile Only */}
        {isMobile && (
          <div onClick={() => setMenuOpen(!menuOpen)} style={{ cursor: "pointer" }}>
            <div style={{ width: "24px", height: "2px", backgroundColor: "#333", marginBottom: "5px" }} />
            <div style={{ width: "24px", height: "2px", backgroundColor: "#333", marginBottom: "5px" }} />
            <div style={{ width: "24px", height: "2px", backgroundColor: "#333" }} />
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {menuOpen && isMobile && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            width: "100%",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
            listStyle: "none",
            padding: "10px 0",
            margin: 0,
          }}
        >
          {navLinks.map((label) => {
            const path = label === "Home" ? "/" : `/${label.toLowerCase()}`;
            return (
              <li key={label} style={{ padding: "10px 20px" }}>
                <a
                  href={path}
                  style={{
                    textDecoration: "none",
                    color: "#374151",
                    fontWeight: "500",
                  }}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default Nav;