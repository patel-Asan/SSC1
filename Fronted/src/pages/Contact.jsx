import React, { useEffect, useState } from "react";
import Title from "../componet/title";
import { assets } from "../assets/assets";
import Newletterbox from "../componet/newletterbox";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const Contact = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    setSending(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(`${backendUrl}/api/message/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
    setSending(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#fff",
        color: "#1f2937",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: "center", padding: "80px 40px 60px" }}
      >
        <Title text1="CONTACT" text2="US" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            maxWidth: "600px",
            margin: "20px auto 0",
            fontSize: "16px",
            lineHeight: "1.7",
            color: "#6b7280",
          }}
        >
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </motion.p>
      </motion.div>

      {/* Contact Content */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          display: "flex",
          gap: "60px",
          padding: "60px 40px",
          alignItems: "stretch",
          flexDirection: isMobile ? "column" : "row",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {/* Contact Info Card */}
        <motion.div
          initial={{ x: -30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{ 
            flex: 1,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "24px",
            padding: "40px",
            color: "#fff",
            boxShadow: "0 20px 60px rgba(102,126,234,0.3)",
          }}
        >
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: "28px", fontWeight: "700", marginBottom: "30px" }}
          >
            📍 Our Store
          </motion.h3>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
              <strong>Address:</strong><br />
              123 Commerce Street, Market Road<br />
              Lucknow, UP 226001
            </div>

            <div style={{ fontSize: "16px", lineHeight: "1.8" }}>
              📞 <strong>Phone:</strong> +91 9876543210<br />
              ✉️ <strong>Email:</strong> ssc@gmail.com
            </div>

            <div style={{ fontSize: "16px", lineHeight: "1.8", marginTop: "20px" }}>
              <strong>Business Hours:</strong><br />
              Mon - Sat: 9:00 AM - 8:00 PM<br />
              Sunday: Closed
            </div>
          </motion.div>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ x: 30, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{ 
            flex: 1,
            backgroundColor: "#fafbfc",
            borderRadius: "24px",
            padding: "40px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
          }}
        >
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ fontSize: "24px", fontWeight: "700", marginBottom: "30px", color: "#1f2937" }}
          >
            Send us a Message
          </motion.h3>
          
          <motion.form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <motion.input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
              style={inputStyle}
            />
            <motion.input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
              style={inputStyle}
            />
            <motion.textarea
              placeholder="Your Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows="5"
              style={{ ...inputStyle, resize: "none" }}
              whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
            />
            <motion.button
              type="submit"
              disabled={sending}
              whileHover={!sending ? { scale: 1.02, boxShadow: "0 8px 25px rgba(255,111,97,0.3)" } : {}}
              whileTap={!sending ? { scale: 0.98 } : {}}
              style={{
                backgroundColor: sending ? "#10b981" : "#ff6f61",
                color: "#fff",
                padding: "18px 32px",
                borderRadius: "14px",
                border: "none",
                fontSize: "16px",
                fontWeight: "700",
                cursor: sending ? "default" : "pointer",
                boxShadow: "0 4px 15px rgba(255,111,97,0.2)",
                transition: "all 0.3s ease",
              }}
            >
              {sending ? "✓ Message Sent!" : "Send Message →"}
            </motion.button>
          </motion.form>
        </motion.div>
      </motion.div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          maxWidth: "1200px",
          margin: "0 auto 60px",
          padding: "0 40px",
        }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            background: "linear-gradient(135deg, #fff 0%, #f8fafc 100%)",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Map Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            style={{
              padding: "24px 30px",
              background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                backdropFilter: "blur(10px)",
              }}
            >
              📍
            </motion.div>
            <div>
              <h3 style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "#fff",
                margin: 0,
              }}>
                Find Us Here
              </h3>
              <p style={{
                fontSize: "13px",
                color: "rgba(255,255,255,0.85)",
                margin: "4px 0 0 0",
              }}>
                Visit our store in Surat, Gujarat
              </p>
            </div>
          </motion.div>

          {/* Map Container */}
          <div style={{
            position: "relative",
            width: "100%",
            height: isMobile ? "300px" : "450px",
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.735493285902!2d72.82440807520752!3d21.204983280494707!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e8f1fffffff%3A0x6f5c5c5c5c5c5c5c!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1234567890"
              width="100%"
              height="100%"
              style={{
                border: "none",
                filter: "grayscale(0.2) contrast(1.1)",
              }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SSC Store Location"
            />

            {/* Get Directions Button */}
            <motion.a
              href="https://maps.google.com/?q=Surat,Gujarat"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
                color: "#fff",
                padding: "12px 20px",
                borderRadius: "10px",
                fontSize: "14px",
                fontWeight: "600",
                textDecoration: "none",
                boxShadow: "0 4px 15px rgba(255,111,97,0.4)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>🧭</span>
              Get Directions
            </motion.a>
          </div>

          {/* Quick Info Bar */}
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "16px",
            padding: "20px 30px",
            background: "#fafafa",
            borderTop: "1px solid #e5e7eb",
          }}>
            {[/* eslint-disable-next-line */
              { icon: "🕐", label: "Mon-Sat: 9AM-8PM" },
              { icon: "📞", label: "+91 98765 43210" },
              { icon: "✉️", label: "support@ssc.com" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1 }}
                whileHover={{ x: 3 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  background: "#fff",
                  borderRadius: "10px",
                  fontSize: "13px",
                  color: "#4b5563",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <span>{item.icon}</span>
                <span style={{ fontWeight: "500" }}>{item.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

     
    </motion.div>
  );
};

const inputStyle = {
  padding: "16px 18px",
  border: "2px solid #e5e7eb",
  borderRadius: "12px",
  fontSize: "14px",
  outline: "none",
  backgroundColor: "#fff",
  color: "#1f2937",
  transition: "all 0.3s ease",
  fontFamily: "'Inter', sans-serif",
};

export default Contact;
