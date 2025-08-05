import React, { useContext, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const { token, setToken, navigate, backendUrl } = useContext(Shopcontext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();
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
          toast.success("Registered successfully!");
          navigate("/"); // optional redirect
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
          toast.success("Login successful!");
          navigate("/"); // optional redirect
        } else {
          toast.error(response.data.message || "Login failed.");
        }
      }
    } catch (error) {
      console.log("Axios Error:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Something went wrong.");
      } else {
        toast.error("Network error. Please try again.");
      }
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      style={formStyle}
    >
      <div style={titleStyle}>{currentState}</div>

      {currentState !== "Login" && (
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="Name"
          style={inputStyle}
        />
      )}

      <input
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        type="email"
        placeholder="Email"
        style={inputStyle}
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        type="password"
        placeholder="Password"
        style={inputStyle}
      />

      <div style={extraLinkStyle}>
        <span style={linkStyle}>Forgot Password?</span>
        <span
          onClick={() =>
            setCurrentState(currentState === "Login" ? "Sign Up" : "Login")
          }
          style={linkStyle}
        >
          {currentState === "Login" ? "Create Account" : "Login Here"}
        </span>
      </div>

      <button
        type="submit"
        style={submitStyle}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#111827")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#1f2937")}
      >
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
};

// Styles
const formStyle = {
  width: "90%",
  maxWidth: "400px",
  margin: "100px auto 40px auto",
  padding: "30px",
  border: "2px solid #1f2937",
  borderRadius: "16px",
  backgroundColor: "#f9fafb",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
  fontFamily: "'Segoe UI', sans-serif",
  color: "#1f2937",
};

const titleStyle = {
  fontSize: "28px",
  fontWeight: "600",
  color: "#111827",
  marginBottom: "10px",
};

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "14px",
  border: "1px solid #6b7280",
  borderRadius: "8px",
  outline: "none",
  backgroundColor: "#ffffff",
  color: "#1f2937",
};

const extraLinkStyle = {
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  fontSize: "13px",
  color: "#4b5563",
};

const linkStyle = {
  cursor: "pointer",
  color: "#3b82f6",
  fontWeight: "500",
};

const submitStyle = {
  marginTop: "20px",
  width: "100%",
  padding: "12px",
  backgroundColor: "#1f2937",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "14px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

export default Login;
