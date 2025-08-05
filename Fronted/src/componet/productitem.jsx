
import React, { useContext, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import { useNavigate } from "react-router-dom";

const Productitem = ({ id, name, image, price }) => {
  const { addToCart } = useContext(Shopcontext);
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const handleImageError = (e) => {
    console.log("Image failed to load:", e.target.src);
    setImageError(true);
    // Fallback to a reliable placeholder image
    e.target.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center";
  };

  const handleImageClick = () => {
    navigate(`/product/${id}`);
  };

  // Get the image source
  const getImageSrc = () => {
    if (imageError) {
      return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center";
    }
    
    if (Array.isArray(image) && image.length > 0) {
      // Check if it's a local uploaded image
      const firstImage = image[0];
      if (firstImage && firstImage.includes('localhost:4000/uploads/')) {
        return firstImage;
      }
      return firstImage;
    } else if (typeof image === 'string') {
      return image;
    } else {
      return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop&crop=center";
    }
  };

  return (
    <div style={{
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "16px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      cursor: "pointer",
      border: "1px solid #e5e7eb"
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    }}
    >
      {/* Product Image */}
      <div style={{ marginBottom: "12px", textAlign: "center" }}>
        <img
          src={getImageSrc()}
          alt={name}
          onClick={handleImageClick}
          onError={handleImageError}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        />
      </div>

      {/* Product Info */}
      <div>
        <h3 
          onClick={handleImageClick}
          style={{
            fontSize: "16px",
            fontWeight: "600",
            marginBottom: "8px",
            color: "#111827",
            cursor: "pointer",
            lineHeight: "1.4"
          }}
        >
          {name}
        </h3>
        
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px"
        }}>
          <span style={{
            fontSize: "18px",
            fontWeight: "700",
            color: "#059669"
          }}>
            ₹{price}
          </span>
          
          <button
            onClick={() => addToCart(id, "M")} // Default to Medium size
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#2563eb"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#3b82f6"}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Productitem;
