import React, { useContext, useState, useEffect } from "react";
import { Shopcontext } from "../context/shopcontext";
import Title from "../componet/title";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { backendUrl, token, navigate } = useContext(Shopcontext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
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

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: ""
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadUserData();
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
      console.error("Error loading user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      console.error("Error updating profile:", error);
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

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "400px" 
      }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={titleStyle}>
        <Title text1="MY_" text2="PROFILE" />
      </div>

      <div style={contentStyle}>
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Personal Information</h3>
          
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Enter your name"
              />
            ) : (
              <p style={valueStyle}>{userData.name}</p>
            )}
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Email:</label>
            <p style={valueStyle}>{userData.email}</p>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Phone:</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Enter your phone number"
              />
            ) : (
              <p style={valueStyle}>{userData.phone || "Not provided"}</p>
            )}
          </div>
        </div>

        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Address Information</h3>
          
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Street:</label>
            {isEditing ? (
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Enter street address"
              />
            ) : (
              <p style={valueStyle}>{userData.address.street || "Not provided"}</p>
            )}
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>City:</label>
            {isEditing ? (
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Enter city"
              />
            ) : (
              <p style={valueStyle}>{userData.address.city || "Not provided"}</p>
            )}
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>State:</label>
            {isEditing ? (
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Enter state"
              />
            ) : (
              <p style={valueStyle}>{userData.address.state || "Not provided"}</p>
            )}
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Zip Code:</label>
            {isEditing ? (
              <input
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Enter zip code"
              />
            ) : (
              <p style={valueStyle}>{userData.address.zipcode || "Not provided"}</p>
            )}
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Country:</label>
            {isEditing ? (
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                style={inputStyle}
                placeholder="Enter country"
              />
            ) : (
              <p style={valueStyle}>{userData.address.country || "Not provided"}</p>
            )}
          </div>
        </div>

        <div style={buttonGroupStyle}>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              style={editButtonStyle}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                style={saveButtonStyle}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                onClick={handleCancel}
                style={cancelButtonStyle}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  maxWidth: "800px",
  margin: "0 auto",
  padding: "20px",
  minHeight: "60vh"
};

const titleStyle = {
  textAlign: "center",
  marginBottom: "40px"
};

const contentStyle = {
  backgroundColor: "#fff",
  borderRadius: "12px",
  padding: "30px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
};

const sectionStyle = {
  marginBottom: "30px"
};

const sectionTitleStyle = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#1f2937",
  marginBottom: "20px",
  borderBottom: "2px solid #e5e7eb",
  paddingBottom: "10px"
};

const fieldGroupStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "15px",
  padding: "10px 0",
  borderBottom: "1px solid #f3f4f6"
};

const labelStyle = {
  fontWeight: "600",
  color: "#374151",
  minWidth: "120px",
  marginRight: "20px"
};

const valueStyle = {
  color: "#6b7280",
  margin: "0",
  flex: "1"
};

const inputStyle = {
  flex: "1",
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s",
  ":focus": {
    borderColor: "#3b82f6"
  }
};

const buttonGroupStyle = {
  display: "flex",
  gap: "15px",
  justifyContent: "center",
  marginTop: "30px"
};

const editButtonStyle = {
  backgroundColor: "#3b82f6",
  color: "#fff",
  border: "none",
  padding: "12px 24px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background-color 0.2s",
  ":hover": {
    backgroundColor: "#2563eb"
  }
};

const saveButtonStyle = {
  backgroundColor: "#10b981",
  color: "#fff",
  border: "none",
  padding: "12px 24px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background-color 0.2s",
  ":hover": {
    backgroundColor: "#059669"
  },
  ":disabled": {
    backgroundColor: "#9ca3af",
    cursor: "not-allowed"
  }
};

const cancelButtonStyle = {
  backgroundColor: "#6b7280",
  color: "#fff",
  border: "none",
  padding: "12px 24px",
  borderRadius: "6px",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  transition: "background-color 0.2s",
  ":hover": {
    backgroundColor: "#4b5563"
  }
};

export default Profile; 