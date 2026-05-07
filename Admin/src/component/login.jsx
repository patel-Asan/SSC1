import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { LogIn, Mail, Lock, Eye, EyeOff, Shield } from "lucide-react";
import apiService from "../services/api.js";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await apiService.adminLogin({ email, password });
      if (response.success) {
        toast.success("Login successful!");
        setTimeout(() => setToken(response.token), 300);
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
      position: "relative",
      overflow: "hidden",
      padding: "20px"
    }}>
      {/* Animated background elements */}
      <div style={{
        position: "absolute",
        width: "600px",
        height: "600px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)",
        top: "-200px",
        right: "-200px",
        animation: "pulse 4s ease-in-out infinite"
      }} />
      <div style={{
        position: "absolute",
        width: "400px",
        height: "400px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,111,97,0.1) 0%, transparent 70%)",
        bottom: "-100px",
        left: "-100px",
        animation: "pulse 4s ease-in-out infinite 2s"
      }} />

      <div style={{
        width: "100%",
        maxWidth: "420px",
        position: "relative",
        zIndex: 1,
        animation: "slideUp 0.6s ease-out"
      }}>
        {/* Logo Section */}
        <div style={{
          textAlign: "center",
          marginBottom: "32px"
        }}>
          <div style={{
            width: "72px",
            height: "72px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #8b5cf6 0%, #ff6f61 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 32px rgba(139,92,246,0.3)"
          }}>
            <Shield size={36} color="white" />
          </div>
          <h1 style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#fff",
            margin: "0 0 8px 0",
            letterSpacing: "-0.5px"
          }}>
            SSC Admin
          </h1>
          <p style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.6)",
            margin: 0,
            fontWeight: "400"
          }}>
            Sign in to your admin dashboard
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "36px",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)"
        }}>
          <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.8)",
                marginBottom: "8px"
              }}>
                Email Address
              </label>
              <div style={{
                position: "relative"
              }}>
                <Mail size={18} style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,0.4)",
                  pointerEvents: "none"
                }} />
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  placeholder="admin@example.com"
                  required
                  style={{
                    width: "100%",
                    padding: "14px 14px 14px 44px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    fontSize: "14px",
                    color: "#fff",
                    outline: "none",
                    transition: "all 0.3s ease"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(139,92,246,0.5)";
                    e.target.style.background = "rgba(255,255,255,0.1)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    e.target.style.background = "rgba(255,255,255,0.06)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
                fontWeight: "600",
                color: "rgba(255,255,255,0.8)",
                marginBottom: "8px"
              }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={18} style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,0.4)",
                  pointerEvents: "none"
                }} />
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: "100%",
                    padding: "14px 44px 14px 44px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    fontSize: "14px",
                    color: "#fff",
                    outline: "none",
                    transition: "all 0.3s ease"
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(139,92,246,0.5)";
                    e.target.style.background = "rgba(255,255,255,0.1)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.15)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(255,255,255,0.1)";
                    e.target.style.background = "rgba(255,255,255,0.06)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.4)",
                    padding: "4px",
                    display: "flex"
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading
                  ? "linear-gradient(135deg, #6d28d9 0%, #dc2626 100%)"
                  : "linear-gradient(135deg, #8b5cf6 0%, #ff6f61 100%)",
                border: "none",
                borderRadius: "12px",
                fontSize: "15px",
                fontWeight: "700",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.3s ease",
                marginTop: "4px",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 25px rgba(139,92,246,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: "20px",
                    height: "20px",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.6s linear infinite"
                  }} />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Credentials Hint */}
          <div style={{
            marginTop: "24px",
            padding: "16px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "12px",
            border: "1px solid rgba(255,255,255,0.06)"
          }}>
            <p style={{
              margin: "0 0 8px 0",
              fontSize: "11px",
              color: "rgba(255,255,255,0.4)",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "1px",
              textAlign: "center"
            }}>
              Demo Credentials
            </p>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              fontSize: "13px",
              color: "rgba(255,255,255,0.6)",
              textAlign: "center"
            }}>
              <span>Email: <strong style={{ color: "rgba(255,255,255,0.8)" }}>adminssc@gmail.com</strong></span>
              <span>Password: <strong style={{ color: "rgba(255,255,255,0.8)" }}>ssc112233</strong></span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: "center",
          marginTop: "24px",
          fontSize: "12px",
          color: "rgba(255,255,255,0.3)"
        }}>
          &copy; 2026 SSC Admin Panel. All rights reserved.
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

export default Login;
