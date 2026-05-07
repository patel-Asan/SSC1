import React, { useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import apiService from "../services/api.js";
import { Package, Upload, DollarSign, Tag, Grid, Check, Star, Layers, ImageIcon } from "lucide-react";

const ADD = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const isMobile = window.innerWidth <= 768;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subcategory, setSubcategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [Sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragIndex, setDragIndex] = useState(null);
  const [stock, setStock] = useState("");

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
  };

  const setImage = (index, file) => {
    const setters = [setImage1, setImage2, setImage3, setImage4];
    setters[index](file);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!name || !description || !price || Sizes.length === 0) {
        toast.error("Please fill all required fields and select at least one size");
        setLoading(false);
        return;
      }

      if (!image1 && !image2 && !image3 && !image4) {
        toast.error("Please upload at least one image");
        setLoading(false);
        return;
      }

      const productData = {
        name,
        description,
        price,
        category,
        subCategory: subcategory,
        bestseller: bestseller.toString(),
        sizes: JSON.stringify(Sizes),
        stock: stock ? parseInt(stock) : 0,
        images: [image1, image2, image3, image4].filter(Boolean)
      };

      const response = await apiService.addProduct(productData, token);

      if (response.success) {
        toast.success(response.message || "Product added successfully!");

        setName("");
        setDescription("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setPrice("");
        setStock("");
        setSizes([]);
        setBestseller(false);
      } else {
        toast.error(response.message || "Failed to add product");
      }
    } catch (error) {
      console.error("Add product error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "1.5px solid #e5e7eb",
    fontSize: "14px",
    transition: "all 0.2s ease",
    outline: "none",
    boxSizing: "border-box",
    background: "#fff",
  };

  const selectStyle = { ...inputStyle, cursor: "pointer" };

  const sectionDivider = {
    height: "1px",
    background: "linear-gradient(90deg, transparent, #e5e7eb, transparent)",
    margin: "24px 0",
  };

  return (
    <div style={{ padding: isMobile ? "16px" : "32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(139,92,246,0.3)" }}>
          <Package size={24} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#111827", margin: "0 0 2px 0", letterSpacing: "-0.3px" }}>Add New Product</h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>Create a new product to add to your store inventory</p>
        </div>
      </div>

      <form onSubmit={onSubmitHandler} style={{ background: "#fff", borderRadius: "16px", padding: isMobile ? "20px" : "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #f3f4f6" }}>
        {/* Image Upload */}
        <div style={{ marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "rgba(139,92,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ImageIcon size={15} color="#8b5cf6" />
            </div>
            <span style={{ fontWeight: "600", fontSize: "14px", color: "#374151" }}>Product Images</span>
            <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "400" }}>(at least 1 required)</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: isMobile ? "10px" : "14px" }}>
            {[image1, image2, image3, image4].map((img, index) => (
              <label
                key={index}
                htmlFor={`image${index + 1}`}
                onDragEnter={() => setDragIndex(index)}
                onDragLeave={() => setDragIndex(null)}
                style={{
                  aspectRatio: "1",
                  borderRadius: "12px",
                  border: dragIndex === index ? "2px dashed #8b5cf6" : img ? "2px solid #8b5cf6" : "2px dashed #e5e7eb",
                  background: dragIndex === index ? "rgba(139,92,246,0.05)" : img ? "#fff" : "#f9fafb",
                  display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", transition: "all 0.25s ease", overflow: "hidden", position: "relative",
                }}
                onMouseEnter={(e) => { if (!img) { e.currentTarget.style.borderColor = "#8b5cf6"; e.currentTarget.style.background = "rgba(139,92,246,0.03)"; } }}
                onMouseLeave={(e) => { if (!img && dragIndex !== index) { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.background = "#f9fafb"; } }}
              >
                {img ? (
                  <>
                    <img src={URL.createObjectURL(img)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
                    <div style={{ position: "absolute", bottom: "6px", left: "6px", right: "6px", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: "11px", fontWeight: "600", textAlign: "center", padding: "4px", borderRadius: "6px" }}>
                      {index === 0 ? "Main" : `${index + 1}`}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "8px" }}>
                      <Upload size={18} color="#9ca3af" />
                    </div>
                    <span style={{ fontSize: "12px", color: "#9ca3af", fontWeight: "500" }}>
                      {index === 0 ? "Main Image" : `Image ${index + 1}`}
                    </span>
                  </>
                )}
                <input onChange={(e) => setImage(index, e.target.files[0])} type="file" id={`image${index + 1}`} hidden accept="image/*" />
              </label>
            ))}
          </div>
        </div>

        <div style={sectionDivider} />

        {/* Product Name & Price */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "0" : "20px", marginBottom: "20px" }}>
          <div style={{ marginBottom: isMobile ? "20px" : "0" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", fontSize: "13px", color: "#374151", marginBottom: "8px" }}>
              <Tag size={15} color="#8b5cf6" /> Product Name <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder="Enter product name..." required style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
          </div>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", fontSize: "13px", color: "#374151", marginBottom: "8px" }}>
              <DollarSign size={15} color="#8b5cf6" /> Price (₹) <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input onChange={(e) => setPrice(e.target.value)} value={price} type="number" placeholder="0.00" required style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", fontSize: "13px", color: "#374151", marginBottom: "8px" }}>
            Product Description <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <textarea onChange={(e) => setDescription(e.target.value)} value={description} placeholder="Describe your product in detail..." required rows={4}
            style={{ ...inputStyle, resize: "vertical", minHeight: "100px", fontFamily: "inherit", lineHeight: "1.5" }}
            onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
        </div>

        <div style={sectionDivider} />

        {/* Category, Subcategory, Stock */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: isMobile ? "12px" : "20px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", fontWeight: "600", fontSize: "13px", color: "#374151", marginBottom: "8px" }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={selectStyle}>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontWeight: "600", fontSize: "13px", color: "#374151", marginBottom: "8px" }}>Subcategory</label>
            <select value={subcategory} onChange={(e) => setSubcategory(e.target.value)} style={selectStyle}>
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", fontSize: "13px", color: "#374151", marginBottom: "8px" }}>
              <Layers size={15} color="#8b5cf6" /> Stock
            </label>
            <input onChange={(e) => setStock(e.target.value)} value={stock} type="number" placeholder="0" min="0" style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#8b5cf6"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"} />
          </div>
        </div>

        {/* Sizes */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", fontSize: "13px", color: "#374151", marginBottom: "10px" }}>
            <Grid size={15} color="#8b5cf6" /> Available Sizes <span style={{ color: "#ef4444" }}>*</span>
          </label>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {["S", "M", "L", "XL", "XXL"].map((size) => {
              const selected = Sizes.includes(size);
              return (
                <button key={size} type="button" onClick={() => toggleSize(size)}
                  style={{
                    padding: "10px 24px", borderRadius: "10px",
                    background: selected ? "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)" : "#f3f4f6",
                    color: selected ? "#fff" : "#6b7280", border: "none", cursor: "pointer",
                    fontSize: "14px", fontWeight: "700", letterSpacing: "0.5px",
                    transition: "all 0.25s ease",
                    boxShadow: selected ? "0 3px 10px rgba(139,92,246,0.3)" : "none",
                  }}
                  onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = "#e5e7eb"; }}
                  onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = "#f3f4f6"; }}
                >
                  {selected && <Check size={14} style={{ marginRight: "4px", display: "inline" }} />}
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bestseller Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", background: "#f9fafb", borderRadius: "10px", marginBottom: "24px" }}>
          <div onClick={() => setBestseller(!bestseller)}
            style={{
              width: "22px", height: "22px", borderRadius: "6px", border: "2px solid #e5e7eb",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              background: bestseller ? "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)" : "#fff",
              transition: "all 0.2s ease", flexShrink: 0,
            }}>
            {bestseller && <Check size={14} color="#fff" strokeWidth={3} />}
          </div>
          <Star size={18} color={bestseller ? "#8b5cf6" : "#9ca3af"} fill={bestseller ? "#8b5cf6" : "none"} />
          <span style={{ fontSize: "14px", fontWeight: "500", color: "#374151" }}>Mark as Bestseller</span>
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading}
          style={{
            width: "100%", padding: "14px", border: "none", borderRadius: "12px",
            fontSize: "15px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            background: loading ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)" : "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
            color: "#fff", transition: "all 0.3s ease",
            boxShadow: loading ? "none" : "0 4px 20px rgba(139,92,246,0.3)",
          }}
          onMouseEnter={(e) => { if (!loading) { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 6px 25px rgba(139,92,246,0.4)"; } }}
          onMouseLeave={(e) => { if (!loading) { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(139,92,246,0.3)"; } }}
        >
          {loading ? (
            <><span style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Adding Product...</>
          ) : (
            <><Package size={20} /> Add Product</>
          )}
        </button>
      </form>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default ADD;
