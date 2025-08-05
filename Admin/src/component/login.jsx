import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import apiService from "../services/api.js";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await apiService.adminLogin({
        email,
        password,
      });

      if (response.success) {
        setToken(response.token);
        toast.success("Login successful!");
      } else {
        toast.error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f3f4f6",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "2rem",
        borderRadius: "0.75rem",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h1 style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "1.875rem",
          fontWeight: "700",
          color: "#111827"
        }}>
          Admin Panel Login
        </h1>
        
        <form onSubmit={submitHandler} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <p style={{ marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
              Email Address
            </p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="adminssc@gmail.com"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                outline: "none",
                transition: "border-color 0.2s"
              }}
            />
          </div>
          
          <div>
            <p style={{ marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "600", color: "#374151" }}>
              Password
            </p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter Your Password"
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #d1d5db",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                outline: "none",
                transition: "border-color 0.2s"
              }}
            />
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            style={{
              backgroundColor: loading ? "#9ca3af" : "#3b82f6",
              color: "white",
              padding: "0.75rem",
              border: "none",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div style={{
          marginTop: "1rem",
          padding: "0.75rem",
          backgroundColor: "#f3f4f6",
          borderRadius: "0.375rem",
          fontSize: "0.75rem",
          color: "#6b7280",
          textAlign: "center"
        }}>
          <p style={{ margin: 0 }}>
            <strong>Admin Credentials:</strong><br />
            Email: adminssc@gmail.com<br />
            Password: ssc112233
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
