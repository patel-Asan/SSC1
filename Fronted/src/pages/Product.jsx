
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Shopcontext } from "../context/shopcontext";
import { assets } from "../assets/assets";
import RelatedProduct from "../componet/relatedproduct";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, loading, error, getProductById } = useContext(Shopcontext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchProductData = () => {
      const foundProduct = getProductById(productId);
      if (foundProduct) {
        setProductData(foundProduct);
        // Set the first image as default, with fallback
        const firstImage = Array.isArray(foundProduct.image) && foundProduct.image.length > 0 
          ? foundProduct.image[0] 
          : "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center";
        setImage(firstImage);
      }
    };
    
    if (products && products.length > 0) {
      fetchProductData();
    }
  }, [productId, products, getProductById]);

  const handleImageError = (imageUrl, index) => {
    console.log("Image failed to load:", imageUrl);
    setImageErrors(prev => ({ ...prev, [index]: true }));
    // Set fallback image
    const fallbackImage = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center";
    if (image === imageUrl) {
      setImage(fallbackImage);
    }
  };

  const getImageSrc = (imageUrl, index) => {
    if (imageErrors[index]) {
      return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center";
    }
    return imageUrl;
  };

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "400px",
        paddingTop: "2rem"
      }}>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "400px",
        paddingTop: "2rem"
      }}>
        <p style={{ color: "#e74c3c" }}>Error: {error}</p>
      </div>
    );
  }

  if (!productData) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "400px",
        paddingTop: "2rem"
      }}>
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className="border-t-2 pt-10 px-4 sm:px-10 transition-opacity ease-in duration-500">
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-12">
        {/* Left: Images */}
        <div className="flex-1 flex flex-col sm:flex-row gap-6">
          {/* Thumbnails */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto gap-3 sm:w-28 w-full">
            {productData.image.map((item, index) => (
              <img
                src={getImageSrc(item, index)}
                key={index}
                onClick={() => setImage(getImageSrc(item, index))}
                onError={() => handleImageError(item, index)}
                alt={`Thumbnail ${index}`}
                className={`h-[150px] w-[150px] object-cover rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  image === getImageSrc(item, index) ? "border-blue-600 scale-105" : "border-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="flex-1 flex justify-center items-center">
            <img
              src={image}
              alt="Main Product"
              onError={() => setImage("https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center")}
              className="max-h-[500px] w-full object-contain rounded-xl shadow-md"
            />
          </div>
        </div>







        {/* Right: Product Info */}
     <div
  style={{
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
    padding: "1rem",
    maxWidth: "600px",
    margin: "auto",
  }}
>
  {/* Product Name */}
  <h2
    style={{
      fontSize: "2rem",
      fontWeight: "700",
      color: "#111827",
    }}
  >
    {productData.name}
  </h2>

  {/* Star Ratings */}
  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
    {[...Array(4)].map((_, i) => (
      <img
        src={assets.star_icon}
        alt="star"
        style={{ width: "16px", transition: "transform 0.2s" }}
        key={`star-${i}`}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
    ))}
    <img src={assets.star_dull_icon} alt="star" style={{ width: "16px" }} />
    <p style={{ paddingLeft: "0.5rem", fontSize: "0.875rem", color: "#6b7280" }}>(128 reviews)</p>
  </div>

  {/* Price */}
  <p
    style={{
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#16a34a",
    }}
  >
    ₹{productData.price}
  </p>

  {/* Description */}
  <p style={{ fontWeight: "600", fontSize: "1rem", color: "#1f2937" }}>Description:</p>
  <p
    style={{
      fontSize: "1rem",
      lineHeight: "1.5",
      color: "#374151",
      textAlign: "justify",
    }}
  >
    {productData.description}
  </p>

  {/* Size Selection */}
  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "1.5rem" }}>
    <p style={{ fontWeight: "600", fontSize: "1rem", color: "#1f2937" }}>Select Size:</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
      {productData.sizes.map((item, index) => (
        <button
          key={index}
          onClick={() => setSize(item)}
          style={{
            border: `2px solid ${item === size ? "#fb923c" : "#d1d5db"}`,
            padding: "0.5rem 1.2rem",
            borderRadius: "8px",
            backgroundColor: "#f9fafb",
            fontWeight: "500",
            cursor: "pointer",
            boxShadow: item === size ? "0 0 0 2px rgba(251, 146, 60, 0.5)" : "none",
            transition: "all 0.3s ease",
          }}
        >
          {item}
        </button>
      ))}
    </div>
  </div>

  {/* Add to Cart Button */}
  <button
    onClick={() => addToCart(productData._id, size)}
    style={{
      marginTop: "1rem",
      padding: "0.75rem 1.5rem",
      backgroundColor: "#3b82f6",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      fontSize: "1rem",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
  >
    🛒 Add to Cart
  </button>

  {/* Divider */}
  <hr
    style={{
      margin: "2rem 0 1rem 0",
      width: "100%",
      borderColor: "#e5e7eb",
    }}
  />

  {/* Delivery Info */}
  <div style={{ fontSize: "0.95rem", color: "#6b7280", lineHeight: "1.7" }}>
    <p>✅ <strong>100% Original</strong> Products.</p>
    <p>💰 <strong>Cash On Delivery</strong> Available.</p>
    <p>🔁 <strong>5-Day</strong> Return and Exchange Policy.</p>
  </div>
</div>















      </div>

      {/* Description Section */}
      <div className="mt-20 max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
  {/* Tabs */}
  <div className="flex border-b bg-gray-50">
    <button className="px-6 py-4 text-sm font-semibold text-blue-600 border-b-2 border-blue-600 bg-white hover:bg-blue-50 transition-all duration-300">
      Description
    </button>
    <button className="px-6 py-4 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300">
      Reviews (122)
    </button>
  </div>

  {/* Description Content */}
  <div className="px-8 py-6 text-gray-700 text-sm sm:text-base leading-relaxed space-y-4 bg-white">
    <p className="flex items-start gap-2">
      <span>🧵</span>
      <span>
        <strong className="text-gray-800">Crafted with precision:</strong> This product is designed using high-quality materials that ensure durability and style.
      </span>
    </p>

    <p className="flex items-start gap-2">
      <span>✨</span>
      <span>
        <strong className="text-gray-800">Perfect for all occasions:</strong> Whether you're dressing up or going casual, it complements your style effortlessly.
      </span>
    </p>

    <p className="flex items-start gap-2">
      <span>🎁</span>
      <span>
        <strong className="text-gray-800">Makes a great gift:</strong> With elegant packaging and universal appeal, it's perfect for gifting loved ones.
      </span>
    </p>

    <p className="flex items-start gap-2">
      <span>🌍</span>
      <span>
        <strong className="text-gray-800">Eco-friendly:</strong> Designed with sustainable practices in mind, supporting a greener future.
      </span>
    </p>
  </div>
</div>


     
     
     
     
     
     
     
     
     
     
     
     
     
     
     
      {/* Related Products (Safe check added) */}
      {productData?.category && productData?.subCategory && (
        <RelatedProduct category={productData.category} subCategory={productData.subCategory} />

      )}
    </div>
  );
};

export default Product;
