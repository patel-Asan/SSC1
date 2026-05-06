import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import adminApi from "../services/adminApi.js";

const Users = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = window.innerWidth <= 768;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllUsers();
      
      if (response.success) {
        setUsers(response.data);
      } else {
        toast.error(response.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      toast.error(error.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserStatus = async (userId, newStatus) => {
    try {
      const response = await adminApi.updateUserStatus(userId, newStatus);
      
      if (response.success) {
        toast.success(`User status updated to ${newStatus}`);
        fetchUsers();
      } else {
        toast.error(response.message || "Failed to update user status");
      }
    } catch (error) {
      console.error("Update user status error:", error);
      toast.error(error.message || "Failed to update user status");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "400px" 
      }}>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? "16px" : "20px" }}>
      <h1 style={{ fontSize: isMobile ? "1.25rem" : "1.5rem" }}>User Management ({users.length} users)</h1>
      
      <div style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        padding: isMobile ? "16px" : "24px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflowX: "auto"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "600px" : "auto" }}>
          <thead>
            <tr>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>User</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Email</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Status</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                  {user.name}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                  {user.email}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                  <span style={{
                    padding: "4px 8px",
                    borderRadius: "12px",
                    fontSize: "0.75rem",
                    backgroundColor: user.status === 'active' ? "#dcfce7" : "#fee2e2",
                    color: user.status === 'active' ? "#166534" : "#dc2626"
                  }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}>
                  <select
                    value={user.status}
                    onChange={(e) => updateUserStatus(user._id, e.target.value)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db"
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                    <option value="banned">Banned</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Users; 