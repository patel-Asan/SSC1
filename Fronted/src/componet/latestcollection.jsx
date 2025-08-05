import React, { useContext, useEffect, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import Title from "./title";
import Productitem from "./productitem";
import './app1.css';

const Latestcollection = () => {
  const { products, loading, error } = useContext(Shopcontext);
  const [latestproducts, setlatestproducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      // Get the latest 10 products (sorted by date)
      const sortedProducts = [...products].sort((a, b) => b.date - a.date);
      setlatestproducts(sortedProducts.slice(0, 10));
    }
  }, [products]);

  if (loading) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", backgroundColor: "#f9fafb" }}>
        <p>Loading latest collections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", backgroundColor: "#f9fafb" }}>
        <p style={{ color: "#e74c3c" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "40px 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#f9fafb",
      }}
    >
      {/* Title Section */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "700",
            marginBottom: "10px",
            color: "#222",
            letterSpacing: "1px",
            textTransform: "uppercase",
            animation: "fadeInDown 0.6s ease-out",
          }}
        >
          <Title text1={"NEW_"} text2={"COLLECTIONS"} />
        </h2>
        <p
          className="color-animation"
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            fontSize: "15px",
            lineHeight: "1.6",
            fontWeight: "600",
            background: "black",
            padding: "14px 20px",
            borderRadius: "10px",
            textAlign: "center",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          Discover our freshest styles and top picks for the season. Whether you're into modern basics or bold statements, we've got something new just for you.
        </p>
      </div>

      {/* Product Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          justifyItems: "center",
        }}
      >
        {latestproducts.length > 0 ? (
          latestproducts.map((item, index) => (
            <Productitem
              key={item._id || index}
              id={item._id}
              image={item.image}
              name={item.name}
              price={item.price}
            />
          ))
        ) : (
          <div style={{ 
            gridColumn: "1 / -1", 
            textAlign: "center", 
            padding: "40px",
            color: "#666"
          }}>
            <p>No products available at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Latestcollection;


