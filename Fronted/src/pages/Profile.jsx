import React, { useContext, useState, useEffect } from "react";
import { Shopcontext } from "../context/shopcontext";
import Title from "../componet/title";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const Profile = () => {
  const { backendUrl, token, navigate, currency } = useContext(Shopcontext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
    isDefault: false
  });
  
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: ""
    }
  });

  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    reviews: 0,
    totalSpent: 0
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadUserData();
    loadUserStats();
  }, [token]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { token }
      });

      if (response.data.success) {
        const user = response.data.user;
        setUserData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || {
            street: "",
            city: "",
            state: "",
            zipcode: "",
            country: ""
          }
        });
        
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipcode: user.address?.zipcode || "",
          country: user.address?.country || ""
        });
      } else {
        toast.error("Failed to load user data");
      }
    } catch (error) {
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/stats`, {
        headers: { token }
      });
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Failed to load stats");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipcode: formData.zipcode,
          country: formData.country
        }
      };

      const response = await axios.put(`${backendUrl}/api/user/profile`, updateData, {
        headers: { token }
      });

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setUserData({
          ...userData,
          name: formData.name,
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipcode: formData.zipcode,
            country: formData.country
          }
        });
        setIsEditing(false);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      street: userData.address.street,
      city: userData.address.city,
      state: userData.address.state,
      zipcode: userData.address.zipcode,
      country: userData.address.country
    });
    setIsEditing(false);
  };

  const inputStyle = {
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
    backgroundColor: "#fff",
    color: "#1f2937",
    width: "100%",
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: 40,
            height: 40,
            border: "3px solid #e5e7eb",
            borderTop: "3px solid #ff6f61",
            borderRadius: "50%",
          }}
        />
      </motion.div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "address", label: "Address", icon: "📍" },
    { id: "settings", label: "Settings", icon: "⚙️" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "'Manrope', sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ marginBottom: "40px", paddingTop: "40px" }}
      >
        <Title text1="MY_" text2="PROFILE" />
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {[
          { label: "Total Orders", value: stats.orders, icon: "📦", color: "#3b82f6" },
          { label: "Total Spent", value: `${currency}${stats.totalSpent.toLocaleString()}`, icon: "💰", color: "#10b981" },
          { label: "Wishlist Items", value: stats.wishlist, icon: "❤️", color: "#ef4444" },
          { label: "Reviews", value: stats.reviews, icon: "⭐", color: "#f59e0b" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            style={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div style={{
              width: "50px",
              height: "50px",
              borderRadius: "12px",
              backgroundColor: `${stat.color}15`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
            }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "4px" }}>{stat.label}</p>
              <p style={{ fontSize: "24px", fontWeight: "700", color: "#1f2937" }}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          backgroundColor: "#fff",
          borderRadius: "24px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Tabs */}
        <div style={{
          display: "flex",
          borderBottom: "2px solid #f3f4f6",
          padding: "0 30px",
          backgroundColor: "#fafbfc",
        }}>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ backgroundColor: "#f3f4f6" }}
              style={{
                padding: "20px 24px",
                border: "none",
                backgroundColor: "transparent",
                fontSize: "14px",
                fontWeight: activeTab === tab.id ? "700" : "600",
                color: activeTab === tab.id ? "#ff6f61" : "#6b7280",
                borderBottom: activeTab === tab.id ? "3px solid #ff6f61" : "3px solid transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.3s ease",
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{ padding: "40px" }}
          >
            {activeTab === "profile" && (
              <>
                {/* Profile Header */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "24px",
                  marginBottom: "40px",
                  paddingBottom: "30px",
                  borderBottom: "1px solid #e5e7eb",
                }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      fontSize: "40px",
                      fontWeight: "700",
                      boxShadow: "0 8px 20px rgba(255,111,97,0.3)",
                    }}
                  >
                    {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
                  </motion.div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: "28px", fontWeight: "700", color: "#1f2937", marginBottom: "8px" }}>
                      {userData.name || "User"}
                    </h3>
                    <p style={{ color: "#6b7280", fontSize: "15px", marginBottom: "4px" }}>{userData.email}</p>
                    <p style={{ color: "#9ca3af", fontSize: "13px" }}>Member since 2024</p>
                  </div>
                  {!isEditing && (
                    <motion.button
                      onClick={() => setIsEditing(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        backgroundColor: "#ff6f61",
                        color: "#fff",
                        border: "none",
                        padding: "12px 28px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 4px 15px rgba(255,111,97,0.3)",
                      }}
                    >
                      Edit Profile
                    </motion.button>
                  )}
                </div>

                {/* Personal Information */}
                <div style={{ marginBottom: "32px" }}>
                  <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937", marginBottom: "24px" }}>
                    Personal Information
                  </h4>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
                      <div>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b7280", display: "block", marginBottom: "8px" }}>Full Name</label>
                        {isEditing ? (
                          <motion.input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            style={inputStyle}
                            whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
                          />
                        ) : (
                          <p style={{ padding: "12px 0", fontSize: "15px", color: "#1f2937", fontWeight: "500" }}>{userData.name || "Not provided"}</p>
                        )}
                      </div>
                      <div>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b7280", display: "block", marginBottom: "8px" }}>Email Address</label>
                        <p style={{ padding: "12px 0", fontSize: "15px", color: "#6b7280", fontWeight: "500" }}>{userData.email}</p>
                      </div>
                    </div>

                    <div>
                      <label style={{ fontSize: "13px", fontWeight: "600", color: "#6b7280", display: "block", marginBottom: "8px" }}>Phone Number</label>
                      {isEditing ? (
                        <motion.input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          style={{ ...inputStyle, maxWidth: "400px" }}
                          whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
                        />
                      ) : (
                        <p style={{ padding: "12px 0", fontSize: "15px", color: "#1f2937", fontWeight: "500" }}>{userData.phone || "Not provided"}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: "flex", gap: "12px", justifyContent: "flex-end", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}
                  >
                    <motion.button
                      onClick={handleSave}
                      disabled={saving}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        backgroundColor: saving ? "#10b981" : "#ff6f61",
                        color: "#fff",
                        border: "none",
                        padding: "14px 32px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "700",
                        cursor: saving ? "default" : "pointer",
                        boxShadow: "0 4px 15px rgba(255,111,97,0.3)",
                      }}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </motion.button>
                    <motion.button
                      onClick={handleCancel}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        backgroundColor: "#fff",
                        color: "#6b7280",
                        border: "2px solid #e5e7eb",
                        padding: "14px 32px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </motion.button>
                  </motion.div>
                )}
              </>
            )}

            {activeTab === "address" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                  <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937", margin: 0 }}>
                    📍 Delivery Address
                  </h4>
                  {!isEditing && (
                    <motion.button
                      onClick={() => setIsEditing(true)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      style={{
                        backgroundColor: "#ff6f61",
                        color: "#fff",
                        border: "none",
                        padding: "10px 24px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 4px 15px rgba(255,111,97,0.3)",
                      }}
                    >
                      ✏️ Edit Address
                    </motion.button>
                  )}
                </div>

                {/* Address Card */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
                    borderRadius: "16px",
                    padding: "24px",
                    border: "2px solid #bbf7d0",
                    marginBottom: "20px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                    <div style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}>
                      <span style={{ fontSize: "20px" }}>🏠</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      {isEditing ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          <div>
                            <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Street Address</label>
                            <motion.input
                              type="text"
                              name="street"
                              value={formData.street}
                              onChange={handleInputChange}
                              placeholder="House No, Building, Street"
                              style={inputStyle}
                              whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
                            />
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div>
                              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>City</label>
                              <motion.input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="City"
                                style={inputStyle}
                                whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>State</label>
                              <motion.input
                                type="text"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                placeholder="State"
                                style={inputStyle}
                                whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
                              />
                            </div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div>
                              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Pin Code</label>
                              <motion.input
                                type="text"
                                name="zipcode"
                                value={formData.zipcode}
                                onChange={handleInputChange}
                                placeholder="Pin Code"
                                style={inputStyle}
                                whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
                              />
                            </div>
                            <div>
                              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Country</label>
                              <motion.input
                                type="text"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                placeholder="Country"
                                style={inputStyle}
                                whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p style={{ fontSize: "15px", color: "#1f2937", fontWeight: "600", marginBottom: "4px" }}>
                            {userData.address.street || "Street not provided"}
                          </p>
                          <p style={{ fontSize: "14px", color: "#374151", marginBottom: "2px" }}>
                            {[userData.address.city, userData.address.state].filter(Boolean).join(", ") || "City/State not provided"}
                          </p>
                          <p style={{ fontSize: "14px", color: "#374151", marginBottom: "2px" }}>
                            {[userData.address.zipcode, userData.address.country].filter(Boolean).join(", ") || "Pin/Country not provided"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Save/Cancel for Address Edit */}
                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}
                  >
                    <motion.button
                      onClick={handleSave}
                      disabled={saving}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        backgroundColor: saving ? "#10b981" : "#ff6f61",
                        color: "#fff",
                        border: "none",
                        padding: "14px 32px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "700",
                        cursor: saving ? "default" : "pointer",
                        boxShadow: "0 4px 15px rgba(255,111,97,0.3)",
                      }}
                    >
                      {saving ? "Saving..." : "💾 Save Address"}
                    </motion.button>
                    <motion.button
                      onClick={handleCancel}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        backgroundColor: "#fff",
                        color: "#6b7280",
                        border: "2px solid #e5e7eb",
                        padding: "14px 32px",
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </motion.button>
                  </motion.div>
                )}
              </>
            )}


            {activeTab === "settings" && (
              <div>
                <h4 style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937", marginBottom: "24px" }}>
                  Account Settings
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { label: "Email Notifications", description: "Receive updates about your orders" },
                    { label: "SMS Notifications", description: "Get text updates for delivery" },
                    { label: "Two-Factor Authentication", description: "Add extra security to your account" },
                  ].map((setting, index) => (
                    <motion.div
                      key={setting.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "20px",
                        backgroundColor: "#f9fafb",
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <div>
                        <p style={{ fontWeight: "600", color: "#1f2937", marginBottom: "4px" }}>{setting.label}</p>
                        <p style={{ fontSize: "13px", color: "#6b7280" }}>{setting.description}</p>
                      </div>
                      <motion.input
                        type="checkbox"
                        whileTap={{ scale: 0.9 }}
                        style={{ width: "24px", height: "24px", accentColor: "#ff6f61", cursor: "pointer" }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default Profile;