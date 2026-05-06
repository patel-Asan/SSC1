import React, { useState, useEffect, useRef, useContext } from "react";
import { motion } from "framer-motion";
import { Shopcontext } from "../context/shopcontext";
import axios from "axios";
import { toast } from "react-toastify";

const Newletterbox = () => {
  const { token, navigate, backendUrl } = useContext(Shopcontext);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponCode, setCouponCode] = useState(null);
  const canvasRef = useRef(null);

  // Particles.js effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    let animationId;
    let particles = [];
    
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    
    // Create particles
    const particleCount = 50;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
        
        // Draw connections
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleSubscribe = async () => {
    if (!token) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${backendUrl}/api/subscribe/subscribe`, {}, {
        headers: { token }
      });

      if (response.data.success) {
        setIsSubscribed(true);
        setCouponCode(response.data.couponCode);
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to subscribe");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{
        padding: "50px 20px",
        background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Particles.js Canvas Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Animated Gradient Orbs */}
      <motion.div
        style={{
          position: "absolute",
          top: "-30%",
          left: "-10%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-5%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          scale: [1, 1.15, 1],
          x: [0, -20, 0],
          y: [0, -15, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <motion.div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Special Offer Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(10px)",
            padding: "8px 18px",
            borderRadius: "50px",
            marginBottom: "20px",
            border: "1px solid rgba(255,255,255,0.3)",
          }}
        >
          <motion.span
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            style={{ fontSize: "14px" }}
          >
            🎉
          </motion.span>
          <span style={{ fontSize: "13px", color: "#fff", fontWeight: "600", letterSpacing: "0.5px" }}>
            Special Offer
          </span>
        </motion.div>

        {/* Heading with Shimmer Effect */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          style={{
            fontSize: "clamp(24px, 4vw, 36px)",
            fontWeight: "800",
            color: "#fff",
            marginBottom: "12px",
            letterSpacing: "-0.5px",
            textShadow: "0 2px 20px rgba(0,0,0,0.1)",
          }}
        >
          Subscribe & Get{" "}
          <motion.span
            style={{
              background: "linear-gradient(90deg, #fff, #ffd700, #fff)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            animate={{ backgroundPosition: ["0% center", "200% center"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            10% Off
          </motion.span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          style={{
            color: "rgba(255,255,255,0.85)",
            fontSize: "14px",
            maxWidth: "450px",
            margin: "0 auto 28px",
            lineHeight: "1.6",
          }}
        >
          Stay updated with our latest collections, discounts, and special offers.
        </motion.p>

        {/* Subscription Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          style={{
            display: "flex",
            gap: "0",
            justifyContent: "center",
            width: "100%",
            maxWidth: "420px",
            margin: "0 auto",
            background: "rgba(255,255,255,0.95)",
            borderRadius: "14px",
            padding: "6px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          {!token ? (
            <motion.button
              type="button"
              onClick={handleSubscribe}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: "100%",
                padding: "12px 24px",
                background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "700",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                boxShadow: "0 4px 15px rgba(255, 111, 97, 0.4)",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              Login to Subscribe →
            </motion.button>
          ) : isSubscribed && couponCode ? (
            <div style={{
              width: "100%",
              padding: "12px 24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ color: "#166534", fontWeight: "700", fontSize: "14px" }}>
                ✓ Subscribed! Check your email
              </span>
              <div style={{
                background: "#f3f4f6",
                padding: "8px 16px",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "800",
                color: "#6366f1",
                letterSpacing: "2px"
              }}>
                {couponCode}
              </div>
              <span style={{ fontSize: "12px", color: "#10b981", fontWeight: "600" }}>
                10% OFF coupon applied!
              </span>
            </div>
          ) : (
            <motion.button
              type="button"
              onClick={handleSubscribe}
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              style={{
                width: "100%",
                padding: "12px 24px",
                background: isSubmitting ? "#9ca3af" : "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: "700",
                border: "none",
                borderRadius: "10px",
                cursor: isSubmitting ? "default" : "pointer",
                boxShadow: "0 4px 15px rgba(255, 111, 97, 0.4)",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              {isSubmitting ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    ⏳
                  </motion.span>
                  Subscribing...
                </>
              ) : (
                <>
                  Subscribe
                  <motion.span
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </>
              )}
            </motion.button>
          )}
        </motion.form>

        {/* Privacy Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          style={{
            marginTop: "16px",
            fontSize: "12px",
            color: "rgba(255,255,255,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px",
          }}
        >
          <motion.span
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔒
          </motion.span>
          {token ? "Your email is secure. Unsubscribe anytime from account." : "Login with your account to subscribe"}
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Newletterbox;
