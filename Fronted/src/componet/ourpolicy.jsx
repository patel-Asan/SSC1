
import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";

const Ourpolicy = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsiveness with window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerStyle = {
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    justifyContent: "space-around",
    gap: isMobile ? "40px" : "10px",
    padding: "60px 20px",
    textAlign: "center",
    color: "#374151", // gray-700
    fontSize: isMobile ? "12px" : "14px",
    transition: "all 0.3s ease",
  };

  const boxStyle = {
    flex: 1,
    maxWidth: "280px",
    margin: "0 auto",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    padding: "10px",
    borderRadius: "12px",
    backgroundColor: "#f9fafb", // light bg
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  };

  const imageStyle = {
    width: "48px",
    margin: "0 auto 20px",
  };

  const titleStyle = {
    fontWeight: "600",
    fontSize: "15px",
    marginBottom: "8px",
    color: "#111827", // darker
  };

  const descStyle = {
    color: "#9ca3af", // gray-400
    fontSize: isMobile ? "11px" : "13px",
    lineHeight: "1.5",
  };

  return (
    <div style={containerStyle}>
      <div style={boxStyle}>
        <img src={assets.exchange_icon} alt="exchange" style={imageStyle} />
        <p style={titleStyle}>Easy Exchange Policy</p>
        <p style={descStyle}>We Offer Hassle-Free Exchange Policy</p>
      </div>
      <div style={boxStyle}>
        <img src={assets.quality_icon} alt="return" style={imageStyle} />
        <p style={titleStyle}>5 Days Return Policy</p>
        <p style={descStyle}>We Offer Hassle-Free Exchange Policy</p>
      </div>
      <div style={boxStyle}>
        <img src={assets.support_img} alt="support" style={imageStyle} />
        <p style={titleStyle}>Best Customer Support</p>
        <p style={descStyle}>We Provide 24/7 Customer Support</p>
      </div>
    </div>
  );
};

export default Ourpolicy;
