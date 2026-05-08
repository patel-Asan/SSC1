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
          },
          addresses: user.addresses || []
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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const inputStyle = {
    padding: "14px 18px",
    border: "2px solid #e5e7eb",
    borderRadius: "12px",
    fontSize: "14px",
    outline: "none",
    transition: "all 0.3s ease",
    backgroundColor: "#fff",
    color: "#1f2937",
    width: "100%",
    boxSizing: "border-box",
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
                <div style={{
                  marginBottom: "32px",
                  background: "#fafbfc",
                  borderRadius: "16px",
                  padding: "28px",
                  border: "1px solid #f3f4f6",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "10px",
                      background: "linear-gradient(135deg, #ff6f61, #ff8a7a)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px",
                    }}>👤</div>
                    <h4 style={{ fontSize: "17px", fontWeight: "700", color: "#1f2937", margin: 0 }}>
                      Personal Information
                    </h4>
                  </div>

                  <div style={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                    gap: "18px",
                  }}>
                    <div style={{
                      background: "#fff", borderRadius: "12px", padding: "18px 20px",
                      border: "1px solid #e5e7eb",
                    }}>
                      <label style={{ fontSize: "12px", fontWeight: "600", color: "#9ca3af", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        📛 Full Name
                      </label>
                      {isEditing ? (
                        <motion.input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          style={{ ...inputStyle, border: "2px solid #e5e7eb", padding: "12px 16px" }}
                          whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
                        />
                      ) : (
                        <p style={{ margin: 0, fontSize: "16px", color: "#1f2937", fontWeight: "600" }}>{userData.name || "Not provided"}</p>
                      )}
                    </div>

                    <div style={{
                      background: "#fff", borderRadius: "12px", padding: "18px 20px",
                      border: "1px solid #e5e7eb",
                    }}>
                      <label style={{ fontSize: "12px", fontWeight: "600", color: "#9ca3af", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        ✉️ Email Address
                      </label>
                      <p style={{ margin: 0, fontSize: "16px", color: "#6b7280", fontWeight: "500" }}>{userData.email}</p>
                    </div>

                    <div style={{
                      background: "#fff", borderRadius: "12px", padding: "18px 20px",
                      border: "1px solid #e5e7eb",
                    }}>
                      <label style={{ fontSize: "12px", fontWeight: "600", color: "#9ca3af", display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        📞 Phone Number
                      </label>
                      {isEditing ? (
                        <motion.input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          style={{ ...inputStyle, border: "2px solid #e5e7eb", padding: "12px 16px" }}
                          whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
                        />
                      ) : (
                        <p style={{ margin: 0, fontSize: "16px", color: "#1f2937", fontWeight: "600" }}>{userData.phone || "Not provided"}</p>
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
                  <motion.button
                    onClick={() => {
                      setAddressForm({ label: "Home", street: "", city: "", state: "", zipcode: "", country: "India", phone: "", isDefault: false });
                      setEditingAddressId(null);
                      setShowAddressModal(true);
                    }}
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
                    + Add New
                  </motion.button>
                </div>

                {/* Address List */}
                {(!userData.addresses || userData.addresses.length === 0) ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      background: "#f9fafb",
                      borderRadius: "16px",
                      border: "2px dashed #e5e7eb",
                    }}
                  >
                    <span style={{ fontSize: "40px" }}>📍</span>
                    <p style={{ color: "#6b7280", marginTop: "12px", fontSize: "14px" }}>
                      No saved addresses yet. Click "Add New" to add one.
                    </p>
                  </motion.div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {userData.addresses.map((addr) => (
                      <motion.div
                        key={addr._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          background: addr.isDefault ? "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)" : "#fff",
                          borderRadius: "16px",
                          padding: "20px",
                          border: `2px solid ${addr.isDefault ? "#bbf7d0" : "#e5e7eb"}`,
                          position: "relative",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                          <div style={{
                            width: "44px", height: "44px", borderRadius: "12px",
                            background: addr.label === "Office" ? "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)" :
                              addr.label === "Other" ? "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)" :
                              "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          }}>
                            <span style={{ fontSize: "20px" }}>
                              {addr.label === "Office" ? "🏢" : addr.label === "Other" ? "📍" : "🏠"}
                            </span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "4px" }}>
                              <span style={{ fontWeight: "700", fontSize: "15px", color: "#1f2937" }}>
                                {addr.label || "Home"}
                              </span>
                              {addr.isDefault && (
                                <span style={{ fontSize: "11px", background: "#10b981", color: "#fff", padding: "2px 10px", borderRadius: "4px", fontWeight: "600" }}>
                                  Default
                                </span>
                              )}
                            </div>
                            <p style={{ margin: "2px 0", fontSize: "14px", color: "#374151" }}>
                              {addr.street}, {addr.city}, {addr.state} - {addr.zipcode}
                            </p>
                            {addr.phone && (
                              <p style={{ margin: "2px 0", fontSize: "13px", color: "#6b7280" }}>
                                📞 {addr.phone}
                              </p>
                            )}
                          </div>
                          <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                            <motion.button
                              onClick={() => {
                                setAddressForm({ ...addr });
                                setEditingAddressId(addr._id);
                                setShowAddressModal(true);
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              style={{
                                background: "#f3f4f6", border: "none", borderRadius: "8px",
                                padding: "8px", cursor: "pointer", fontSize: "14px",
                              }}
                              title="Edit"
                            >
                              ✏️
                            </motion.button>
                            <motion.button
                              onClick={async () => {
                                if (!confirm("Delete this address?")) return;
                                try {
                                  const delRes = await axios.delete(`${backendUrl}/api/user/address/${addr._id}`, { headers: { token } });
                                  toast.success("Address deleted");
                                  if (delRes.data.addresses) {
                                    setUserData(prev => ({ ...prev, addresses: delRes.data.addresses }));
                                  } else {
                                    loadUserData();
                                  }
                                } catch (err) {
                                  toast.error("Failed to delete address");
                                }
                              }}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              style={{
                                background: "#fee2e2", border: "none", borderRadius: "8px",
                                padding: "8px", cursor: "pointer", fontSize: "14px",
                              }}
                              title="Delete"
                            >
                              🗑️
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Add/Edit Address Modal */}
                <AnimatePresence>
                  {showAddressModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: isMobile ? "flex-start" : "center",
                        justifyContent: "center",
                        zIndex: 1000,
                        padding: isMobile ? "12px" : "20px",
                        paddingTop: isMobile ? "140px" : "20px",
                        backdropFilter: "blur(4px)",
                      }}
                      onClick={() => setShowAddressModal(false)}
                    >
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          background: "#fff", borderRadius: "24px",
                          padding: isMobile ? "24px" : "36px",
                          maxWidth: "560px", width: "100%",
                          maxHeight: "90vh", overflowY: "auto",
                          boxShadow: "0 25px 60px -12px rgba(0,0,0,0.3)",
                        }}
                      >
                        {/* Header */}
                        <div style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          marginBottom: "28px", paddingBottom: "20px",
                          borderBottom: "2px solid #f3f4f6",
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{
                              width: "40px", height: "40px", borderRadius: "12px",
                              background: "linear-gradient(135deg, #ff6f61, #ff8a7a)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "18px",
                            }}>📍</div>
                            <div>
                              <h4 style={{ margin: 0, fontSize: "18px", fontWeight: "700", color: "#1f2937" }}>
                                {editingAddressId ? "Edit Address" : "Add New Address"}
                              </h4>
                              <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#9ca3af" }}>
                                Fill in the details below
                              </p>
                            </div>
                          </div>
                          <motion.div
                            onClick={() => setShowAddressModal(false)}
                            whileHover={{ scale: 1.1, backgroundColor: "#fee2e2" }}
                            whileTap={{ scale: 0.9 }}
                            style={{
                              width: "36px", height: "36px", borderRadius: "50%",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              cursor: "pointer", fontSize: "20px", color: "#6b7280",
                              transition: "all 0.2s ease",
                            }}
                          >✕</motion.div>
                        </div>

                        {/* Label */}
                        <div style={{ marginBottom: "20px" }}>
                          <label style={{
                            fontSize: "13px", fontWeight: "600", color: "#374151",
                            display: "block", marginBottom: "10px",
                          }}>
                            🏷️ Address Label
                          </label>
                          <div style={{
                            display: "grid",
                            gridTemplateColumns: isMobile ? "1fr 1fr 1fr" : "1fr 1fr 1fr",
                            gap: "10px",
                          }}>
                            {["Home", "Office", "Other"].map(lbl => (
                              <motion.div
                                key={lbl}
                                onClick={() => setAddressForm(prev => ({ ...prev, label: lbl }))}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                style={{
                                  padding: "14px", borderRadius: "12px", cursor: "pointer",
                                  textAlign: "center", fontWeight: "600", fontSize: "13px",
                                  border: `2px solid ${addressForm.label === lbl ? "#ff6f61" : "#e5e7eb"}`,
                                  background: addressForm.label === lbl ? "rgba(255,111,97,0.06)" : "#fff",
                                  color: addressForm.label === lbl ? "#ff6f61" : "#6b7280",
                                  transition: "all 0.2s ease",
                                  boxShadow: addressForm.label === lbl ? "0 4px 12px rgba(255,111,97,0.15)" : "none",
                                }}
                              >
                                <div style={{ fontSize: "20px", marginBottom: "4px" }}>
                                  {lbl === "Home" ? "🏠" : lbl === "Office" ? "🏢" : "📍"}
                                </div>
                                {lbl}
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        {/* Street */}
                        <div style={{ marginBottom: "16px" }}>
                          <label style={{
                            fontSize: "13px", fontWeight: "600", color: "#374151",
                            display: "block", marginBottom: "8px",
                          }}>
                            🏠 Street Address <span style={{ color: "#ef4444" }}>*</span>
                          </label>
                          <motion.input
                            type="text" placeholder="House No, Building, Street"
                            value={addressForm.street}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                            style={inputStyle}
                            whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
                          />
                        </div>

                        {/* City + State */}
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                          gap: "14px", marginBottom: "16px",
                        }}>
                          <div>
                            <label style={{
                              fontSize: "13px", fontWeight: "600", color: "#374151",
                              display: "block", marginBottom: "8px",
                            }}>
                              🏙️ City <span style={{ color: "#ef4444" }}>*</span>
                            </label>
                            <motion.input
                              type="text" placeholder="e.g. Mumbai"
                              value={addressForm.city}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                              style={inputStyle}
                              whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
                            />
                          </div>
                          <div>
                            <label style={{
                              fontSize: "13px", fontWeight: "600", color: "#374151",
                              display: "block", marginBottom: "8px",
                            }}>
                              🗺️ State <span style={{ color: "#ef4444" }}>*</span>
                            </label>
                            <motion.input
                              type="text" placeholder="e.g. Maharashtra"
                              value={addressForm.state}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                              style={inputStyle}
                              whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
                            />
                          </div>
                        </div>

                        {/* Pin + Country */}
                        <div style={{
                          display: "grid",
                          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                          gap: "14px", marginBottom: "16px",
                        }}>
                          <div>
                            <label style={{
                              fontSize: "13px", fontWeight: "600", color: "#374151",
                              display: "block", marginBottom: "8px",
                            }}>
                              📮 Pin Code <span style={{ color: "#ef4444" }}>*</span>
                            </label>
                            <motion.input
                              type="text" placeholder="e.g. 400001"
                              value={addressForm.zipcode}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, zipcode: e.target.value }))}
                              style={inputStyle}
                              whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
                            />
                          </div>
                          <div>
                            <label style={{
                              fontSize: "13px", fontWeight: "600", color: "#374151",
                              display: "block", marginBottom: "8px",
                            }}>
                              🌍 Country
                            </label>
                            <motion.input
                              type="text" placeholder="Country"
                              value={addressForm.country}
                              onChange={(e) => setAddressForm(prev => ({ ...prev, country: e.target.value }))}
                              style={inputStyle}
                              whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
                            />
                          </div>
                        </div>

                        {/* Mobile */}
                        <div style={{ marginBottom: "20px" }}>
                          <label style={{
                            fontSize: "13px", fontWeight: "600", color: "#374151",
                            display: "block", marginBottom: "8px",
                          }}>
                            📱 Mobile Number
                          </label>
                          <motion.input
                            type="tel" placeholder="+91 98765 43210"
                            value={addressForm.phone}
                            onChange={(e) => setAddressForm(prev => ({ ...prev, phone: e.target.value }))}
                            style={inputStyle}
                            whileFocus={{ borderColor: "#ff6f61", boxShadow: "0 0 0 3px rgba(255,111,97,0.1)" }}
                          />
                        </div>

                        {/* Default Checkbox */}
                        <div style={{
                          display: "flex", alignItems: "center", gap: "12px",
                          marginBottom: "28px", padding: "16px 20px",
                          background: addressForm.isDefault ? "#f0fdf4" : "#f9fafb",
                          borderRadius: "12px",
                          border: `2px solid ${addressForm.isDefault ? "#bbf7d0" : "#e5e7eb"}`,
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                          onClick={() => setAddressForm(prev => ({ ...prev, isDefault: !prev.isDefault }))}
                        >
                          <div style={{
                            width: "24px", height: "24px", borderRadius: "6px",
                            background: addressForm.isDefault ? "#10b981" : "#fff",
                            border: `2px solid ${addressForm.isDefault ? "#10b981" : "#d1d5db"}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.2s ease", flexShrink: 0,
                          }}>
                            {addressForm.isDefault && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                style={{ color: "#fff", fontSize: "14px", fontWeight: "700" }}
                              >✓</motion.span>
                            )}
                          </div>
                          <div>
                            <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                              Set as default address
                            </span>
                            <span style={{ fontSize: "12px", color: "#9ca3af", display: "block", marginTop: "2px" }}>
                              This address will be selected by default during checkout
                            </span>
                          </div>
                        </div>

                        {/* Buttons */}
                        <div style={{
                          display: "flex",
                          flexDirection: isMobile ? "column" : "row",
                          gap: "12px",
                        }}>
                          <motion.button
                            onClick={async () => {
                              if (!addressForm.street || !addressForm.city || !addressForm.state || !addressForm.zipcode) {
                                toast.error("Street, city, state and pin code are required");
                                return;
                              }
                              try {
                                let res;
                                if (editingAddressId) {
                                  res = await axios.put(`${backendUrl}/api/user/address/${editingAddressId}`, addressForm, { headers: { token } });
                                } else {
                                  res = await axios.post(`${backendUrl}/api/user/address`, addressForm, { headers: { token } });
                                }
                                if (res.data.success) {
                                  toast.success(editingAddressId ? "Address updated!" : "Address added!");
                                  setShowAddressModal(false);
                                  setUserData(prev => ({ ...prev, addresses: res.data.addresses }));
                                }
                              } catch (err) {
                                toast.error(err.response?.data?.message || "Failed to save address");
                              }
                            }}
                            whileHover={{ scale: isMobile ? 1.01 : 1.02, boxShadow: "0 8px 25px rgba(255,111,97,0.3)" }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                              flex: 1, padding: "16px",
                              background: "linear-gradient(135deg, #ff6f61, #ff8a7a)",
                              color: "#fff", border: "none", borderRadius: "14px",
                              fontWeight: "700", fontSize: "15px",
                              cursor: "pointer",
                              boxShadow: "0 4px 15px rgba(255,111,97,0.3)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              gap: "8px",
                            }}
                          >
                            💾 {editingAddressId ? "Update Address" : "Save Address"}
                          </motion.button>
                          <motion.button
                            onClick={() => setShowAddressModal(false)}
                            whileHover={{ scale: isMobile ? 1.01 : 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                              padding: isMobile ? "16px" : "16px 28px",
                              background: "#fff", color: "#6b7280",
                              border: "2px solid #e5e7eb", borderRadius: "14px",
                              fontWeight: "700", fontSize: "15px",
                              cursor: "pointer",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              gap: "6px",
                            }}
                          >
                            ✕ Cancel
                          </motion.button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
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