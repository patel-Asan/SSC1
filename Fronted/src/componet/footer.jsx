import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import './app1.css';

const Footer = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setAnimate(true);
  }, []);

  // Keyframe styles
  const fadeInUp = {
    animation: animate ? "fadeInUp 0.8s ease forwards" : "none",
    opacity: 0,
    transform: "translateY(30px)",
  };

  const containerStyle = {
    fontFamily: "Segoe UI, Roboto, sans-serif",
    padding: "40px 20px",
    maxWidth: "1280px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "40px",
  };

  const rowStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "24px",
    width: "100%",
  };

  const cardStyle = {
    ...fadeInUp,
    flex: "1 1 300px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    transition: "transform 0.3s ease",
    textAlign: "left",
  };

  const logoStyle = {
    width: "120px",
    height: "120px",
    marginBottom: "16px",
    transition: "transform 0.5s ease",
    cursor: "pointer",
  };

  const headingStyle = {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "14px",
    color: "#111",
  };

  const paragraphStyle = {
    fontSize: "15px",
    color: "#555",
    lineHeight: "1.6",
    letterSpacing: "0.3px",
    marginTop: "6px",
    textAlign: "justify",
  };

  const linkStyle = {
    fontSize: "14px",
    color: "#444",
    marginBottom: "10px",
    cursor: "pointer",
    transition: "color 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
        {/* Logo + Description */}
        <div style={cardStyle}>
          <img
            src={assets.logo}
            alt="Logo"
            style={logoStyle}
            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.1) rotate(2deg)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1) rotate(0deg)")}
          />
          <p style={paragraphStyle}>
            Discover timeless elegance with Surat Sari Center. Quality fabrics,
            traditional charm, and modern design — all in one place.
          </p>
        </div>

        {/* Company Links */}
        <div style={cardStyle}>
          <h3 style={headingStyle}>Company</h3>
          <div>
            {["Home", "About", "Delivery", "Privacy Policy"].map((link, i) => (
              <div
                key={i}
                style={{
                  ...linkStyle,
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#000")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#444")}
              >
                {link}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div style={cardStyle}>
          <h3 style={headingStyle}>Get In Touch!</h3>
          <div>
            <div style={linkStyle}>📞 0123456789</div>
            <div style={linkStyle}>📧 contact@ssc.com</div>
          </div>
        </div>
      </div>

      {/* Bottom Copy */}
      <div
  style={{
    fontSize: "14px",
    color: "#555",
    background: "linear-gradient(90deg, #f5f5f5, #fafafa)",
    padding: "16px 12px",
    borderTop: "1px solid #ddd",
    textAlign: "center",
    fontWeight: "500",
    letterSpacing: "0.3px",
    boxShadow: "0 -2px 6px rgba(0,0,0,0.04)",
    transition: "all 0.4s ease",
    animation: "fadeIn 1s ease forwards",
    opacity: 0,
  }}
>
  &copy; 2024 <span style={{ fontWeight: "600", color: "#222" }}>Surat Sari Center.com</span> — All Rights Reserved
</div>

   
    
    </div>
  );
};

export default Footer;
