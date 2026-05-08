import React, { useContext, useState, useEffect } from "react";
import Title from "../componet/title";
import CartTotal from "../componet/carttotal";
import { assets } from "../assets/assets";
import { Shopcontext } from "../context/shopcontext";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Placeorder = () => {
  const [method, setMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const {
    navigate,
    backendUrl,
    token,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
    coupon,
    discount,
    couponCode,
    couponMessage,
    applyCoupon,
    removeCoupon,
    getFinalAmount,
  } = useContext(Shopcontext);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [userProfile, setUserProfile] = useState({ firstName: "", lastName: "", email: "" });
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

  const fetchAddresses = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/user/profile`, { headers: { token } });
      if (res.data.success) {
        setSavedAddresses(res.data.user.addresses || []);
        const user = res.data.user;
        const nameParts = user.name?.split(" ") || [];
        const profile = {
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          email: user.email || "",
        };
        setUserProfile(profile);
        if (user.addresses?.length > 0) {
          const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
          selectAddress(defaultAddr, profile);
        } else if (user.address?.street) {
          setFormData({
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
            street: user.address.street || "",
            city: user.address.city || "",
            state: user.address.state || "",
            zipcode: user.address.zipcode || "",
            country: user.address.country || "",
            phone: user.phone || "",
          });
        } else {
          setFormData(prev => ({
            ...prev,
            firstName: profile.firstName,
            lastName: profile.lastName,
            email: profile.email,
          }));
        }
      }
    } catch (err) {
      console.log("Failed to load addresses:", err);
    }
  };

  const selectAddress = (addr, profile) => {
    const p = profile || userProfile;
    setSelectedAddressId(addr._id || "new");
    setFormData({
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      zipcode: addr.zipcode || "",
      country: addr.country || "India",
      phone: addr.phone || "",
    });
  };

  const useNewAddress = () => {
    setSelectedAddressId("new");
    setFormData({
      firstName: "", lastName: "", email: "",
      street: "", city: "", state: "",
      zipcode: "", country: "India", phone: "",
    });
  };

  useEffect(() => {
    if (token) fetchAddresses();
  }, [token]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.error("Enter a coupon code");
      return;
    }
    setApplyingCoupon(true);
    const result = await applyCoupon(couponInput, getCartAmount());
    if (result.success) {
      setCouponInput("");
    }
    setApplyingCoupon(false);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    
    if (!token) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    if (Object.keys(cartItems).length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const requiredFields = ['firstName', 'lastName', 'email', 'street', 'city', 'state', 'zipcode', 'country', 'phone'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields`);
      return;
    }

    try {
      setIsSubmitting(true);

      let orderItems = [];

      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          if (cartItems[itemId][size] > 0) {
            const itemInfo = structuredClone(products.find((product) => product._id === itemId));
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItems[itemId][size];
              orderItems.push(itemInfo);
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
        amount: getFinalAmount() + delivery_fee,
        payment: method,
        coupon: couponCode || null,
      };

      switch (method) {
        case "cod":
          const response = await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            { headers: { token, 'Content-Type': 'application/json' } }
          );
          
          if (response.data.success) {
            setCartItems({});
            toast.success("Order placed successfully!");
            navigate("/order-success");
          } else {
            toast.error(response.data.message || "Failed to place order");
          }
          break;
        default:
          toast.warn("Please use Cash on Delivery.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Server error occurred");
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Something went wrong!");
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

  const inputStyle = {
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    padding: "16px 18px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
    backgroundColor: "#fff",
    color: "#1f2937",
    fontFamily: "'Inter', sans-serif",
  };

  const paymentMethods = [
    { id: "cod", label: "Cash on Delivery", icon: "💵", color: "#f59e0b" },
    { id: "phonepe", label: "PhonePe", icon: "📱", color: "#3b82f6" },
    { id: "gpay", label: "Google Pay", icon: "💳", color: "#10b981" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        gap: "60px",
        padding: "80px 40px",
        fontFamily: "'Inter', sans-serif",
        backgroundColor: "#fff",
        minHeight: "100vh",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* LEFT: DELIVERY FORM */}
      <motion.div
        initial={{ x: -30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{ flex: 1, maxWidth: isMobile ? "100%" : "600px" }}
      >
        <Title text1={"DELIVERY_"} text2={"INFORMATION"} />

        {/* SAVED ADDRESSES */}
        {savedAddresses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: "24px", marginBottom: "8px" }}
          >
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#6b7280", margin: "0 0 10px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Saved Addresses
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {savedAddresses.map((addr) => (
                <motion.div
                  key={addr._id}
                  onClick={() => selectAddress(addr)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    padding: "14px 18px",
                    borderRadius: "12px",
                    border: `2px solid ${selectedAddressId === addr._id ? "#ff6f61" : "#e5e7eb"}`,
                    background: selectedAddressId === addr._id ? "rgba(255,111,97,0.04)" : "#fff",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: selectedAddressId === addr._id ? "0 2px 8px rgba(255,111,97,0.1)" : "none",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontWeight: "700", fontSize: "14px", color: "#1f2937" }}>
                        {addr.label || "Address"}
                      </span>
                      {addr.isDefault && (
                        <span style={{ marginLeft: "8px", fontSize: "11px", background: "#ff6f61", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontWeight: "600" }}>
                          Default
                        </span>
                      )}
                      <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#6b7280", lineHeight: "1.4" }}>
                        {addr.street}, {addr.city}, {addr.state} - {addr.zipcode}
                      </p>
                    </div>
                    {selectedAddressId === addr._id && (
                      <span style={{ color: "#ff6f61", fontSize: "18px" }}>✓</span>
                    )}
                  </div>
                </motion.div>
              ))}
              <motion.div
                onClick={useNewAddress}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                style={{
                  padding: "14px 18px",
                  borderRadius: "12px",
                  border: `2px dashed ${selectedAddressId === "new" ? "#ff6f61" : "#d1d5db"}`,
                  background: selectedAddressId === "new" ? "rgba(255,111,97,0.04)" : "#fff",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: "600", color: selectedAddressId === "new" ? "#ff6f61" : "#6b7280" }}>
                  + Add New Address
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}

        <motion.div
          style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}
        >
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <motion.input
              required
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              type="text"
              placeholder="First Name"
              style={{ ...inputStyle, flex: 1, minWidth: "200px" }}
              whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
            />
            <motion.input
              required
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              type="text"
              placeholder="Last Name"
              style={{ ...inputStyle, flex: 1, minWidth: "200px" }}
              whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
            />
          </div>

          <motion.input
            required
            onChange={onChangeHandler}
            name="email"
            value={formData.email}
            type="email"
            placeholder="Email Address"
            style={inputStyle}
            whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
          />
          <motion.input
            required
            onChange={onChangeHandler}
            name="street"
            value={formData.street}
            type="text"
            placeholder="Street Address"
            style={inputStyle}
            whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
          />

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <motion.input
              required
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
              type="text"
              placeholder="City"
              style={{ ...inputStyle, flex: 1 }}
              whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
            />
            <motion.input
              required
              onChange={onChangeHandler}
              name="state"
              value={formData.state}
              type="text"
              placeholder="State"
              style={{ ...inputStyle, flex: 1 }}
              whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <motion.input
              required
              onChange={onChangeHandler}
              name="zipcode"
              value={formData.zipcode}
              type="number"
              placeholder="Pincode"
              style={{ ...inputStyle, flex: 1 }}
              whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
            />
            <motion.input
              required
              onChange={onChangeHandler}
              name="country"
              value={formData.country}
              type="text"
              placeholder="Country"
              style={{ ...inputStyle, flex: 1 }}
              whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
            />
          </div>

          <motion.input
            required
            onChange={onChangeHandler}
            name="phone"
            value={formData.phone}
            type="tel"
            placeholder="Mobile Number"
            style={inputStyle}
            whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
          />
        </motion.div>
      </motion.div>

      {/* RIGHT: CART + PAYMENT */}
      <motion.div
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{ flex: 1, maxWidth: "500px" }}
      >
        <div style={{ marginBottom: isMobile ? "32px" : "0" }}>
          <CartTotal hideCheckout={true} />
        </div>

        {/* COUPON SECTION */}
        <div style={{ marginTop: "24px" }}>
          <Title text1={"COUPON_"} text2={"CODE"} />
          
          <div style={{
            marginTop: "20px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap"
          }}>
            <motion.input
              type="text"
              placeholder="Enter coupon code"
              value={couponInput || couponCode}
              onChange={(e) => !coupon && setCouponInput(e.target.value)}
              disabled={!!coupon}
              style={{
                ...inputStyle,
                flex: 1,
                minWidth: "200px",
                backgroundColor: coupon ? "#f9fafb" : "#fff",
                border: coupon ? "2px solid #10b981" : "2px solid #e5e7eb"
              }}
              whileFocus={!coupon ? { borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" } : {}}
            />
            {coupon ? (
              <motion.button
                onClick={removeCoupon}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: "16px 24px",
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px"
                }}
              >
                Remove
              </motion.button>
            ) : (
              <motion.button
                onClick={handleApplyCoupon}
                disabled={applyingCoupon}
                whileHover={!applyingCoupon ? { scale: 1.05 } : {}}
                whileTap={!applyingCoupon ? { scale: 0.95 } : {}}
                style={{
                  padding: "16px 24px",
                  backgroundColor: applyingCoupon ? "#9ca3af" : "#8b5cf6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  cursor: applyingCoupon ? "default" : "pointer",
                  fontWeight: "600",
                  fontSize: "14px"
                }}
              >
                {applyingCoupon ? "Applying..." : "Apply"}
              </motion.button>
            )}
          </div>

          {coupon && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: "16px",
                padding: "16px",
                backgroundColor: "#dcfce7",
                borderRadius: "12px",
                border: "2px solid #10b981",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "12px"
              }}
            >
              <div>
                <span style={{ fontWeight: "700", color: "#166534", fontSize: "15px" }}>
                  ✅ Coupon Applied: {couponCode}
                </span>
                <div style={{ fontSize: "13px", color: "#166534", marginTop: "4px" }}>
                  {coupon.discountType === "percentage" ? `${coupon.discountValue}% off` : `₹${coupon.discountValue} off`}
                </div>
              </div>
              <div style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "#166534"
              }}>
                -₹{discount.toFixed(2)}
              </div>
            </motion.div>
          )}

          {couponMessage && !coupon && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: "16px",
                padding: "14px",
                backgroundColor: "#fee2e2",
                borderRadius: "12px",
                border: "2px solid #ef4444",
                fontSize: "14px",
                color: "#dc2626",
                fontWeight: "500"
              }}
            >
              ❌ {couponMessage}
            </motion.div>
          )}
        </div>

        {/* PAYMENT METHOD */}
        <div style={{ marginTop: "40px" }}>
          <Title text1={"PAYMENT_"} text2={"METHOD"} />
          
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "20px",
          }}>
            {paymentMethods.map((item) => (
              <motion.div
                key={item.id}
                onClick={() => setMethod(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  border: `2px solid ${method === item.id ? item.color : "#e5e7eb"}`,
                  padding: "18px 24px",
                  borderRadius: "14px",
                  cursor: "pointer",
                  backgroundColor: method === item.id ? `${item.color}10` : "#fff",
                  transition: "all 0.3s ease",
                  boxShadow: method === item.id ? `0 4px 12px ${item.color}30` : "none",
                }}
              >
                <div style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: `2px solid ${method === item.id ? item.color : "#d1d5db"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: method === item.id ? item.color : "transparent",
                  transition: "all 0.3s ease",
                }}>
                  {method === item.id && <span style={{ color: "#fff", fontSize: "12px" }}>✓</span>}
                </div>
                <span style={{ fontSize: "24px" }}>{item.icon}</span>
                <span style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  color: method === item.id ? "#1f2937" : "#6b7280",
                }}>
                  {item.label}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.button
            type="submit"
            onClick={onSubmitHandler}
            disabled={isSubmitting}
            whileHover={!isSubmitting ? { scale: 1.02, boxShadow: "0 8px 25px rgba(255,111,97,0.3)" } : {}}
            whileTap={!isSubmitting ? { scale: 0.98 } : {}}
            style={{
              width: "100%",
              backgroundColor: isSubmitting ? "#10b981" : "#ff6f61",
              color: "#fff",
              padding: "18px",
              fontSize: "16px",
              border: "none",
              borderRadius: "14px",
              cursor: isSubmitting ? "default" : "pointer",
              fontWeight: "700",
              boxShadow: "0 4px 15px rgba(255,111,97,0.2)",
              marginTop: "32px",
              transition: "all 0.3s ease",
            }}
          >
            {isSubmitting ? "✓ Order Placed!" : "PLACE ORDER →"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Placeorder;
