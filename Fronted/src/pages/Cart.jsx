
import React, { useContext, useEffect, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import Title from "../componet/title";
import { assets } from "../assets/assets";
import CartTotal from "../componet/carttotal";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, token, navigate } = useContext(Shopcontext);
  const [cartData, setCartData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredTrash, setHoveredTrash] = useState(null);
  const [animateIndex, setAnimateIndex] = useState(null);

  const sizeColor = {
    S: "#fde68a",
    M: "#a7f3d0",
    L: "#bfdbfe",
    XL: "#fca5a5",
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    if(products.length > 0){
        const tempData = [];
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        const quantity = cartItems[productId][size];
        if (quantity > 0) {
          tempData.push({
            _id: productId,
            size,
            quantity,
          });
        }
      }
    }
    setCartData(tempData);
    }
    
  }, [cartItems, token]);

  // Show login prompt if not authenticated
  if (!token) {
    return (
      <div style={{ 
        paddingTop: "3.5rem", 
        paddingLeft: "1rem", 
        paddingRight: "1rem",
        textAlign: "center",
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          <Title text1="YOUR_" text2="CART" />
        </div>
        <div style={{
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          maxWidth: "400px"
        }}>
          <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
            Please login to view your cart
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#2563eb"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#3b82f6"}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "3.5rem", paddingLeft: "1rem", paddingRight: "1rem" }}>
      {/* Title */}
      <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
        <Title text1="YOUR_" text2="CART" />
      </div>

      {/* Cart Items */}
      <div>
        {cartData.length === 0 ? (
          <p style={{ color: "#6b7280" }}>Your cart is empty.</p>
        ) : (
          cartData.map((item, index) => {
            const productData = products.find((p) => p._id === item._id);
            if (!productData) return null;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  padding: "1rem 0",
                  borderBottom: "1px solid #e5e7eb",
                  display: "grid",
                  gridTemplateColumns: "4fr 2fr 1fr",
                  alignItems: "center",
                  gap: "1rem",
                  boxShadow:
                    hoveredIndex === index
                      ? "0 8px 16px rgba(0,0,0,0.05)"
                      : "none",
                  transform:
                    hoveredIndex === index ? "translateY(-2px)" : "translateY(0)",
                  transition: "all 0.3s ease",
                }}
              >
                {/* Product Details */}
                <div style={{ display: "flex", alignItems: "start", gap: "1rem" }}>
                  <img
                    src={productData.image[0]}
                    alt={productData.name}
                    style={{ width: "4rem", height: "auto" }}
                  />
                  <div>
                    <p style={{ fontSize: "1rem", fontWeight: "600" }}>
                      {productData.name}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                        marginTop: "0.5rem",
                      }}
                    >
                      <p>
                        {currency}
                        {productData.price}
                      </p>
                      <p
                        style={{
                          padding: "0.3rem 0.8rem",
                          backgroundColor:
                            sizeColor[item.size] || "#f3f4f6",
                          borderRadius: "0.5rem",
                          fontSize: "0.85rem",
                        }}
                      >
                        {item.size}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quantity Input */}
                <input
                  type="number"
                  min={1}
                  defaultValue={item.quantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val > 0) {
                      updateQuantity(item._id, item.size, val);
                      setAnimateIndex(index);
                      setTimeout(() => setAnimateIndex(null), 200);
                    }
                  }}
                  style={{
                    border: "1px solid #d1d5db",
                    maxWidth: "4rem",
                    padding: "0.3rem 0.6rem",
                    transform:
                      animateIndex === index ? "scale(1.1)" : "scale(1)",
                    transition: "transform 0.2s ease",
                  }}
                />

                {/* Delete Icon */}
                <img
                  onClick={() => updateQuantity(item._id, item.size, 0)}
                  onMouseEnter={() => setHoveredTrash(index)}
                  onMouseLeave={() => setHoveredTrash(null)}
                  src={assets.bin_icon}
                  alt="Delete"
                  style={{
                    width: "1.25rem",
                    cursor: "pointer",
                    filter:
                      hoveredTrash === index
                        ? "grayscale(0)"
                        : "grayscale(1)",
                    transition: "filter 0.2s ease",
                    marginRight: "1rem",
                  }}
                />
              </div>
            );
          })
        )}
      </div>

      {/* Floating Checkout Button */}
    {cartData.length > 0 && (
  <div
    style={{
      position: "fixed",
      bottom: "1rem",
      right: "1rem",
      zIndex: 50,
      width: "100%",
      maxWidth: "500px",
      transition: "all 0.3s ease-in-out",
    }}
    className="sm:right-8"
  >
    <div className="flex justify-end">
      <div
        className="w-full sm:w-[450px] bg-white border border-gray-200 rounded-xl shadow-xl px-5 py-4"
        style={{
          backdropFilter: "blur(6px)",
        }}
      >
        <CartTotal />
      </div>
    </div>
  </div>
)}



    </div>
  );
};

export default Cart;
