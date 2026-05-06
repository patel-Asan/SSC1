import React, { useState, useEffect } from "react";
import { Plus, Trash2, X, Tag, Edit2, Check, XCircle } from "lucide-react";
import { toast } from "react-toastify";

const Categories = ({ token }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        description: ""
    });
    const isMobile = window.innerWidth <= 768;

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

    const fetchCategories = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/category/list`, {
                headers: { 'token': token }
            });
            const data = await response.json();
            if (data.success) {
                setCategories(data.categories);
            } else {
                toast.error(data.message || "Failed to fetch categories");
            }
        } catch (error) {
            console.error("Failed to fetch categories:", error);
            toast.error("Failed to fetch categories");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${backendUrl}/api/category/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Category created successfully");
                setShowModal(false);
                setFormData({ name: "", description: "" });
                fetchCategories();
            } else {
                toast.error(data.message || "Failed to create category");
            }
        } catch (error) {
            console.error("Failed to create category:", error);
            toast.error("Failed to create category");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`${backendUrl}/api/category/${editingCategory._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Category updated successfully");
                setShowModal(false);
                setEditMode(false);
                setEditingCategory(null);
                setFormData({ name: "", description: "" });
                fetchCategories();
            } else {
                toast.error(data.message || "Failed to update category");
            }
        } catch (error) {
            console.error("Failed to update category:", error);
            toast.error("Failed to update category");
        }
    };

    const handleDelete = async (categoryId) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            const response = await fetch(`${backendUrl}/api/category/${categoryId}`, {
                method: 'DELETE',
                headers: { 'token': token }
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Category deleted successfully");
                fetchCategories();
            } else {
                toast.error(data.message || "Failed to delete category");
            }
        } catch (error) {
            console.error("Failed to delete category:", error);
            toast.error("Failed to delete category");
        }
    };

    const handleToggleStatus = async (categoryId, currentStatus) => {
        try {
            const response = await fetch(`${backendUrl}/api/category/${categoryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Category status updated");
                fetchCategories();
            } else {
                toast.error(data.message || "Failed to update category");
            }
        } catch (error) {
            console.error("Failed to update category:", error);
            toast.error("Failed to update category");
        }
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setEditMode(true);
        setFormData({
            name: category.name,
            description: category.description || ""
        });
        setShowModal(true);
    };

    useEffect(() => {
        fetchCategories();
    }, [token]);

    if (loading) {
        return (
            <div style={{ 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                minHeight: "400px",
                background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)"
            }}>
                <p style={{ color: "#6b7280" }}>Loading categories...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: isMobile ? "16px" : "24px", background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)", minHeight: "100vh" }}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "32px",
                flexWrap: "wrap",
                gap: isMobile ? "16px" : "0"
            }}>
                <div>
                    <h1 style={{ 
                        fontSize: isMobile ? "1.5rem" : "2rem", 
                        fontWeight: "700", 
                        color: "#1f2937",
                        margin: "0 0 8px 0"
                    }}>
                        Product Categories
                    </h1>
                    <p style={{ color: "#6b7280", margin: 0, fontSize: isMobile ? "13px" : "14px" }}>
                        {categories.length} categories available
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditMode(false);
                        setEditingCategory(null);
                        setFormData({ name: "", description: "" });
                        setShowModal(true);
                    }}
                    style={{
                        background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                        color: "white",
                        border: "none",
                        padding: isMobile ? "12px 20px" : "14px 28px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontSize: isMobile ? "13px" : "15px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        boxShadow: "0 4px 15px rgba(139,92,246,0.3)",
                        transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = "0 6px 20px rgba(139,92,246,0.4)";
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "0 4px 15px rgba(139,92,246,0.3)";
                    }}
                >
                    <Plus size={20} />
                    Create Category
                </button>
            </div>

            {/* Category List */}
            <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(320px, 1fr))",
                gap: "16px"
            }}>
                {categories.length === 0 ? (
                    <div style={{
                        textAlign: "center",
                        padding: "60px 20px",
                        background: "white",
                        borderRadius: "16px",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.05)"
                    }}>
                        <Tag size={48} style={{ color: "#9ca3af", marginBottom: "16px" }} />
                        <h3 style={{ color: "#374151", marginBottom: "8px" }}>No categories found</h3>
                        <p style={{ color: "#6b7280", margin: 0 }}>
                            Create your first category to organize products
                        </p>
                    </div>
                ) : (
                    categories.map((category, index) => (
                        <div key={index} style={{
                            background: "white",
                            padding: isMobile ? "16px" : "24px",
                            borderRadius: "16px",
                            boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                            transition: "all 0.3s ease",
                            animation: "fadeIn 0.5s ease-out",
                            borderLeft: category.isActive ? "4px solid #10b981" : "4px solid #ef4444"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0,0,0,0.05)";
                        }}
                        >
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "16px"
                            }}>
                                <div style={{ flex: 1, minWidth: isMobile ? "200px" : "300px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                        <div style={{
                                            width: isMobile ? "40px" : "48px",
                                            height: isMobile ? "40px" : "48px",
                                            borderRadius: "12px",
                                            background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            <Tag size={isMobile ? 20 : 24} color="white" />
                                        </div>
                                        <div>
                                            <h3 style={{ 
                                                margin: 0, 
                                                color: "#1f2937", 
                                                fontSize: isMobile ? "14px" : "16px", 
                                                fontWeight: "600" 
                                            }}>
                                                {category.name}
                                            </h3>
                                            <span style={{
                                                padding: "4px 12px",
                                                borderRadius: "20px",
                                                fontSize: "12px",
                                                fontWeight: "600",
                                                background: category.isActive ? "#dcfce7" : "#fee2e2",
                                                color: category.isActive ? "#166534" : "#dc2626"
                                            }}>
                                                {category.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {category.description && (
                                        <p style={{ 
                                            margin: 0, 
                                            fontSize: "14px", 
                                            color: "#6b7280" 
                                        }}>
                                            {category.description}
                                        </p>
                                    )}
                                </div>
                                
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <button
                                        onClick={() => openEditModal(category)}
                                        style={{
                                            padding: "10px 20px",
                                            borderRadius: "10px",
                                            border: "1px solid #e5e7eb",
                                            background: "white",
                                            color: "#374151",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            transition: "all 0.2s ease"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = "#f9fafb";
                                            e.target.style.borderColor = "#8b5cf6";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = "white";
                                            e.target.style.borderColor = "#e5e7eb";
                                        }}
                                    >
                                        <Edit2 size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleToggleStatus(category._id, category.isActive)}
                                        style={{
                                            padding: "10px 20px",
                                            borderRadius: "10px",
                                            border: "1px solid #e5e7eb",
                                            background: "white",
                                            color: "#374151",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            transition: "all 0.2s ease"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = "#f9fafb";
                                            e.target.style.borderColor = "#8b5cf6";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = "white";
                                            e.target.style.borderColor = "#e5e7eb";
                                        }}
                                    >
                                        {category.isActive ? "Disable" : "Enable"}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category._id)}
                                        style={{
                                            padding: "10px 20px",
                                            borderRadius: "10px",
                                            border: "none",
                                            background: "#fee2e2",
                                            color: "#dc2626",
                                            cursor: "pointer",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            transition: "all 0.2s ease"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.background = "#fecaca";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.background = "#fee2e2";
                                        }}
                                    >
                                        <Trash2 size={16} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create/Edit Category Modal */}
            {showModal && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0,0,0,0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                    animation: "fadeIn 0.3s ease-out"
                }} onClick={() => setShowModal(false)}>
                    <div style={{
                        background: "white",
                        borderRadius: "20px",
                        padding: "32px",
                        maxWidth: "500px",
                        width: "90%",
                        maxHeight: "90vh",
                        overflow: "auto",
                        animation: "slideIn 0.3s ease-out"
                    }} onClick={(e) => e.stopPropagation()}>
                        <div style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "24px"
                        }}>
                            <h2 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#1f2937" }}>
                                {editMode ? "Edit Category" : "Create New Category"}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setEditMode(false);
                                    setEditingCategory(null);
                                    setFormData({ name: "", description: "" });
                                }}
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "10px",
                                    border: "none",
                                    background: "#f3f4f6",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                onMouseEnter={(e) => e.target.style.background = "#e5e7eb"}
                                onMouseLeave={(e) => e.target.style.background = "#f3f4f6"}
                            >
                                <X size={20} color="#6b7280" />
                            </button>
                        </div>

                        <form onSubmit={editMode ? handleUpdate : handleCreate}>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                    placeholder="e.g., Electronics"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: "10px",
                                        border: "1px solid #e5e7eb",
                                        fontSize: "15px",
                                        outline: "none"
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#8b5cf6";
                                        e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e5e7eb";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                            </div>

                            <div style={{ marginBottom: "24px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                                    Description - Optional
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Category description..."
                                    rows="3"
                                    style={{
                                        width: "100%",
                                        padding: "12px 16px",
                                        borderRadius: "10px",
                                        border: "1px solid #e5e7eb",
                                        fontSize: "15px",
                                        outline: "none",
                                        resize: "vertical"
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#8b5cf6";
                                        e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#e5e7eb";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    border: "none",
                                    background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
                                    color: "white",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease"
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.transform = "translateY(-2px)";
                                    e.target.style.boxShadow = "0 6px 20px rgba(139,92,246,0.4)";
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.transform = "translateY(0)";
                                    e.target.style.boxShadow = "none";
                                }}
                            >
                                {editMode ? "Update Category" : "Create Category"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
