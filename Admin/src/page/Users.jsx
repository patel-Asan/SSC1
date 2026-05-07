import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import adminApi from "../services/adminApi.js";
import { Users as UsersIcon, Shield, Search } from "lucide-react";

const Users = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
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
      toast.error(error.message || "Failed to update user status");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid #e5e7eb", borderTopColor: "#8b5cf6", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
          <p style={{ color: "#6b7280" }}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Shield size={22} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", margin: "0 0 2px 0" }}>User Management</h1>
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>{users.length} registered users</p>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: "14px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #f3f4f6" }}>
        <div style={{ position: "relative", marginBottom: "16px" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
          <input
            type="text" placeholder="Search by name or email..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%", padding: "12px 14px 12px 44px", borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "14px", outline: "none", transition: "all 0.2s ease" }}
            onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: isMobile ? "500px" : "auto" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                {["User", "Email", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user._id} style={{ borderBottom: "1px solid #f3f4f6", transition: "background 0.2s" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "#f9fafb"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700", fontSize: "14px" }}>
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{user.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "14px", color: "#6b7280" }}>{user.email}</td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      padding: "4px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600",
                      background: user.status === 'active' ? "#dcfce7" : user.status === 'suspended' ? "#fef3c7" : "#fee2e2",
                      color: user.status === 'active' ? "#166534" : user.status === 'suspended' ? "#92400e" : "#dc2626",
                    }}>{user.status}</span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <select
                      value={user.status}
                      onChange={(e) => updateUserStatus(user._id, e.target.value)}
                      style={{
                        padding: "8px 12px", borderRadius: "8px", border: "1px solid #e5e7eb",
                        fontSize: "13px", outline: "none", cursor: "pointer", background: "#fff"
                      }}
                    >
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                      <option value="banned">Banned</option>
                    </select>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} style={{ padding: "40px 16px", textAlign: "center", color: "#6b7280" }}>
                    {searchTerm ? "No users match your search" : "No users found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
