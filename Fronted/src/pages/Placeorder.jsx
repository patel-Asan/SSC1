import React, { useContext, useState, useEffect } from "react";
import Title from "../componet/title";
import CartTotal from "../componet/carttotal";
import { assets } from "../assets/assets";
import { Shopcontext } from "../context/shopcontext";
import axios from "axios";
import { toast } from "react-toastify";

const Placeorder = () => {
  const [method, setMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(Shopcontext);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    // Validation checks
    if (!token) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    if (Object.keys(cartItems).length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Check if all required fields are filled
    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      setIsSubmitting(true);
      console.log("Starting order placement...");
      console.log("Backend URL:", backendUrl);
      console.log("Token:", token ? "Present" : "Missing");
      console.log("Cart Items:", cartItems);

      let orderItems = [];

      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === itemId)
            );
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[itemId][size];
              orderItems.push(itemInfo);
            } else {
              console.error(`Product not found for ID: ${itemId}`);
              toast.error(`Product not found for ID: ${itemId}`);
              return;
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error("No valid items in cart");
        return;
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        payment: method,
      };

      console.log("Order Data:", orderData);

      switch (method) {
        case "cod":
          console.log("Placing COD order...");
          const response = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            { 
              headers: { 
                token,
                'Content-Type': 'application/json'
              } 
            }
          );
          
          console.log("Response:", response.data);
          
          if (response.data.success) {
            setCartItems({});
            toast.success("Order placed successfully!");
            navigate("/order");
          } else {
            toast.error(response.data.message || "Failed to place order");
          }
          break;

        case "google":
        case "phone":
          toast.warn("This payment method is not implemented yet. Please use Cash on Delivery.");
          break;

        default:
          toast.warn("Selected payment method is not implemented yet.");
          break;
      }
    } catch (error) {
      console.error("Order placement error:", error);
      
      if (error.response) {
        // Server responded with error status
        console.error("Error response:", error.response.data);
        toast.error(error.response.data.message || "Server error occurred");
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        toast.error("Network error. Please check your connection.");
      } else {
        // Something else happened
        console.error("Error setting up request:", error.message);
        toast.error(error.message || "Something went wrong!");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <form onSubmit={onSubmitHandler} style={containerStyle(isMobile)}>
      {/* LEFT: DELIVERY FORM */}
      <div style={formContainerStyle}>
        <div style={{ fontSize: isMobile ? "20px" : "24px", margin: "12px 0" }}>
          <Title text1={"DELIVERY_"} text2={"INFORMATION"} />
        </div>

        <div style={inputGroupRow}>
          <input required onChange={onChangeHandler} name="firstName" value={formData.firstName} type="text" placeholder="First Name" style={inputStyle} />
          <input required onChange={onChangeHandler} name="lastName" value={formData.lastName} type="text" placeholder="Last Name" style={inputStyle} />
        </div>

        <input required onChange={onChangeHandler} name="email" value={formData.email} type="email" placeholder="Email Address" style={inputStyleFull} />
        <input required onChange={onChangeHandler} name="street" value={formData.street} type="text" placeholder="Street Area" style={inputStyleFull} />

        <div style={inputGroupRow}>
          <input required onChange={onChangeHandler} name="city" value={formData.city} type="text" placeholder="City" style={inputStyle} />
          <input required onChange={onChangeHandler} name="state" value={formData.state} type="text" placeholder="State" style={inputStyle} />
        </div>

        <div style={inputGroupRow}>
          <input required onChange={onChangeHandler} name="zipcode" value={formData.zipcode} type="number" placeholder="Pincode" style={inputStyle} />
          <input required onChange={onChangeHandler} name="country" value={formData.country} type="text" placeholder="Country" style={inputStyle} />
        </div>

        <input required onChange={onChangeHandler} name="phone" value={formData.phone} type="number" placeholder="Mobile No." style={inputStyleFull} />
      </div>

      {/* RIGHT: CART + PAYMENT */}
      <div style={cartStyle(isMobile)}>
        <CartTotal hideCheckout={true} />
      </div>

      {/* PAYMENT METHOD */}
      <div style={{ marginTop: isMobile ? "32px" : "64px", width: "100%" }}>
        <Title text1={"PAYMENT_"} text2={"METHOD"} />
        <div style={paymentRowStyle(isMobile)}>
          {/* Google Pay */}
          <div
            onClick={() => setMethod("google")}
            style={{
              ...paymentBoxStyle,
              borderColor: method === "google" ? "#4ade80" : "#ccc",
              backgroundColor: method === "google" ? "#ecfdf5" : "#fff",
            }}
          >
            <p
              style={{
                ...radioCircleStyle,
                backgroundColor: method === "google" ? "#4ade80" : "",
              }}
            ></p>
            <img src={assets.razorpay_logo} alt="Google Pay" style={iconStyle} />
            <p style={labelStyle}>Phone Pay</p>
          </div>

          {/* Phone Pay */}
          <div
            onClick={() => setMethod("phone")}
            style={{
              ...paymentBoxStyle,
              borderColor: method === "phone" ? "#60a5fa" : "#ccc",
              backgroundColor: method === "phone" ? "#eff6ff" : "#fff",
            }}
          >
            <p
              style={{
                ...radioCircleStyle,
                backgroundColor: method === "phone" ? "#60a5fa" : "",
              }}
            ></p>
            <img src={assets.stripe_logo} alt="PhonePe" style={iconStyle} />
            <p style={labelStyle}>Google pay</p>
          </div>

          {/* COD */}
          <div
            onClick={() => setMethod("cod")}
            style={{
              ...paymentBoxStyle,
              borderColor: method === "cod" ? "#facc15" : "#ccc",
              backgroundColor: method === "cod" ? "#fefce8" : "#fff",
            }}
          >
            <p
              style={{
                ...radioCircleStyle,
                backgroundColor: method === "cod" ? "#facc15" : "",
              }}
            ></p>
            <p style={{ ...labelStyle, marginLeft: "8px" }}>Cash on Delivery</p>
          </div>
        </div>

        <div style={{ textAlign: "right", marginTop: "32px" }}>
          <button 
            type="submit" 
            style={{
              ...buttonStyle,
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer"
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "PLACING ORDER..." : "PLACE ORDER"}
          </button>
          
          {/* Debug button for testing */}
          <button 
            type="button" 
            onClick={async () => {
              try {
                console.log("Testing backend connection...");
                const response = await axios.get(`${backendUrl}/health`);
                console.log("Backend health check:", response.data);
                toast.success("Backend is connected!");
              } catch (error) {
                console.error("Backend connection test failed:", error);
                toast.error("Backend connection failed");
              }
            }}
            style={{
              ...buttonStyle,
              backgroundColor: "#6b7280",
              marginLeft: "10px"
            }}
          >
            Test Connection
          </button>
        </div>
      </div>
    </form>
  );
};

// Your styles below remain unchanged
const containerStyle = (isMobile) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  justifyContent: "space-between",
  gap: "24px",
  padding: isMobile ? "16px 12px" : "56px 48px",
  fontFamily: "'Segoe UI', sans-serif",
  backgroundColor: "#fafafa",
  minHeight: "90vh",
});

const formContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  width: "100%",
  maxWidth: "480px",
};

const cartStyle = (isMobile) => ({
  marginTop: isMobile ? "32px" : "0",
  minWidth: "320px",
  flex: 1,
});

const inputGroupRow = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const inputStyle = {
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  padding: "10px 14px",
  flex: 1,
  fontSize: "14px",
  outline: "none",
  transition: "0.2s",
};

const inputStyleFull = {
  ...inputStyle,
  width: "100%",
};

const paymentRowStyle = (isMobile) => ({
  display: "flex",
  flexDirection: isMobile ? "column" : "row",
  gap: "16px",
  marginTop: "20px",
  flexWrap: "wrap",
});

const paymentBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  border: "2px solid #ccc",
  padding: "12px 20px",
  cursor: "pointer",
  borderRadius: "8px",
  flex: 1,
  transition: "0.3s",
};

const radioCircleStyle = {
  width: "16px",
  height: "16px",
  borderRadius: "50%",
  border: "2px solid #888",
};

const iconStyle = {
  height: "32px",
  width: "auto",
  transition: "transform 0.2s ease",
};

const labelStyle = {
  fontSize: "14px",
  color: "#374151",
  fontWeight: "500",
};

const buttonStyle = {
  backgroundColor: "#000",
  color: "#fff",
  padding: "12px 36px",
  fontSize: "14px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

export default Placeorder;
