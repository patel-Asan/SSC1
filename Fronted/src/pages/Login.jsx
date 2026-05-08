import React, { useContext, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const { token, setToken, navigate, backendUrl } = useContext(Shopcontext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(`${backendUrl}/api/user/register`, {
          name,
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Account created successfully!");
          navigate("/");
        } else {
          toast.error(response.data.message || "Registration failed.");
        }
      } else {
        const response = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });

        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          if (rememberMe) {
            localStorage.setItem("rememberMe", "true");
          }
          toast.success("Welcome back!");
          navigate("/");
        } else {
          toast.error(response.data.message || "Login failed.");
        }
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

  const inputFields = [
    { id: "name", type: "text", placeholder: "Full Name", value: name, setter: setName, show: currentState === "Sign Up" },
    { id: "email", type: "email", placeholder: "Email Address", value: email, setter: setEmail },
    { id: "password", type: showPassword ? "text" : "password", placeholder: "Password", value: password, setter: setPassword, isPassword: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: window.innerWidth >= 768 ? "row" : "column",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      {/* Left Branding Section */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          flex: 1,
          display: window.innerWidth >= 768 ? "flex" : "none",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 40px",
          color: "#fff",
        }}
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          style={{
            fontSize: "48px",
            fontWeight: "800",
            marginBottom: "16px",
            letterSpacing: "-1px",
          }}
        >
          SSC Store
        </motion.h1>
        <motion.p
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            opacity: 0.9,
            maxWidth: "400px",
          }}
        >
          Discover premium products with unmatched quality. Join our community of satisfied customers today.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            marginTop: "40px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {["✓ Free Shipping on Orders $50+", "✓ 30-Day Easy Returns", "✓ 24/7 Customer Support"].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              style={{ fontSize: "16px", opacity: 0.9 }}
            >
              {feature}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Right Form Section */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          backgroundColor: "#fff",
        }}
      >
        <motion.div
          initial={{ y: 30, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: "40px",
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
              key={currentState}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#111827",
                marginBottom: "8px",
              }}
            >
              {currentState}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{
                fontSize: "14px",
                color: "#6b7280",
              }}
            >
              {currentState === "Login" 
                ? "Welcome back! Please login to your account." 
                : "Create an account to get started."}
            </motion.p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.form
              key={currentState}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={onSubmitHandler}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              {inputFields.map((field, index) => (
                field.show !== false && (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{ position: "relative", width: "100%" }}
                  >
                    <div style={{ position: "relative", width: "100%" }}>
                      <motion.input
                        type={field.type}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={(e) => field.setter(e.target.value)}
                        onFocus={() => setFocusedField(field.id)}
                        onBlur={() => setFocusedField(null)}
                        required
                        style={{
                          width: field.isPassword ? "80%" : "90%",
                          padding: "14px 16px",
                          paddingRight: field.isPassword ? "48px" : "16px",
                          fontSize: "14px",
                          border: `2px solid ${focusedField === field.id ? "#ff6f61" : "#d1d5db"}`,
                          borderRadius: "12px",
                          outline: "none",
                          backgroundColor: "#f9fafb",
                          color: "#1f2937",
                          transition: "all 0.3s ease",
                          boxShadow: focusedField === field.id 
                            ? "0 0 0 3px rgba(255,111,97,0.1)" 
                            : "none",
                        }}
                        whileFocus={{ 
                          borderColor: "#ff6f61",
                          boxShadow: "0 0 0 3px rgba(255,111,97,0.15)",
                          backgroundColor: "#fff"
                        }}
                      />
                      {field.isPassword && (
                        <span
                          onClick={() => setShowPassword(!showPassword)}
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
                          {showPassword ? "🙈" : "👁️"}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )
              ))}

              {currentState === "Login" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "13px",
                    color: "#4b5563",
                  }}
                >
                  <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{ accentColor: "#ff6f61" }}
                    />
                    Remember me
                  </label>
                  <motion.span
                    onClick={() => navigate("/forgot-password")}
                    whileHover={{ color: "#ff6f61" }}
                    style={{ cursor: "pointer", fontWeight: "500" }}
                  >
                    Forgot Password?
                  </motion.span>
                </motion.div>
              )}

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
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    Processing...
                  </motion.span>
                ) : (
                  currentState === "Login" ? "Sign In" : "Create Account"
                )}
              </motion.button>
            </motion.form>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "12px",
              color: "#9ca3af",
            }}
          >
            <span style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
            or continue with
            <span style={{ flex: 1, height: "1px", backgroundColor: "#e5e7eb" }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            style={{ display: "flex", gap: "12px" }}
          >
            {[
              { name: "Google", icon: "G" },
              { name: "Facebook", icon: "f" },
              { name: "Apple", icon: "🍎" }
            ].map((provider, index) => (
              <motion.button
                key={provider.name}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                whileTap={{ scale: 0.95 }}
                style={{
                  flex: 1,
                  padding: "12px",
                  backgroundColor: "#fff",
                  border: "2px solid #e5e7eb",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color: "#374151",
                }}
              >
                {provider.icon}
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            style={{
              textAlign: "center",
              fontSize: "14px",
              color: "#6b7280",
            }}
          >
            {currentState === "Login" ? "Don't have an account? " : "Already have an account? "}
            <motion.span
              onClick={() => setCurrentState(currentState === "Login" ? "Sign Up" : "Login")}
              whileHover={{ color: "#ff6f61" }}
              style={{ 
                color: "#ff6f61", 
                fontWeight: "600", 
                cursor: "pointer",
              }}
            >
              {currentState === "Login" ? "Sign Up" : "Login"}
            </motion.span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
