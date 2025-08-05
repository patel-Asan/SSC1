
import React, { useContext, useEffect, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import Title from "./title";
import Productitem from "./productitem";

const Bestseller = () => {
  const { products, loading, error, getBestsellerProducts } = useContext(Shopcontext);
  const [bestseller, setBestseller] = useState([]);
  const [columns, setColumns] = useState(5);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (products && products.length > 0) {
      const bestProducts = getBestsellerProducts();
      setBestseller(bestProducts.slice(0, 5));
    }
  }, [products, getBestsellerProducts]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(2);
      else if (width < 768) setColumns(3);
      else if (width < 1024) setColumns(4);
      else setColumns(5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div style={{
        margin: "60px 0",
        padding: "0 20px",
        textAlign: "center",
        fontFamily: "'Poppins', sans-serif",
      }}>
        <p>Loading bestsellers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        margin: "60px 0",
        padding: "0 20px",
        textAlign: "center",
        fontFamily: "'Poppins', sans-serif",
      }}>
        <p style={{ color: "#e74c3c" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div
      style={{
        margin: "60px 0",
        padding: "0 20px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* TITLE SECTION */}
      <div style={{ textAlign: "center", paddingBottom: "30px" }}>
        <div
          style={{
            fontSize: "clamp(28px, 6vw, 48px)",
            fontWeight: "900",
            background: "linear-gradient(to right, #8b5cf6, #84cc16)",
           
            letterSpacing: animate ? "3px" : "0.5px",
            transform: animate ? "translateY(0)" : "translateY(30px)",
            opacity: animate ? 1 : 0,
            transition: "all 1s ease-in-out",
            textShadow: "2px 2px 10px rgba(0,0,0,0.15)",
          }}
        >
          <Title text1="BEST_" text2="SELLER" />
        </div>

        {/* DESCRIPTION TEXT */}
       <p
  style={{
    maxWidth: "720px",
    margin: "20px auto 0",
    fontSize: "clamp(13px, 2vw, 18px)",
    fontWeight: "500",
    lineHeight: "1.7",
    letterSpacing: animate ? "1px" : "0px",
    color: "#fff",
    background: animate
      ? "linear-gradient(90deg, #6366f1, #22d3ee)"
      : "transparent",
    WebkitBackgroundClip: animate ? "text" : "unset",
    WebkitTextFillColor: animate ? "transparent" : "#374151",
    opacity: animate ? 1 : 0,
    transform: animate ? "translateY(0px) scale(1)" : "translateY(40px) scale(0.98)",
    transition: "all 1s ease-in-out 0.3s",
    textAlign: "center",
    textShadow: animate ? "2px 2px 8px rgba(0, 0, 0, 0.1)" : "none",
  }}
>
  Discover our top-rated picks — handpicked by the community, curated
  for style and quality. Don't miss what everyone’s loving right now!
</p>

      </div>

      {/* PRODUCT GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: "20px",
          alignItems: "stretch",
          justifyContent: "center",
        }}
      >
        {bestseller.map((item, index) => (
          <Productitem
            key={index}
            id={item._id}
            name={item.name}
            image={item.image}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default Bestseller;


