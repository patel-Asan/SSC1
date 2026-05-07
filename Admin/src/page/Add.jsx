import React, { useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import apiService from "../services/api.js";
import { Package, Upload, DollarSign, Tag, Grid, Check, Star } from "lucide-react";

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
  const [dragActive, setDragActive] = useState(false);

  const toggleSize = (size) => {
    setSizes((prev) =>
      prev.includes(size)
        ? prev.filter((item) => item !== size)
        : [...prev, size]
    );
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

  const pageContainer = {
    maxWidth: "900px",
    margin: "0 auto",
    padding: isMobile ? "16px" : "32px",
  };

  const formCard = {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: isMobile ? "20px" : "32px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    border: "1px solid #f3f4f6",
  };

  const sectionStyle = {
    marginBottom: "28px",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "600",
    fontSize: "14px",
    color: "#374151",
    marginBottom: "10px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "2px solid #e5e7eb",
    fontSize: "15px",
    transition: "all 0.3s ease",
    outline: "none",
    boxSizing: "border-box",
  };

  const selectStyle = { ...inputStyle, cursor: "pointer" };

  const imageGrid = {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  };

  const imageUploadBox = (hasImage, isDragging) => ({
    aspectRatio: "1",
    borderRadius: "16px",
    border: isDragging ? "2px dashed #ff6f61" : hasImage ? "2px solid #ff6f61" : "2px dashed #e5e7eb",
    backgroundColor: isDragging ? "rgba(255,111,97,0.05)" : hasImage ? "#fff" : "#fafbfc",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    overflow: "hidden",
    position: "relative",
  });

  const sizeButtonStyle = (selected) => ({
    padding: "12px 20px",
    borderRadius: "10px",
    backgroundColor: selected ? "#ff6f61" : "#f3f4f6",
    color: selected ? "#fff" : "#6b7280",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    boxShadow: selected ? "0 4px 12px rgba(255,111,97,0.3)" : "none",
  });

  const submitBtnStyle = {
    background: loading 
      ? "linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)" 
      : "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)",
    color: "#fff",
    padding: "14px 32px",
    border: "none",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: loading ? "not-allowed" : "pointer",
    width: "100%",
    transition: "all 0.3s ease",
    boxShadow: loading ? "none" : "0 4px 20px rgba(139,92,246,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  };

  const checkboxStyle = {
    width: "22px",
    height: "22px",
    borderRadius: "6px",
    border: "2px solid #e5e7eb",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: bestseller ? "#ff6f61" : "#fff",
    transition: "all 0.3s ease",
  };

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Package size={22} color="white" />
        </div>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", margin: "0 0 2px 0" }}>
            Add New Product
          </h1>
          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
            Create a new product to add to your store inventory
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmitHandler} style={formCard}>
        {/* Image Upload */}
        <div style={sectionStyle}>
          <label style={labelStyle}>
            <Upload size={16} color="#ff6f61" />
            Product Images
          </label>
          <div style={imageGrid}>
            {[image1, image2, image3, image4].map((img, index) => (
              <label
                key={index}
                htmlFor={`image${index + 1}`}
                style={imageUploadBox(img, dragActive)}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
              >
                {img ? (
                  <img
                    src={URL.createObjectURL(img)}
                    alt=""
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <>
                    <Upload size={24} color="#9ca3af" style={{ marginBottom: "8px" }} />
                    <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                      {index === 0 ? "Main Image" : `Image ${index + 1}`}
                    </span>
                  </>
                )}
                <input
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (index === 0) setImage1(file);
                    if (index === 1) setImage2(file);
                    if (index === 2) setImage3(file);
                    if (index === 3) setImage4(file);
                  }}
                  type="file"
                  id={`image${index + 1}`}
                  hidden
                  accept="image/*"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Product Name */}
          <div style={sectionStyle}>
            <label style={labelStyle}>
              <Tag size={16} color="#ff6f61" />
              Product Name
            </label>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Enter product name..."
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#ff6f61"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          {/* Price */}
          <div style={sectionStyle}>
            <label style={labelStyle}>
              <DollarSign size={16} color="#ff6f61" />
              Price (₹)
            </label>
            <input
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              type="number"
              placeholder="0.00"
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#ff6f61"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>
        </div>

        {/* Description */}
        <div style={sectionStyle}>
          <label style={labelStyle}>Product Description</label>
          <textarea
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            placeholder="Describe your product in detail..."
            required
            rows={4}
            style={{
              ...inputStyle,
              resize: "vertical",
              minHeight: "100px",
              fontFamily: "inherit",
            }}
            onFocus={(e) => e.target.style.borderColor = "#ff6f61"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
        </div>

        {/* Category & Subcategory */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div style={sectionStyle}>
            <label style={labelStyle}>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={selectStyle}
            >
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle}>Subcategory</label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              style={selectStyle}
            >
              <option value="Topwear">Topwear</option>
              <option value="Bottomwear">Bottomwear</option>
              <option value="Winterwear">Winterwear</option>
            </select>
          </div>
        </div>

        {/* Sizes */}
        <div style={sectionStyle}>
          <label style={labelStyle}>
            <Grid size={16} color="#ff6f61" />
            Available Sizes
          </label>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                style={sizeButtonStyle(Sizes.includes(size))}
              >
                {Sizes.includes(size) && <Check size={14} style={{ marginRight: "4px" }} />}
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div style={{ ...sectionStyle, display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            onClick={() => setBestseller(!bestseller)}
            style={checkboxStyle}
          >
            {bestseller && <Check size={16} color="#fff" />}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Star size={18} color={bestseller ? "#ff6f61" : "#9ca3af"} fill={bestseller ? "#ff6f61" : "none"} />
            <span style={{ fontSize: "15px", fontWeight: "500", color: "#374151" }}>
              Mark as Bestseller
            </span>
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" style={submitBtnStyle} disabled={loading}>
          {loading ? (
            <>
              <span style={{ width: "18px", height: "18px", border: "2px solid #fff", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              Adding Product...
            </>
          ) : (
            <>
              <Package size={20} />
              Add Product
            </>
          )}
        </button>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>


    </div>
  );
};

export default ADD;
