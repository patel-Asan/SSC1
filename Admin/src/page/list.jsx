import React, { useEffect, useState } from "react";
import { currency } from "../App";
import { ToastContainer, toast } from "react-toastify";
import apiService from "../services/api.js";
import Swal from "sweetalert2";
import { Search, Package, Grid, List as ListIcon, Trash2, RefreshCw, Edit3, Eye, Filter } from "lucide-react";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const isMobile = window.innerWidth <= 768;
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subCategory: "",
    sizes: [],
    bestseller: false
  });
  const [updating, setUpdating] = useState(false);

  const fetchList = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts();
      
      if (response.success) {
        const normalized = response.products.map(p => ({
          ...p,
          image: typeof p.image === 'string' ? p.image.split(',').filter(Boolean) : (Array.isArray(p.image) ? p.image : [])
        }));
        setList(normalized);
        setFilteredList(normalized);
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
    if (!token) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No authentication token. Please login again.', confirmButtonColor: '#ef4444' });
      return;
    }
    
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(`${backendUrl}/api/product/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({ id })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        Swal.fire({ icon: 'success', title: 'Deleted!', text: `"${productName}" removed successfully!`, timer: 2000, showConfirmButton: false });
        fetchList();
      } else {
        Swal.fire({ icon: 'error', title: 'Failed!', text: data.message || 'Unknown error', confirmButtonColor: '#ef4444' });
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error!', text: error.message, confirmButtonColor: '#ef4444' });
    }
  };

  // View product
  const openViewModal = (product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  // Edit product
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      category: product.category || "",
      subCategory: product.subCategory || "",
      sizes: product.sizes || [],
      bestseller: product.bestseller || false
    });
    setEditModalOpen(true);
  };

  const closeModals = () => {
    setViewModalOpen(false);
    setEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSizeToggle = (size) => {
    setEditFormData(prev => {
      const sizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes };
    });
  };

  const updateProduct = async () => {
    if (!selectedProduct || !token) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`http://localhost:4000/api/product/update/${selectedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({
          ...editFormData,
          price: Number(editFormData.price)
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success(`"${editFormData.name}" updated successfully!`);
        closeModals();
        fetchList(); // Refresh the list
      } else {
        toast.error(data.message || "Failed to update product");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.message || "Failed to update product");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Filter products based on search and category
  useEffect(() => {
    let filtered = list;
    
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    setFilteredList(filtered);
  }, [searchQuery, selectedCategory, list]);

  // Get unique categories
  const categories = ["all", ...new Set(list.map(item => item.category))];

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "400px",
        flexDirection: "column",
        gap: "16px"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          border: "3px solid #f3f4f6",
          borderTop: "3px solid #ff6f61",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }} />
        <p style={{ color: "#6b7280", fontWeight: 500 }}>Loading products...</p>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: isMobile ? "16px" : "32px", minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Header Section */}
      <div style={{
        background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
        borderRadius: isMobile ? "12px" : "20px",
        padding: isMobile ? "16px" : "28px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
        border: "1px solid #f3f4f6",
        marginBottom: isMobile ? "16px" : "24px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
          <div style={{
            width: isMobile ? "36px" : "44px",
            height: isMobile ? "36px" : "44px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}>
            <Package size={isMobile ? 18 : 24} />
          </div>
          <div>
            <h1 style={{ 
              fontSize: isMobile ? "1.25rem" : "1.5rem", 
              fontWeight: "800",
              color: "#1f2937",
              margin: "0 0 4px 0"
            }}>
              Product Management
            </h1>
            <p style={{ margin: 0, fontSize: isMobile ? "12px" : "14px", color: "#6b7280" }}>
              {list.length} products in inventory • {filteredList.length} shown
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          alignItems: "center"
        }}>
          {/* Search */}
          <div style={{
            flex: 1,
            minWidth: "280px",
            position: "relative"
          }}>
            <Search size={20} style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af"
            }} />
            <input
              type="text"
              placeholder="Search products by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 48px",
                borderRadius: "12px",
                border: "2px solid #e5e7eb",
                fontSize: "15px",
                outline: "none",
                transition: "all 0.3s ease",
                backgroundColor: "#f9fafb"
              }}
              onFocus={(e) => e.target.style.borderColor = "#10b981"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          {/* Category Filter */}
          <div style={{ position: "relative" }}>
            <Filter size={18} style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#9ca3af"
            }} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: "12px 16px 12px 42px",
                borderRadius: "12px",
                border: "2px solid #e5e7eb",
                fontSize: "15px",
                outline: "none",
                cursor: "pointer",
                backgroundColor: "#f9fafb",
                minWidth: "160px",
                textTransform: "capitalize"
              }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div style={{
            display: "flex",
            gap: "8px",
            backgroundColor: "#f3f4f6",
            padding: "4px",
            borderRadius: "12px"
          }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                backgroundColor: viewMode === "grid" ? "#ffffff" : "transparent",
                color: viewMode === "grid" ? "#10b981" : "#6b7280",
                boxShadow: viewMode === "grid" ? "0 2px 8px rgba(0,0,0,0.08)" : "none"
              }}
            >
              <Grid size={18} /> Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "10px 14px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px",
                fontWeight: "600",
                transition: "all 0.3s ease",
                backgroundColor: viewMode === "list" ? "#ffffff" : "transparent",
                color: viewMode === "list" ? "#10b981" : "#6b7280",
                boxShadow: viewMode === "list" ? "0 2px 8px rgba(0,0,0,0.08)" : "none"
              }}
            >
              <ListIcon size={18} /> List
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={fetchList}
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "12px 20px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 4px 15px rgba(16,185,129,0.3)",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 20px rgba(16,185,129,0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 15px rgba(16,185,129,0.3)";
            }}
          >
            <RefreshCw size={18} /> Refresh
          </button>
        </div>
      </div>
      
      {filteredList.length > 0 ? (
        viewMode === "grid" ? (
          // Grid View
          <div style={{
            display: "grid",
            gap: "24px",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))"
          }}>
            {filteredList.map((item, index) => (
              <div 
                key={item._id || index} 
                style={{
                  background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
                  borderRadius: "20px",
                  padding: "20px",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
                  border: "1px solid #f3f4f6",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
                }}
              >
                <div style={{ position: "relative", marginBottom: "16px" }}>
                  <img 
                    src={item.image[0]} 
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "contain",
                      borderRadius: "16px"
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/320x200?text=No+Image";
                    }}
                  />
                  <div style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    backgroundColor: "rgba(255,255,255,0.95)",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    color: "#10b981",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }}>
                    {currency}{item.price}
                  </div>
                  {item.bestseller && (
                    <div style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
                      padding: "6px 12px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "white",
                      boxShadow: "0 2px 8px rgba(255,111,97,0.3)"
                    }}>
                      ⭐ Bestseller
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <span style={{
                    display: "inline-block",
                    padding: "4px 12px",
                    backgroundColor: "rgba(59,130,246,0.1)",
                    color: "#3b82f6",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "600",
                    textTransform: "capitalize",
                    marginBottom: "8px"
                  }}>
                    {item.category}
                  </span>
                  <h3 style={{ 
                    fontSize: "1.1rem", 
                    fontWeight: "700", 
                    color: "#1f2937",
                    margin: "0 0 8px 0",
                    lineHeight: 1.4,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}>
                    {item.name}
                  </h3>
                  <p style={{ 
                    fontSize: "13px", 
                    color: "#6b7280",
                    margin: 0
                  }}>
                    {item.subCategory} • {item.sizes?.length || 0} sizes
                  </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={() => openViewModal(item)}
                    style={{
                      flex: 1,
                      backgroundColor: "#f3f4f6",
                      color: "#6b7280",
                      border: "none",
                      borderRadius: "12px",
                      padding: "12px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#e5e7eb";
                      e.target.style.color = "#374151";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#f3f4f6";
                      e.target.style.color = "#6b7280";
                    }}
                  >
                    <Eye size={16} /> View
                  </button>
                  <button
                    onClick={() => openEditModal(item)}
                    style={{
                      flex: 1,
                      background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      padding: "12px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      boxShadow: "0 4px 15px rgba(59,130,246,0.3)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.02)";
                      e.target.style.boxShadow = "0 6px 20px rgba(59,130,246,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "0 4px 15px rgba(59,130,246,0.3)";
                    }}
                  >
                    <Edit3 size={16} /> Edit
                  </button>
                  <button
                    onClick={async () => {
                      const result = await Swal.fire({
                        title: 'Delete Product?',
                        text: `Are you sure you want to delete "${item.name}"?`,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#ef4444',
                        cancelButtonColor: '#6b7280',
                        confirmButtonText: 'Yes, delete it!',
                        cancelButtonText: 'Cancel'
                      });
                      if (result.isConfirmed) removeProduct(item._id, item.name);
                    }}
                    style={{
                      flex: 1,
                      background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      padding: "12px",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      boxShadow: "0 4px 15px rgba(239,68,68,0.3)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.02)";
                      e.target.style.boxShadow = "0 6px 20px rgba(239,68,68,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "0 4px 15px rgba(239,68,68,0.3)";
                    }}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div style={{
            background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
            borderRadius: "20px",
            padding: "24px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
            border: "1px solid #f3f4f6"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                  <th style={{ textAlign: "left", padding: "16px", fontSize: "13px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Product</th>
                  <th style={{ textAlign: "left", padding: "16px", fontSize: "13px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Category</th>
                  <th style={{ textAlign: "left", padding: "16px", fontSize: "13px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Price</th>
                  <th style={{ textAlign: "left", padding: "16px", fontSize: "13px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sizes</th>
                  <th style={{ textAlign: "right", padding: "16px", fontSize: "13px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredList.map((item, index) => (
                  <tr 
                    key={item._id || index}
                    style={{ 
                      borderBottom: "1px solid #f3f4f6",
                      transition: "background-color 0.3s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <img 
                          src={item.image[0]} 
                          alt={item.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "12px"
                          }}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/60x60?text=No+Image";
                          }}
                        />
                        <div>
                          <h4 style={{ margin: "0 0 4px 0", fontSize: "15px", fontWeight: "600", color: "#1f2937" }}>
                            {item.name}
                          </h4>
                          {item.bestseller && (
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "11px",
                              color: "#ff6f61",
                              fontWeight: "600"
                            }}>
                              ⭐ Bestseller
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{
                        padding: "6px 12px",
                        backgroundColor: "rgba(59,130,246,0.1)",
                        color: "#3b82f6",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        textTransform: "capitalize"
                      }}>
                        {item.category}
                      </span>
                    </td>
                    <td style={{ padding: "16px", fontSize: "16px", fontWeight: "700", color: "#10b981" }}>
                      {currency}{item.price}
                    </td>
                    <td style={{ padding: "16px", fontSize: "14px", color: "#6b7280" }}>
                      {item.sizes?.join(", ") || "N/A"}
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => openViewModal(item)}
                          style={{
                            padding: "10px",
                            backgroundColor: "#f3f4f6",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            color: "#6b7280",
                            transition: "all 0.3s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#e5e7eb";
                            e.target.style.color = "#374151";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#f3f4f6";
                            e.target.style.color = "#6b7280";
                          }}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => openEditModal(item)}
                          style={{
                            padding: "10px",
                            background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            color: "white",
                            transition: "all 0.3s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                          }}
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={async () => {
                            const result = await Swal.fire({
                              title: 'Delete Product?',
                              text: `Are you sure you want to delete "${item.name}"?`,
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#ef4444',
                              cancelButtonColor: '#6b7280',
                              confirmButtonText: 'Yes, delete it!',
                              cancelButtonText: 'Cancel'
                            });
                            if (result.isConfirmed) removeProduct(item._id, item.name);
                          }}
                          style={{
                            padding: "10px",
                            background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            color: "white",
                            transition: "all 0.3s ease"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div style={{ 
          textAlign: "center", 
          padding: "80px 24px",
          background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
          border: "1px solid #f3f4f6"
        }}>
          <div style={{
            width: "80px",
            height: "80px",
            backgroundColor: "rgba(16,185,129,0.1)",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px auto",
            fontSize: "36px"
          }}>
            📦
          </div>
          <h3 style={{ 
            marginBottom: "8px", 
            color: "#1f2937",
            fontSize: "1.25rem",
            fontWeight: "700"
          }}>
            No products found
          </h3>
          <p style={{ color: "#6b7280", margin: "0 0 24px 0" }}>
            {searchQuery ? "Try adjusting your search or filters" : "Add some products to see them here"}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              style={{
                background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "12px 24px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "600",
                boxShadow: "0 4px 15px rgba(255,111,97,0.3)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(255,111,97,0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(255,111,97,0.3)";
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
      
      {/* View Product Modal */}
      {viewModalOpen && selectedProduct && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px"
          }}
          onClick={closeModals}
        >
          <div 
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
              borderRadius: "24px",
              maxWidth: "700px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: "24px 24px 0 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white"
                }}>
                  <Eye size={24} />
                </div>
                <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "800", color: "#1f2937" }}>
                  Product Details
                </h2>
              </div>
              <button
                onClick={closeModals}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#f3f4f6",
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#ef4444";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#f3f4f6";
                  e.target.style.color = "#6b7280";
                }}
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: "24px" }}>
              {/* Images */}
              <div style={{ marginBottom: "24px" }}>
                <img 
                  src={selectedProduct.image[0]} 
                  alt={selectedProduct.name}
                  style={{
                    width: "100%",
                    height: "300px",
                    objectFit: "cover",
                    borderRadius: "16px",
                    marginBottom: "12px"
                  }}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/600x300?text=No+Image";
                  }}
                />
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {selectedProduct.image.map((img, idx) => (
                    <img 
                      key={idx}
                      src={img} 
                      alt={`${selectedProduct.name} ${idx}`}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: idx === 0 ? "2px solid #10b981" : "2px solid transparent"
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Info Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "16px",
                marginBottom: "24px"
              }}>
                <div style={{
                  backgroundColor: "rgba(59,130,246,0.1)",
                  padding: "16px",
                  borderRadius: "12px"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280", textTransform: "uppercase", fontWeight: "600" }}>Category</p>
                  <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1f2937", textTransform: "capitalize" }}>{selectedProduct.category}</p>
                </div>
                <div style={{
                  backgroundColor: "rgba(139,92,246,0.1)",
                  padding: "16px",
                  borderRadius: "12px"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280", textTransform: "uppercase", fontWeight: "600" }}>Sub Category</p>
                  <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1f2937", textTransform: "capitalize" }}>{selectedProduct.subCategory}</p>
                </div>
                <div style={{
                  backgroundColor: "rgba(16,185,129,0.1)",
                  padding: "16px",
                  borderRadius: "12px"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280", textTransform: "uppercase", fontWeight: "600" }}>Price</p>
                  <p style={{ margin: 0, fontSize: "20px", fontWeight: "800", color: "#10b981" }}>{currency}{selectedProduct.price}</p>
                </div>
                <div style={{
                  backgroundColor: "rgba(245,158,11,0.1)",
                  padding: "16px",
                  borderRadius: "12px"
                }}>
                  <p style={{ margin: "0 0 4px 0", fontSize: "12px", color: "#6b7280", textTransform: "uppercase", fontWeight: "600" }}>Sizes</p>
                  <p style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1f2937" }}>{selectedProduct.sizes?.join(", ") || "N/A"}</p>
                </div>
              </div>

              {/* Name & Description */}
              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "1.25rem", fontWeight: "700", color: "#1f2937" }}>
                  {selectedProduct.name}
                </h3>
                {selectedProduct.bestseller && (
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "6px 12px",
                    background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
                    color: "white",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "700",
                    marginBottom: "12px"
                  }}>
                    ⭐ Bestseller
                  </span>
                )}
                <p style={{ margin: "12px 0 0 0", fontSize: "15px", color: "#6b7280", lineHeight: 1.6 }}>
                  {selectedProduct.description || "No description available."}
                </p>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => {
                    closeModals();
                    openEditModal(selectedProduct);
                  }}
                  style={{
                    flex: 1,
                    background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "14px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 15px rgba(59,130,246,0.3)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow = "0 6px 20px rgba(59,130,246,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow = "0 4px 15px rgba(59,130,246,0.3)";
                  }}
                >
                  <Edit3 size={18} /> Edit Product
                </button>
                <button
                  onClick={closeModals}
                  style={{
                    flex: 1,
                    backgroundColor: "#f3f4f6",
                    color: "#6b7280",
                    border: "none",
                    borderRadius: "12px",
                    padding: "14px",
                    cursor: "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#e5e7eb";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#f3f4f6";
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editModalOpen && selectedProduct && (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px"
          }}
          onClick={closeModals}
        >
          <div 
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)",
              borderRadius: "24px",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              padding: "24px 24px 0 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white"
                }}>
                  <Edit3 size={24} />
                </div>
                <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "800", color: "#1f2937" }}>
                  Edit Product
                </h2>
              </div>
              <button
                onClick={closeModals}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#f3f4f6",
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#ef4444";
                  e.target.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#f3f4f6";
                  e.target.style.color = "#6b7280";
                }}
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div style={{ padding: "24px" }}>
              {/* Product Name */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "2px solid #e5e7eb",
                    fontSize: "15px",
                    outline: "none",
                    transition: "border-color 0.3s ease"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>

              {/* Price & Category Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                    Price ({currency})
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditChange}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "12px",
                      border: "2px solid #e5e7eb",
                      fontSize: "15px",
                      outline: "none",
                      transition: "border-color 0.3s ease"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditChange}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "12px",
                      border: "2px solid #e5e7eb",
                      fontSize: "15px",
                      outline: "none",
                      transition: "border-color 0.3s ease"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                    onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                  />
                </div>
              </div>

              {/* Sub Category */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                  Sub Category
                </label>
                <input
                  type="text"
                  name="subCategory"
                  value={editFormData.subCategory}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "2px solid #e5e7eb",
                    fontSize: "15px",
                    outline: "none",
                    transition: "border-color 0.3s ease"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>

              {/* Sizes */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "12px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                  Available Sizes
                </label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {["S", "M", "L", "XL", "XXL"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "12px",
                        border: "2px solid",
                        borderColor: editFormData.sizes.includes(size) ? "#3b82f6" : "#e5e7eb",
                        backgroundColor: editFormData.sizes.includes(size) ? "rgba(59,130,246,0.1)" : "#ffffff",
                        color: editFormData.sizes.includes(size) ? "#3b82f6" : "#6b7280",
                        fontSize: "14px",
                        fontWeight: "700",
                        cursor: "pointer",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {editFormData.sizes.includes(size) ? "✓ " + size : size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditChange}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "2px solid #e5e7eb",
                    fontSize: "15px",
                    outline: "none",
                    resize: "vertical",
                    transition: "border-color 0.3s ease",
                    fontFamily: "inherit"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
                  onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                />
              </div>

              {/* Bestseller Toggle */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <div style={{
                    width: "52px",
                    height: "28px",
                    borderRadius: "14px",
                    backgroundColor: editFormData.bestseller ? "#3b82f6" : "#d1d5db",
                    position: "relative",
                    transition: "background-color 0.3s ease"
                  }}>
                    <div style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: "white",
                      position: "absolute",
                      top: "2px",
                      left: editFormData.bestseller ? "26px" : "2px",
                      transition: "left 0.3s ease",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
                    }} />
                  </div>
                  <input
                    type="checkbox"
                    name="bestseller"
                    checked={editFormData.bestseller}
                    onChange={handleEditChange}
                    style={{ display: "none" }}
                  />
                  <span style={{ fontSize: "15px", fontWeight: "600", color: "#374151" }}>
                    ⭐ Mark as Bestseller
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={updateProduct}
                  disabled={updating}
                  style={{
                    flex: 1,
                    background: updating 
                      ? "linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%)" 
                      : "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "14px",
                    cursor: updating ? "not-allowed" : "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 4px 15px rgba(59,130,246,0.3)",
                    transition: "all 0.3s ease"
                  }}
                >
                  {updating ? (
                    <>
                      <div style={{
                        width: "18px",
                        height: "18px",
                        border: "2px solid white",
                        borderTop: "2px solid transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                      }} />
                      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Edit3 size={18} /> Update Product
                    </>
                  )}
                </button>
                <button
                  onClick={closeModals}
                  disabled={updating}
                  style={{
                    flex: 1,
                    backgroundColor: "#f3f4f6",
                    color: "#6b7280",
                    border: "none",
                    borderRadius: "12px",
                    padding: "14px",
                    cursor: updating ? "not-allowed" : "pointer",
                    fontSize: "15px",
                    fontWeight: "600",
                    transition: "all 0.3s ease"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
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