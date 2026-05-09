import React, { useContext, useState, useEffect } from "react";
import { Shopcontext } from "../context/shopcontext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetDone, setResetDone] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { navigate, backendUrl } = useContext(Shopcontext);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/password/reset`, {
        token,
        newPassword,
      });
      if (response.data.success) {
        setResetDone(true);
        toast.success("Password reset successfully!");
      } else {
        toast.error(response.data.message || "Something went wrong.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong.");
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: "#fff",
            padding: isMobile ? "24px" : "40px",
            borderRadius: "24px",
            textAlign: "center",
            maxWidth: "400px",
            margin: isMobile ? "0 16px" : "0",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
          }}
        >
          <h2 style={{ color: "#ef4444", marginBottom: "12px" }}>Invalid Reset Link</h2>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>This reset link is invalid or has expired.</p>
          <motion.span
            onClick={() => navigate("/forgot-password")}
            whileHover={{ color: "#ff6f61" }}
            style={{ color: "#ff6f61", fontWeight: "600", cursor: "pointer" }}
          >
            Request a new reset link
          </motion.span>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div style={{
        flex: 1,
        display: isMobile ? "none" : "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "60px 40px",
        color: "#fff",
      }}>
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{ fontSize: "48px", fontWeight: "800", marginBottom: "16px", letterSpacing: "-1px" }}
        >
          SSC Store
        </motion.h1>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{ fontSize: "18px", lineHeight: "1.6", opacity: 0.9, maxWidth: "400px" }}
        >
          Choose a strong password to secure your account.
        </motion.p>
      </div>

      <div style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "40px 16px" : "40px 20px",
        backgroundColor: "#fff",
      }}>
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: isMobile ? "24px" : "40px",
            borderRadius: "24px",
            backgroundColor: "#ffffff",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,111,97,0.1) 0%, transparent 70%)",
            }}
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 180] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            style={{ textAlign: "center" }}
          >
            <motion.h2
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{ fontSize: isMobile ? "24px" : "32px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}
            >
              {resetDone ? "Password Reset!" : "Set New Password"}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ fontSize: "14px", color: "#6b7280" }}
            >
              {resetDone
                ? "Your password has been updated successfully."
                : "Enter your new password below."}
            </motion.p>
          </motion.div>

          {!resetDone ? (
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={onSubmitHandler}
              style={{ width: "100%", display: "flex", flexDirection: "column", gap: "18px" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ position: "relative", width: "100%" }}
              >
                <div style={{ position: "relative", width: "100%" }}>
                  <motion.input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={() => setFocusedField("newPassword")}
                    onBlur={() => setFocusedField(null)}
                    required
                    style={{
                      width: "80%",
                      padding: "14px 16px",
                      paddingRight: "48px",
                      fontSize: "14px",
                      border: `2px solid ${focusedField === "newPassword" ? "#ff6f61" : "#d1d5db"}`,
                      borderRadius: "12px",
                      outline: "none",
                      backgroundColor: "#f9fafb",
                      color: "#1f2937",
                      transition: "all 0.3s ease",
                      boxShadow: focusedField === "newPassword" ? "0 0 0 3px rgba(255,111,97,0.1)" : "none",
                    }}
                    whileFocus={{
                      borderColor: "#ff6f61",
                      boxShadow: "0 0 0 3px rgba(255,111,97,0.15)",
                      backgroundColor: "#fff"
                    }}
                  />
                  <span
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      fontSize: "18px",
                      color: "#9ca3af",
                      userSelect: "none",
                      lineHeight: 1,
                    }}
                  >
                    {showNewPassword ? "🙈" : "👁️"}
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ position: "relative", width: "100%" }}
              >
                <div style={{ position: "relative", width: "100%" }}>
                  <motion.input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    required
                    style={{
                      width: "80%",
                      padding: "14px 16px",
                      paddingRight: "48px",
                      fontSize: "14px",
                      border: `2px solid ${focusedField === "confirmPassword" ? "#ff6f61" : "#d1d5db"}`,
                      borderRadius: "12px",
                      outline: "none",
                      backgroundColor: "#f9fafb",
                      color: "#1f2937",
                      transition: "all 0.3s ease",
                      boxShadow: focusedField === "confirmPassword" ? "0 0 0 3px rgba(255,111,97,0.1)" : "none",
                    }}
                    whileFocus={{
                      borderColor: "#ff6f61",
                      boxShadow: "0 0 0 3px rgba(255,111,97,0.15)",
                      backgroundColor: "#fff"
                    }}
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      fontSize: "18px",
                      color: "#9ca3af",
                      userSelect: "none",
                      lineHeight: 1,
                    }}
                  >
                    {showConfirmPassword ? "🙈" : "👁️"}
                  </span>
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={isLoading}
                style={{
                  marginTop: "10px",
                  width: "100%",
                  padding: "16px",
                  backgroundColor: isLoading ? "#10b981" : "#ff6f61",
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: "15px",
                  border: "none",
                  borderRadius: "12px",
                  cursor: isLoading ? "default" : "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(255,111,97,0.3)",
                }}
                whileHover={!isLoading ? {
                  backgroundColor: "#ff5545",
                  boxShadow: "0 6px 25px rgba(255,111,97,0.4)",
                  scale: 1.02
                } : {}}
                whileTap={!isLoading ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    Resetting...
                  </motion.span>
                ) : (
                  "Reset Password"
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "12px",
                padding: "24px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#166534", fontSize: "14px", margin: 0 }}>
                Your password has been reset. You can now login with your new password.
              </p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ textAlign: "center", fontSize: "14px", color: "#6b7280" }}
          >
            <motion.span
              onClick={() => navigate("/login")}
              whileHover={{ color: "#ff6f61" }}
              style={{ color: "#ff6f61", fontWeight: "600", cursor: "pointer" }}
            >
              Back to Login
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
