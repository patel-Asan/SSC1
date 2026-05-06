import React from "react";
import Title from "../componet/title";
import { assets } from "../assets/assets";
import Newletterbox from "../componet/newletterbox";
import { motion } from "framer-motion";

const features = [
  {
    title: "Quality Assurance",
    text: "We ensure only premium services, every time you engage with us.",
    icon: "✅",
    color: "#3b82f6",
  },
  {
    title: "Convenience",
    text: "Easy navigation, fast access, and always available to serve you.",
    icon: "📱",
    color: "#10b981",
  },
  {
    title: "24/7 Support",
    text: "Human-friendly, prompt and always caring – that's our promise.",
    icon: "🎧",
    color: "#8b5cf6",
  },
];

const About = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        fontFamily: "'Inter', sans-serif",
        color: "#1e293b",
        maxWidth: "1400px",
        margin: "0 auto",
        backgroundColor: "#fff",
        minHeight: "100vh",
      }}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", padding: "80px 40px 60px" }}
      >
        <Title text1={"ABOUT_"} text2={"Us"} />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            maxWidth: "700px",
            margin: "20px auto 0",
            fontSize: "16px",
            lineHeight: "1.7",
            color: "#6b7280",
          }}
        >
          "Our passion drives us. Our quality defines us. Our mission is to make a difference."
        </motion.p>
      </motion.div>

      {/* About Content */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          display: "flex",
          gap: "60px",
          padding: "60px 40px",
          alignItems: "center",
          flexDirection: window.innerWidth >= 768 ? "row" : "column",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ flex: 1 }}
        >
          <motion.img
            src={assets.about_img}
            alt="About"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4 }}
            style={{
              width: "100%",
              borderRadius: "24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            }}
          />
        </motion.div>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{
            flex: 1,
            fontSize: "15px",
            lineHeight: "1.8",
            color: "#475569",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: "24px", fontWeight: "700", color: "#1f2937" }}
          >
            🚀 Our Mission
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            To create value through top-tier services, customer focus, and relentless improvement. We grow when our users succeed.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            We strive to provide a seamless experience to our users, backed by innovation and integrity. Every interaction is an opportunity to exceed expectations.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ padding: "80px 40px", backgroundColor: "#fafbfc" }}
      >
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <Title text1={"WHY_"} text2={"CHOOSE US"} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            display: "grid",
            gridTemplateColumns: window.innerWidth >= 768 ? "repeat(3, 1fr)" : "1fr",
            gap: "30px",
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              style={{
                padding: "40px 30px",
                borderRadius: "24px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                textAlign: "center",
                border: `2px solid ${item.color}20`,
                transition: "all 0.3s ease",
              }}
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ 
                  fontSize: "48px", 
                  marginBottom: "20px",
                  display: "inline-block",
                }}
              >
                {item.icon}
              </motion.div>
              <h3 style={{ 
                fontSize: "20px", 
                margin: "12px 0", 
                fontWeight: "700",
                color: item.color,
              }}>
                {item.title}
              </h3>
              <p style={{ 
                fontSize: "14px", 
                color: "#6b7280",
                lineHeight: "1.6",
              }}>
                {item.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <Newletterbox />
      </motion.div>
    </motion.div>
  );
};

export default About;
