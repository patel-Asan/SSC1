import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const socialLinks = [
    { name: "Facebook", icon: "📘", url: "#" },
    { name: "Instagram", icon: "📸", url: "#" },
    { name: "Twitter", icon: "🐦", url: "#" },
    { name: "YouTube", icon: "📺", url: "#" },
  ];

  const footerLinks = {
    company: [
      { name: "About Us", path: "/about" },
      { name: "Our Story", path: "/about" },
      { name: "Careers", path: "#" },
      { name: "Press & Media", path: "#" },
    ],
    customer: [
      { name: "Contact Us", path: "/contact" },
      { name: "FAQs", path: "#" },
      { name: "Shipping Info", path: "#" },
      { name: "Returns & Exchange", path: "#" },
    ],
    legal: [
      { name: "Privacy Policy", path: "#" },
      { name: "Terms of Service", path: "#" },
      { name: "Cookie Policy", path: "#" },
    ],
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Elements */}
      <div style={{
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        height: "1px",
        background: "linear-gradient(90deg, transparent, #ff6f61, transparent)",
      }} />

      {/* Main Footer Content */}
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "80px 40px 40px",
      }}>
        {/* Links Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "60px",
          marginBottom: "60px",
        }}>
          {/* Brand Column */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            style={{ minWidth: "250px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <img
                src={assets.logo}
                alt="SSC Logo"
                style={{ 
                  width: "55px", 
                  height: "55px",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(255, 111, 97, 0.3)",
                }}
              />
              <div>
                <span style={{
                  fontSize: "22px",
                  fontWeight: "800",
                  background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "block",
                }}>
                  SSC
                </span>
                <span style={{
                  fontSize: "11px",
                  color: "#9ca3af",
                  letterSpacing: "1px",
                }}>
                  SURAT SARI CENTRE
                </span>
              </div>
            </div>
            <p style={{
              fontSize: "14px",
              color: "#9ca3af",
              lineHeight: "1.8",
              marginBottom: "24px",
            }}>
              Discover timeless elegance with Surat Sari Center. Quality fabrics, traditional charm, and modern design.
            </p>
            {/* Social Icons */}
            <div style={{ display: "flex", gap: "12px" }}>
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  whileHover={{ scale: 1.15, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "18px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "rgba(255, 111, 97, 0.2)";
                    e.target.style.borderColor = "#ff6f61";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "rgba(255, 255, 255, 0.05)";
                    e.target.style.borderColor = "rgba(255, 255, 255, 0.1)";
                  }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 style={{
              fontSize: "16px",
              fontWeight: "700",
              marginBottom: "20px",
              color: "#fff",
              letterSpacing: "0.5px",
            }}>
              COMPANY
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {footerLinks.company.map((link, i) => (
                <motion.div key={i} whileHover={{ x: 5 }}>
                  <Link
                    to={link.path}
                    style={{
                      fontSize: "14px",
                      color: "#9ca3af",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#ff6f61";
                      e.target.querySelector(".arrow").style.opacity = "1";
                      e.target.querySelector(".arrow").style.transform = "translateX(0)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#9ca3af";
                      e.target.querySelector(".arrow").style.opacity = "0";
                      e.target.querySelector(".arrow").style.transform = "translateX(-5px)";
                    }}
                  >
                    <span className="arrow" style={{ opacity: "0", transform: "translateX(-5px)", transition: "all 0.3s ease" }}>›</span>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Customer Service */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 style={{
              fontSize: "16px",
              fontWeight: "700",
              marginBottom: "20px",
              color: "#fff",
              letterSpacing: "0.5px",
            }}>
              CUSTOMER SERVICE
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {footerLinks.customer.map((link, i) => (
                <motion.div key={i} whileHover={{ x: 5 }}>
                  <Link
                    to={link.path}
                    style={{
                      fontSize: "14px",
                      color: "#9ca3af",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = "#ff6f61";
                      e.target.querySelector(".arrow").style.opacity = "1";
                      e.target.querySelector(".arrow").style.transform = "translateX(0)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "#9ca3af";
                      e.target.querySelector(".arrow").style.opacity = "0";
                      e.target.querySelector(".arrow").style.transform = "translateX(-5px)";
                    }}
                  >
                    <span className="arrow" style={{ opacity: "0", transform: "translateX(-5px)", transition: "all 0.3s ease" }}>›</span>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <h4 style={{
              fontSize: "16px",
              fontWeight: "700",
              marginBottom: "20px",
              color: "#fff",
              letterSpacing: "0.5px",
            }}>
              CONTACT US
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[
                { icon: "📞", label: "Phone", value: "+91 98765 43210" },
                { icon: "✉️", label: "Email", value: "support@ssc.com" },
                { icon: "📍", label: "Address", value: "123 Textile Market, Surat, Gujarat 395001" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 5 }}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <span style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(255, 111, 97, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    flexShrink: "0",
                  }}>
                    {item.icon}
                  </span>
                  <div>
                    <p style={{
                      fontSize: "12px",
                      color: "#6b7280",
                      margin: "0 0 2px 0",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}>
                      {item.label}
                    </p>
                    <p style={{
                      fontSize: "14px",
                      color: "#e5e7eb",
                      margin: 0,
                      fontWeight: "500",
                    }}>
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
            padding: "30px 0",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            marginBottom: "30px",
          }}
        >
          <span style={{ fontSize: "13px", color: "#6b7280" }}>We Accept:</span>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {["💳 Visa", "💳 Mastercard", "📱 UPI", "💰 COD"].map((method, i) => (
              <div
                key={i}
                style={{
                  padding: "8px 16px",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "#9ca3af",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                {method}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
        }}>
          <p style={{
            fontSize: "13px",
            color: "#6b7280",
            margin: 0,
          }}>
            © 2026 <span style={{ color: "#ff6f61", fontWeight: "600" }}>Surat Sari Centre</span>. All Rights Reserved.
          </p>
          <div style={{ display: "flex", gap: "24px" }}>
            {footerLinks.legal.map((link, i) => (
              <Link
                key={i}
                to={link.path}
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  textDecoration: "none",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => e.target.style.color = "#ff6f61"}
                onMouseLeave={(e) => e.target.style.color = "#6b7280"}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
