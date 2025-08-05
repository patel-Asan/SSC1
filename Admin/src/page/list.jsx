import React, { useEffect, useState } from "react";
import { currency } from "../App";
import { ToastContainer, toast } from "react-toastify";
import apiService from "../services/api.js";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts();
      
      if (response.success) {
        setList(response.products);
      } else {
        toast.error(response.message || "Failed to fetch products");
      }
    } catch (error) {
      console.error("Fetch list error:", error);
      toast.error(error.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id, productName) => {
    console.log("🗑️ Starting remove for:", productName, "ID:", id);
    
    if (!token) {
      alert("No authentication token. Please login again.");
      return;
    }
    
    try {
      // Direct fetch call to bypass any API service issues
      const response = await fetch('http://localhost:4000/api/product/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ id })
      });
      
      const data = await response.json();
      console.log("📝 Remove response:", data);
      console.log("📊 Status:", response.status);
      
      if (response.ok && data.success) {
        alert(`"${productName}" removed successfully!`);
        // Refresh the list
        fetchList();
      } else {
        alert(`Failed to remove: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("❌ Remove error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "400px"
      }}>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "2rem"
      }}>
        <h2 style={{ 
          fontSize: "1.875rem", 
          fontWeight: "700",
          color: "#111827",
          margin: 0
        }}>
          All Product List ({list.length} products)
        </h2>
        
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={fetchList}
            style={{
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "0.375rem",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              fontSize: "0.875rem",
              fontWeight: "600",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#059669"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#10b981"}
          >
            Refresh List
          </button>
          
          {list.length > 0 && (
            <button
              onClick={() => {
                const firstProduct = list[0];
                console.log("🧪 Test remove for:", firstProduct);
                if (confirm(`Test remove "${firstProduct.name}"?`)) {
                  removeProduct(firstProduct._id, firstProduct.name);
                }
              }}
              style={{
                backgroundColor: "#f59e0b",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "600",
                transition: "background-color 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = "#d97706"}
              onMouseLeave={(e) => e.target.style.backgroundColor = "#f59e0b"}
            >
              Test Remove
            </button>
          )}
        </div>
      </div>
      
      {/* Debug Info */}
      <div style={{
        backgroundColor: "#f3f4f6",
        padding: "1rem",
        borderRadius: "0.5rem",
        marginBottom: "1rem",
        fontSize: "0.875rem",
        color: "#374151"
      }}>
        <strong>Debug Info:</strong>
        <br />
        • Products: {list.length}
        <br />
        • Token: {token ? "✅ Present" : "❌ Missing"}
        <br />
        • Loading: {loading ? "Yes" : "No"}
        <br />
        • First product ID: {list.length > 0 ? list[0]._id : "None"}
      </div>
      
      {list.length > 0 ? (
        <div style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))"
        }}>
          {list.map((item, index) => (
            <div key={item._id || index} style={{
              backgroundColor: "white",
              borderRadius: "0.75rem",
              padding: "1rem",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              border: "1px solid #e5e7eb"
            }}>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <img 
                  src={item.image[0]} 
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "0.5rem"
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                  }}
                />
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    fontSize: "1rem", 
                    fontWeight: "600", 
                    marginBottom: "0.5rem",
                    color: "#111827"
                  }}>
                    {item.name}
                  </h3>
                  <p style={{ 
                    fontSize: "0.875rem", 
                    color: "#6b7280",
                    marginBottom: "0.25rem"
                  }}>
                    Category: {item.category}
                  </p>
                  <p style={{ 
                    fontSize: "1rem", 
                    fontWeight: "600",
                    color: "#059669"
                  }}>
                    {currency}{item.price}
                  </p>
                </div>
                <button
                  onClick={() => {
                    console.log("🔘 Remove button clicked!");
                    console.log("Product:", item);
                    console.log("Token present:", !!token);
                    
                    if (window.confirm(`Are you sure you want to remove "${item.name}"?`)) {
                      console.log("✅ User confirmed removal");
                      removeProduct(item._id, item.name);
                    } else {
                      console.log("❌ User cancelled removal");
                    }
                  }}
                  style={{
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "0.375rem",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    transition: "background-color 0.2s",
                    minWidth: "100px"
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = "#dc2626"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "#ef4444"}
                >
                  🗑️ REMOVE
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ 
          textAlign: "center", 
          padding: "3rem",
          color: "#6b7280"
        }}>
          <div style={{
            fontSize: "3rem",
            marginBottom: "1rem",
            opacity: 0.5
          }}>
            📦
          </div>
          <h3 style={{ marginBottom: "0.5rem", color: "#374151" }}>
            No products found
          </h3>
          <p>Add some products to see them here.</p>
        </div>
      )}
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default List;