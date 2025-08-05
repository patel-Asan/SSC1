import React, { useState } from "react";
import { assets } from "../assets/assets";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiService from "../services/api.js";

const ADD = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subcategory, setSubcategory] = useState("Topwear");
  const [bestseller, setBestseller] = useState(false);
  const [Sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(false);

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
      // Validate required fields
      if (!name || !description || !price || Sizes.length === 0) {
        toast.error("Please fill all required fields and select at least one size");
        return;
      }

      if (!image1 && !image2 && !image3 && !image4) {
        toast.error("Please upload at least one image");
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
        
        // Reset form
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

  const formStyle = {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "30px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fdfdfd",
    boxShadow: "0 0 10px rgba(0,0,0,0.05)",
    fontFamily: "Arial, sans-serif",
  };

  const sectionStyle = {
    marginBottom: "20px",
  };

  const labelStyle = {
    fontWeight: "bold",
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
  };

  const selectStyle = { ...inputStyle };

  const sizeButtonStyle = (selected) => ({
    padding: "8px 12px",
    borderRadius: "6px",
    backgroundColor: selected ? "#ffc0cb" : "#e2e8f0",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
  });

  const imageLabelStyle = {
    display: "inline-block",
    margin: "5px",
    cursor: "pointer",
  };

  const imagePreviewStyle = {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "8px",
    border: "1px solid #ccc",
  };

  const submitBtnStyle = {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
  };

  return (
    <form onSubmit={onSubmitHandler} style={formStyle}>
      <h2 style={{ textAlign: "center", marginBottom: "30px" }}>
        Add New Product
      </h2>

      <div style={sectionStyle}>
        <label style={labelStyle}>Upload Images</label>
        <div>
          {[image1, image2, image3, image4].map((img, index) => (
            <label
              key={index}
              htmlFor={`image${index + 1}`}
              style={imageLabelStyle}
            >
              <img
                src={!img ? assets.upload_area : URL.createObjectURL(img)}
                alt=""
                style={imagePreviewStyle}
              />
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
              />
            </label>
          ))}
        </div>
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Product Name</label>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          placeholder="TYPE HERE..."
          required
          style={inputStyle}
        />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Product Description</label>
        <input
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          type="text"
          placeholder="Write Description..."
          required
          style={inputStyle}
        />
      </div>

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

      <div style={sectionStyle}>
        <label style={labelStyle}>Price</label>
        <input
          onChange={(e) => setPrice(e.target.value)}
          value={price}
          type="number"
          placeholder="0.00"
          style={inputStyle}
        />
      </div>

      <div style={sectionStyle}>
        <label style={labelStyle}>Sizes</label>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => toggleSize(size)}
              style={sizeButtonStyle(Sizes.includes(size))}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          onChange={() => setBestseller((prev) => !prev)}
          checked={bestseller}
          type="checkbox"
          id="bestseller"
        />
        <label htmlFor="bestseller" style={{ marginLeft: "8px" }}>
          Add To Bestseller
        </label>
      </div>

      <button type="submit" style={submitBtnStyle} disabled={loading}>
        {loading ? "Adding..." : "ADD"}
      </button>

      <ToastContainer />
    </form>
  );
};

export default ADD;
