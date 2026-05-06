import React, { useContext, useEffect, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import { assets } from "../assets/assets";
import Title from "../componet/title";
import Productitem from "../componet/productitem";
import ProductSkeleton from "../componet/ProductSkeleton";
import { motion, AnimatePresence } from "framer-motion";

const Collection = () => {
  const { products, search, showSearch, loading, error, getFilteredProducts, fetchProducts } = useContext(Shopcontext);
  const [showFilter, setShowFilter] = useState(true);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showOnSale, setShowOnSale] = useState(false);
  const [showBestseller, setShowBestseller] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Fetch products when component mounts (page reload)
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setShowFilter(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = getFilteredProducts();
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) => category.includes(item.category));
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) => subCategory.includes(item.subCategory));
    }
    productsCopy = productsCopy.filter((item) => item.price >= priceRange[0] && item.price <= priceRange[1]);
    if (showOnSale) {
      productsCopy = productsCopy.filter((item) => item.discount > 0 || item.oldPrice > item.price);
    }
    if (showBestseller) {
      productsCopy = productsCopy.filter((item) => item.bestseller || item.isBestseller);
    }
    if (inStockOnly) {
      productsCopy = productsCopy.filter((item) => !item.stock || item.stock > 0);
    }
    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = [...filterProducts];
    switch (sortType) {
      case "low-high":
        fpCopy.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        fpCopy.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        fpCopy.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        break;
      case "name-az":
        fpCopy.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-za":
        fpCopy.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    setFilterProducts(fpCopy);
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products, priceRange, showOnSale, showBestseller, inStockOnly]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  if (loading) {
    return (
      <div style={{ paddingTop: isMobile ? "6rem" : "8rem", paddingLeft: isMobile ? "16px" : "40px", paddingRight: isMobile ? "16px" : "40px", maxWidth: "1400px", margin: "0 auto" }}>
        <motion.div style={{ marginBottom: "2rem" }} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <Title text1="All_" text2="COLLECTIONS" />
        </motion.div>
        <ProductSkeleton count={isMobile ? 4 : 8} />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "60vh",
          paddingTop: "6rem",
          textAlign: "center"
        }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          style={{
            backgroundColor: "#fef2f2",
            padding: "40px",
            borderRadius: "24px",
            maxWidth: "400px"
          }}
        >
          <span style={{ fontSize: "48px" }}>⚠️</span>
          <h3 style={{ color: "#dc2626", marginTop: "16px", marginBottom: "8px" }}>Oops! Something went wrong</h3>
          <p style={{ color: "#991b1b" }}>{error}</p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ 
        paddingTop: isMobile ? "5rem" : "6rem", 
        paddingLeft: isMobile ? "12px" : "40px", 
        paddingRight: isMobile ? "12px" : "40px",
        maxWidth: "1400px",
        margin: "0 auto",
        overflowX: "hidden",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Header Section - Mobile: Shows above filter */}
      <motion.div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: isMobile ? "16px" : "24px",
          flexWrap: "wrap",
          gap: "12px",
          position: "relative",
          zIndex: 20,
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Title text1="All_" text2="COLLECTIONS" />
        {!isMobile && (
          <motion.select
            onChange={(e) => setSortType(e.target.value)}
            whileHover={{ borderColor: "#ff6f61" }}
            style={{
              border: "2px solid #e5e7eb",
              fontSize: "14px",
              padding: "10px 16px",
              borderRadius: "12px",
              cursor: "pointer",
              outline: "none",
              backgroundColor: "#fff",
              color: "#1f2937",
            }}
          >
            <option value="relevant">Sort by: Relevant</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </motion.select>
        )}
      </motion.div>

      <div style={{ display: "flex", gap: isMobile ? "16px" : "40px", flexDirection: isMobile ? "column" : "row", position: "relative", zIndex: 1, width: "100%", alignItems: "flex-start" }}>
        {/* Filter Section - Mobile: Collapsible */}
        <motion.div 
          style={{ 
            width: isMobile ? "100%" : "250px", 
            backgroundColor: "#fff", 
            borderRadius: isMobile ? "12px" : "20px", 
            padding: isMobile ? "12px" : "24px", 
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            height: "fit-content",
            position: "relative",
            zIndex: 10,
            boxSizing: "border-box",
            flexShrink: 0,
            order: 1,
          }}
          initial={{ x: isMobile ? 0 : -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: isMobile ? 0.1 : 0 }}
        >
          <motion.p
            onClick={() => setShowFilter(!showFilter)}
            style={{ 
              marginBottom: showFilter ? "16px" : "0px", 
              fontSize: isMobile ? "16px" : "18px", 
              fontWeight: "700", 
              display: "flex", 
              alignItems: "center", 
              cursor: "pointer", 
              gap: "8px",
              color: "#1f2937",
              justifyContent: "space-between",
            }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff6f61" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              FILTERS
            </span>
            <motion.span
              animate={{ rotate: showFilter ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              style={{ 
                fontSize: "12px",
                color: "#6b7280",
                transform: showFilter ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▼
            </motion.span>
          </motion.p>

          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ overflow: "hidden", width: "100%" }}
              >
                <div style={{ marginBottom: "20px" }}>
                  <p style={{ marginBottom: "10px", fontSize: "13px", fontWeight: "700", color: "#374151" }}>CATEGORIES</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {["Men", "Women", "Kids"].map((cat) => (
                      <label key={cat} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#374151" }}>
                        <input 
                          type="checkbox" 
                          value={cat} 
                          onChange={toggleCategory}
                          style={{ cursor: "pointer", width: "16px", height: "16px", accentColor: "#ff6f61" }}
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <p style={{ marginBottom: "10px", fontSize: "13px", fontWeight: "700", color: "#374151" }}>TYPE</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {["Topwear", "Bottomwear", "Winterwear"].map((type) => (
                      <label key={type} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#374151" }}>
                        <input 
                          type="checkbox" 
                          value={type} 
                          onChange={toggleSubCategory}
                          style={{ cursor: "pointer", width: "16px", height: "16px", accentColor: "#ff6f61" }}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <p style={{ marginBottom: "10px", fontSize: "13px", fontWeight: "700", color: "#374151" }}>PRICE RANGE</p>
                  <div style={{ padding: "0 4px" }}>
                    <input
                      type="range"
                      min="0"
                      max="10000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      style={{ width: "100%", accentColor: "#ff6f61" }}
                    />
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <p style={{ marginBottom: "10px", fontSize: "13px", fontWeight: "700", color: "#374151" }}>QUICK FILTERS</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#374151" }}>
                      <input type="checkbox" checked={showOnSale} onChange={(e) => setShowOnSale(e.target.checked)} style={{ accentColor: "#ff6f61" }} />
                      On Sale
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#374151" }}>
                      <input type="checkbox" checked={showBestseller} onChange={(e) => setShowBestseller(e.target.checked)} style={{ accentColor: "#ff6f61" }} />
                      Bestseller
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", color: "#374151" }}>
                      <input type="checkbox" checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} style={{ accentColor: "#ff6f61" }} />
                      In Stock Only
                    </label>
                  </div>
                </div>

                {(category.length > 0 || subCategory.length > 0 || showOnSale || showBestseller || inStockOnly) && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setCategory([]); setSubCategory([]); setShowOnSale(false); setShowBestseller(false); setInStockOnly(false); setPriceRange([0, 10000]); }}
                    style={{
                      width: "100%",
                      padding: "10px",
                      backgroundColor: "#ff6f61",
                      color: "#fff",
                      border: "none",
                      borderRadius: "10px",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Clear All Filters
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Product Section */}
        <div style={{ flex: 1, position: "relative", zIndex: 5, minWidth: 0, width: isMobile ? "100%" : "auto", order: 2 }}>
          {/* Mobile Sort Dropdown - Only shows on mobile */}
          {isMobile && (
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              style={{ marginBottom: "16px" }}
            >
              <select
                onChange={(e) => setSortType(e.target.value)}
                style={{
                  width: "100%",
                  border: "2px solid #e5e7eb",
                  fontSize: "14px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  outline: "none",
                  backgroundColor: "#fff",
                  color: "#1f2937",
                }}
              >
                <option value="relevant">Sort by: Relevant</option>
                <option value="low-high">Sort by: Low to High</option>
                <option value="high-low">Sort by: High to Low</option>
              </select>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "repeat(2, minmax(0, 1fr))" : "repeat(auto-fill, minmax(250px, 1fr))",
              gap: isMobile ? "10px" : "24px",
              width: "100%",
            }}
          >
            {filterProducts.length > 0 ? (
              filterProducts.map((item, index) => (
                <motion.div
                  key={item._id || index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Productitem
                    id={item._id}
                    image={item.image}
                    name={item.name}
                    price={item.price}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  gridColumn: "1 / -1", 
                  textAlign: "center", 
                  padding: "80px 20px",
                }}
              >
                <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔍</div>
                <h3 style={{ color: "#374151", fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}>No products found</h3>
                <p style={{ color: "#9ca3af", fontSize: "14px" }}>Try adjusting your filters or search criteria</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Collection;

