import React, { useEffect, useState } from "react";
import Title from "../componet/title";
import { assets } from "../assets/assets";
import Newletterbox from "../componet/newletterbox";

const Contact = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    setTimeout(() => setVisible(true), 150);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fadeIn = visible ? "1" : "0";
  const transformUp = visible ? "translateY(0px)" : "translateY(50px)";
  const zoomIn = visible ? "scale(1)" : "scale(0.9)";

  const styles = {
    container: {
      fontFamily: "'Segoe UI', sans-serif",
      padding: "50px 20px",
      background: "linear-gradient(to bottom, #f0f4f8, #ffffff)",
      color: "#1f2937",
    },
    titleWrapper: {
      textAlign: "center",
      borderTop: "3px solid #e5e7eb",
      paddingTop: "20px",
      marginBottom: "40px",
      opacity: fadeIn,
      transform: transformUp,
      transition: "all 0.9s ease",
    },
    content: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      alignItems: "center",
      justifyContent: "center",
      gap: "50px",
      marginBottom: "60px",
    },
    image: {
      width: "100%",
      maxWidth: "480px",
      borderRadius: "20px",
      boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
      transition: "transform 0.6s ease, box-shadow 0.6s ease",
      transform: zoomIn,
      opacity: fadeIn,
    },
    imageHover: {
      transform: "scale(1.05)",
      boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
    },
    info: {
      display: "flex",
      flexDirection: "column",
      gap: "18px",
      transform: transformUp,
      opacity: fadeIn,
      transition: "all 1.1s ease-out",
      maxWidth: "450px",
    },
    sectionTitle: {
      fontSize: "22px",
      fontWeight: "700",
      color: "#2563eb",
    },
    text: {
      fontSize: "16px",
      color: "#374151",
      lineHeight: "1.7",
    },
    button: {
      marginTop: "14px",
      background: "linear-gradient(to right, #2563eb, #1e40af)",
      color: "#ffffff",
      padding: "12px 28px",
      borderRadius: "12px",
      border: "none",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.titleWrapper}>
        <Title text1="CONTACT" text2="US" />
      </div>

      <div style={styles.content}>
        <img
          src={assets.logo}
          alt="Contact"
          style={styles.image}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = styles.imageHover.transform;
            e.currentTarget.style.boxShadow = styles.imageHover.boxShadow;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = styles.image.transform;
            e.currentTarget.style.boxShadow = styles.image.boxShadow;
          }}
        />

        <div style={styles.info}>
          <p style={styles.sectionTitle}>🏪 Our Store</p>
          <p style={styles.text}>
            5545564<br />
            ggrgrtggjfedfknem, UP
          </p>

          <p style={styles.text}>
            📞 <strong>Mobile No:</strong> 275313546521<br />
            📧 <strong>Email:</strong> ssc@gmail.com
          </p>

          <p style={styles.sectionTitle}>💼 Careers at SSC</p>
          <p style={styles.text}>
            Learn more about our team and job openings.
          </p>

          <button
            style={styles.button}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            Explore Jobs
          </button>
        </div>
      </div>

      <Newletterbox />
    </div>
  );
};

export default Contact;
