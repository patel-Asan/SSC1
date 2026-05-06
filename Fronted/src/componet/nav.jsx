import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { useContext } from "react";
import { Shopcontext } from "../context/shopcontext";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const Nav = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [activeLinkPos, setActiveLinkPos] = useState(0);
  const location = useLocation();

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Collection", path: "/collection" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" }
  ];

  const { setShowSearch, showSearch, getCartCount, getWishlistCount, navigate, token, setToken, setCartIItems } = useContext(Shopcontext);

  const Logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartIItems({});
    toast.success("Logged out successfully!");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    const activeIndex = navLinks.findIndex(link => link.path === location.pathname);
    setActiveLinkPos(activeIndex >= 0 ? activeIndex : -1);
  }, [location.pathname, navLinks]);

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  const menuItems = [
    { label: "My Profile", icon: "", action: () => navigate("/profile") },
    { label: "Orders", icon: "", action: () => navigate("/order") },
    { label: "Logout", icon: "", action: Logout }
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, duration: 0.6 }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: isMobile 
          ? (scrolled ? "10px 16px" : "12px 16px")
          : (scrolled ? "14px 32px" : "16px 48px"),
        fontWeight: "500",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: scrolled 
          ? "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 250, 250, 0.9) 100%)"
          : "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        zIndex: 9999,
        boxShadow: scrolled 
          ? "0 8px 32px rgba(255, 111, 97, 0.12), 0 2px 8px rgba(0,0,0,0.04)"
          : "0 4px 20px rgba(0,0,0,0.03)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        borderBottom: scrolled 
          ? "1px solid rgba(255, 111, 97, 0.15)" 
          : "1px solid rgba(255, 255, 255, 0)",
      }}
    >
      {/* Logo with Glow Effect */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{ cursor: "pointer", display: "flex", alignItems: "center", position: "relative" }}
        onClick={() => navigate("/")}
      >
        {/* Glow Effect */}
        <motion.div
          animate={{ 
            boxShadow: [
              "0 0 20px rgba(255, 111, 97, 0.2)",
              "0 0 30px rgba(255, 111, 97, 0.4)",
              "0 0 20px rgba(255, 111, 97, 0.2)"
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            left: "0",
            top: "50%",
            transform: "translateY(-50%)",
            width: isMobile ? (scrolled ? "36px" : "40px") : (scrolled ? "42px" : "50px"),
            height: isMobile ? (scrolled ? "36px" : "40px") : (scrolled ? "42px" : "50px"),
            borderRadius: "50%",
            zIndex: -1,
          }}
        />
        <motion.img 
          src={assets.logo} 
          alt="Logo" 
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.5, repeat: 0 }}
          whileHover={{ rotate: 360, scale: 1.1 }}
          style={{ 
            width: isMobile ? (scrolled ? "36px" : "40px") : (scrolled ? "42px" : "50px"),
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            filter: "drop-shadow(0 2px 8px rgba(255, 111, 97, 0.3))",
          }} 
        />
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ 
            background: "linear-gradient(135deg, #ff6f61 0%, #ff9f91 50%, #ff6f61 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            backgroundSize: "200% 200%",
          }}
          style={{
            marginLeft: "12px",
            fontSize: isMobile ? (scrolled ? "18px" : "20px") : (scrolled ? "20px" : "24px"),
            fontWeight: "800",
            background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            letterSpacing: "-1px",
            textShadow: "0 2px 10px rgba(255, 111, 97, 0.2)",
          }}
        >
          SSC
        </motion.span>
      </motion.div>

      {/* Nav Links - Desktop with Floating Pill */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 111, 97, 0.05)",
            padding: "6px",
            borderRadius: "20px",
            border: "1px solid rgba(255, 111, 97, 0.1)",
            position: "relative",
            boxShadow: "0 4px 20px rgba(255, 111, 97, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)",
          }}
        >
          {/* Animated Background Pill */}
          {activeLinkPos >= 0 && (
          <motion.div
            animate={{ 
              x: activeLinkPos === 0 ? 6 : 
                 activeLinkPos === 1 ? 86 : 
                 activeLinkPos === 2 ? 166 : 
                 activeLinkPos === 3 ? 246 : 6 
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            style={{
              position: "absolute",
              left: "0px",
              top: "6px",
              width: "72px",
              height: "calc(100% - 12px)",
              background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
              borderRadius: "14px",
              boxShadow: "0 4px 15px rgba(255, 111, 97, 0.4)",
              zIndex: 0,
            }}
          />
          )}
          {navLinks.map((link, index) => (
            <motion.div
              key={link.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredLink(index)}
              onHoverEnd={() => setHoveredLink(null)}
              style={{ 
                position: "relative", 
                zIndex: 1,
                minWidth: "72px",
                textAlign: "center",
              }}
            >
              <Link
                to={link.path}
                style={{
                  textDecoration: "none",
                  color: location.pathname === link.path ? "#fff" : (hoveredLink === index ? "#ff6f61" : "#4B5563"),
                  padding: "10px 0",
                  borderRadius: "14px",
                  fontSize: "14px",
                  fontWeight: "600",
                  display: "block",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  textShadow: location.pathname === link.path ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {link.label}
                {/* Animated Underline on Hover */}
                {hoveredLink === index && location.pathname !== link.path && (
                  <motion.span
                    layoutId="navUnderline"
                    style={{
                      position: "absolute",
                      bottom: "4px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "20px",
                      height: "2px",
                      backgroundColor: "#ff6f61",
                      borderRadius: "2px",
                    }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Right section: icons */}
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "6px" : "10px" }}>
        {/* Search Icon */}
        <motion.div
          whileHover={{ scale: 1.15, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          style={{
            padding: isMobile ? "10px" : "12px",
            borderRadius: "14px",
            background: location.pathname === '/collection' && showSearch 
              ? "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)" 
              : "linear-gradient(135deg, rgba(255, 111, 97, 0.1) 0%, rgba(255, 111, 97, 0.05) 100%)",
            cursor: "pointer",
            border: location.pathname === '/collection' && showSearch
              ? "1px solid #ff6f61"
              : "1px solid rgba(255, 111, 97, 0.1)",
            boxShadow: location.pathname === '/collection' && showSearch
              ? "0 4px 15px rgba(255, 111, 97, 0.4)"
              : "0 2px 8px rgba(255, 111, 97, 0.08)",
            transition: "all 0.3s ease",
          }}
          onClick={() => {
            navigate('/collection');
            setTimeout(() => setShowSearch(true), 100);
          }}
        >
          <motion.img 
            src={assets.search_icon}
            alt="Search"
            whileHover={{ scale: 1.1 }}
            style={{ 
              width: isMobile ? "18px" : "20px", 
              display: "block",
              filter: location.pathname === '/collection' && showSearch 
                ? "brightness(0) invert(1)" 
                : "none",
            }}
          />
        </motion.div>

        {/* Wishlist Icon with count */}
        <Link to="/wishlist" style={{ textDecoration: "none" }}>
          <motion.div
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: "relative",
              cursor: "pointer",
              padding: isMobile ? "10px" : "12px",
              borderRadius: "14px",
              background: location.pathname === '/wishlist'
                ? "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)"
                : "linear-gradient(135deg, rgba(255, 111, 97, 0.1) 0%, rgba(255, 111, 97, 0.05) 100%)",
              border: location.pathname === '/wishlist'
                ? "1px solid #ff6f61"
                : "1px solid rgba(255, 111, 97, 0.1)",
              boxShadow: location.pathname === '/wishlist'
                ? "0 4px 15px rgba(255, 111, 97, 0.4)"
                : "0 2px 8px rgba(255, 111, 97, 0.08)",
              transition: "all 0.3s ease",
            }}
          >
            <motion.svg
              width={isMobile ? "18" : "20"}
              height={isMobile ? "18" : "20"}
              viewBox="0 0 24 24"
              fill={location.pathname === '/wishlist' ? "#fff" : "none"}
              stroke={location.pathname === '/wishlist' ? "#fff" : "#4B5563"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              whileHover={{ fill: location.pathname === '/wishlist' ? "#fff" : "rgba(255, 111, 97, 0.2)", stroke: "#ff6f61" }}
              transition={{ duration: 0.2 }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </motion.svg>
            <AnimatePresence>
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0, y: -10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    backgroundColor: "#ff6f61",
                    color: "#fff",
                    borderRadius: "999px",
                    fontSize: "10px",
                    padding: "2px 6px",
                    fontWeight: "bold",
                    minWidth: "18px",
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(255, 111, 97, 0.4)",
                    border: "2px solid #fff",
                  }}
                >
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>

        {/* Cart Icon with count */}
        <Link to="/cart" style={{ textDecoration: "none" }}>
          <motion.div
            whileHover={{ scale: 1.15, rotate: -3 }}
            whileTap={{ scale: 0.9 }}
            style={{ 
              position: "relative", 
              cursor: "pointer",
              padding: isMobile ? "10px" : "12px",
              borderRadius: "14px",
              background: location.pathname === '/cart'
                ? "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)"
                : "linear-gradient(135deg, rgba(255, 111, 97, 0.1) 0%, rgba(255, 111, 97, 0.05) 100%)",
              border: location.pathname === '/cart'
                ? "1px solid #ff6f61"
                : "1px solid rgba(255, 111, 97, 0.1)",
              boxShadow: location.pathname === '/cart'
                ? "0 4px 15px rgba(255, 111, 97, 0.4)"
                : "0 2px 8px rgba(255, 111, 97, 0.08)",
              transition: "all 0.3s ease",
            }}
          >
            <motion.img 
              src={assets.cart_icon} 
              alt="Cart" 
              whileHover={{ scale: 1.1 }}
              style={{ 
                width: isMobile ? "18px" : "20px", 
                display: "block",
                filter: location.pathname === '/cart' ? "brightness(0) invert(1)" : "none",
              }} 
            />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0, y: -10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  style={{
                    position: "absolute",
                    top: "2px",
                    right: "2px",
                    backgroundColor: "#ff6f61",
                    color: "#fff",
                    borderRadius: "999px",
                    fontSize: "10px",
                    padding: "2px 6px",
                    fontWeight: "bold",
                    minWidth: "18px",
                    textAlign: "center",
                    boxShadow: "0 2px 8px rgba(255, 111, 97, 0.4)",
                    border: "2px solid #fff",
                  }}
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>

        {/* Profile Dropdown - Only show when logged in */}
        {token && (
        <motion.div
          style={{ position: "relative", display: "inline-block" }}
          onMouseEnter={() => setDropdownOpen(true)}
          onMouseLeave={() => setDropdownOpen(false)}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              padding: isMobile ? "10px" : "12px",
              borderRadius: "14px",
              background: location.pathname === '/profile'
                ? "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)"
                : "linear-gradient(135deg, rgba(255, 111, 97, 0.1) 0%, rgba(255, 111, 97, 0.05) 100%)",
              border: location.pathname === '/profile'
                ? "1px solid #ff6f61"
                : "1px solid rgba(255, 111, 97, 0.1)",
              boxShadow: location.pathname === '/profile'
                ? "0 4px 15px rgba(255, 111, 97, 0.4)"
                : "0 2px 8px rgba(255, 111, 97, 0.08)",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
          >
            <img 
              src={assets.profile_icon}
              alt="Profile"
              style={{ 
                width: isMobile ? "18px" : "20px", 
                display: "block",
                filter: location.pathname === '/profile' ? "brightness(0) invert(1)" : "none",
              }}
            />
          </motion.div>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                style={{
                  position: "absolute",
                  right: 0,
                  paddingTop: "12px",
                  zIndex: 10000,
                }}
              >
                <motion.div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    width: "200px",
                    padding: "8px",
                    backgroundColor: "rgba(255, 255, 255, 0.98)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "16px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                    border: "1px solid rgba(255, 111, 97, 0.1)",
                  }}
                >
                  <div style={{
                    padding: "12px 16px",
                    borderBottom: "1px solid rgba(0,0,0,0.05)",
                    marginBottom: "4px",
                  }}>
                    <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>Account</p>
                  </div>
                  {menuItems.map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 4 }}
                    >
                      <p
                        style={{
                          cursor: "pointer",
                          padding: "12px 16px",
                          borderRadius: "10px",
                          fontSize: "14px",
                          fontWeight: "500",
                          color: item.label === "Logout" ? "#ef4444" : "#374151",
                          transition: "all 0.2s ease",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          margin: 0,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = item.label === "Logout" ? "#fef2f2" : "rgba(255, 111, 97, 0.08)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}
                        onClick={item.action}
                      >
                        <span style={{ fontSize: "16px" }}>{item.icon}</span>
                        {item.label}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        )} 

        {/* Hamburger Toggle - Mobile Only */}
        {isMobile && (
          <motion.div
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ 
              cursor: "pointer", 
              padding: "8px",
              borderRadius: "10px",
              backgroundColor: menuOpen ? "rgba(255, 111, 97, 0.1)" : "transparent",
              marginLeft: "2px",
            }}
            whileTap={{ scale: 0.9 }}
          >
            <div style={{ width: "22px", height: "18px", position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <motion.div
                animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ width: "100%", height: "2px", backgroundColor: menuOpen ? "#ff6f61" : "#333", transformOrigin: "center" }}
              />
              <motion.div
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{ width: "100%", height: "2px", backgroundColor: "#333" }}
              />
              <motion.div
                animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ width: "100%", height: "2px", backgroundColor: menuOpen ? "#ff6f61" : "#333", transformOrigin: "center" }}
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "rgba(255, 255, 255, 0.98)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
              overflow: "hidden",
              zIndex: 9998,
              borderTop: "1px solid rgba(255, 111, 97, 0.1)",
            }}
          >
            <motion.div
              style={{
                padding: "20px",
              }}
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  style={{ marginBottom: "8px" }}
                >
                  <Link
                    to={link.path}
                    style={{
                      textDecoration: "none",
                      color: location.pathname === link.path ? "#fff" : "#374151",
                      fontWeight: "600",
                      fontSize: "16px",
                      display: "block",
                      padding: "14px 20px",
                      borderRadius: "12px",
                      backgroundColor: location.pathname === link.path ? "#ff6f61" : "transparent",
                      boxShadow: location.pathname === link.path ? "0 4px 12px rgba(255, 111, 97, 0.3)" : "none",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Nav;