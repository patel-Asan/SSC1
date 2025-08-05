import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets"; // Your image path

const Hero = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: "100vw",
        height: "100vh",
        fontFamily: "'Segoe UI', sans-serif",
        overflow: "hidden",
        background: "linear-gradient(to right, #fdfbfb, #ebedee)",
      }}
    >
      {/* Text Section */}
      <div
        style={{
          width: isMobile ? "100%" : "50%",
          height: isMobile ? "50%" : "100%",
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: isMobile ? "center" : "flex-start",
          padding: isMobile ? "40px 20px" : "80px",
          boxSizing: "border-box",
          textAlign: isMobile ? "center" : "left",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#7d7d7d",
              marginBottom: "10px",
              letterSpacing: "2px",
              position: "relative",
              display: "inline-block",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{
                width: "24px",
                height: "2px",
                backgroundColor: "#ff6f61",
                display: "inline-block",
                marginRight: "10px",
                verticalAlign: "middle",
              }}
            ></span>
            Our Bestsellers
          </p>

          <h1 className="prata-regular"
            style={{
              fontSize: isMobile ? "30px" : "42px",
              fontWeight: "bold",
              color: "#222",
              margin: "12px 0",
            }}
          >
            Latest <span style={{ color: "#ff6f61" }}>Arrivals</span>
          </h1>

          <p
            style={{
              fontSize: "16px",
              color: "#666",
              maxWidth: "400px",
              lineHeight: 1.6,
              marginTop: "10px",
              marginBottom: "25px",
            }}
          >
            Discover premium, beautifully designed fashion pieces made for the
            bold and the stylish. Don’t miss the season’s trendsetters.
          </p>

          <div
            style={{
              display: "inline-block",
              backgroundColor: "#ff6f61",
              color: "#fff",
              padding: "10px 22px",
              borderRadius: "25px",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0px 3px 8px rgba(0,0,0,0.15)",
              transition: "background-color 0.3s ease",
              textAlign: "center",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ff4e3c")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff6f61")}
          >
            🛍️ Shop Now
          </div>
        </div>
      </div>

      {/* Image Section */}
      <div
        style={{
          width: isMobile ? "100%" : "50%",
          height: isMobile ? "50%" : "100%",
          backgroundColor: "#ffe9f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          boxSizing: "border-box",
        }}
      >
        <img
          src={assets.hero_img}
          alt="Model"
          style={{
            maxHeight: "90%",
            maxWidth: "90%",
            objectFit: "cover",
            borderRadius: "20px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          }}
        />
      </div>
    </div>
  );
};

export default Hero;
