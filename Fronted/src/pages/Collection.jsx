
import React, { useContext, useEffect, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import { assets } from "../assets/assets";
import Title from "../componet/title";
import Productitem from "../componet/productitem";

const Collection = () => {
  const { products, search, showSearch, loading, error, getFilteredProducts } = useContext(Shopcontext);
  const [showFilter, setshowfilter] = useState(false);
  const [filterProducts, setfilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevent");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) =>
        prev.filter((item) => item !== e.target.value)
      );
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyfilter = () => {
    let productsCopy = getFilteredProducts();
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }
    setfilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        setfilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setfilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyfilter();
        break;
    }
  };

  useEffect(() => {
    if (products && products.length > 0) {
      applyfilter();
    }
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "400px",
        paddingTop: "2rem"
      }}>
        <p>Loading collections...</p>
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

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: "2rem", paddingTop: "2rem", borderTop: "1px solid #e5e7eb", flexWrap: "wrap" }}>
      {/* Filter Section */}
      <div style={{ minWidth: "200px", backgroundColor: "#fff", borderRadius: "0.75rem", padding: "1.25rem", boxShadow: "0 0 12px rgba(0,0,0,0.05)" }}>
        <p
          onClick={() => setshowfilter(!showFilter)}
          style={{ marginBottom: "1rem", fontSize: "1.25rem", fontWeight: "600", display: "flex", alignItems: "center", cursor: "pointer", gap: "0.5rem" }}
        >
          FILTERS
          <img
            style={{ height: "0.75rem", transform: showFilter ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {showFilter && (
          <>
            {/* Categories */}
            <div style={{ marginBottom: "1.5rem" }}>
              <p style={{ marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "700" }}>CATEGORIES</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem", color: "#374151" }}>
                {["Men", "Women", "Kids"].map((cat) => (
                  <label key={cat} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input type="checkbox" value={cat} onChange={toggleCategory} />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Sub-Categories */}
            <div>
              <p style={{ marginBottom: "0.5rem", fontSize: "0.875rem", fontWeight: "700" }}>TYPE</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem", color: "#374151" }}>
                {["Topwear", "Bottomwear", "Winterwear"].map((type) => (
                  <label key={type} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <input type="checkbox" value={type} onChange={toggleSubCategory} />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Product Section */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <Title text1="All_" text2="COLLECTIONS" />
          <select
            onChange={(e) => setSortType(e.target.value)}
            style={{ border: "1px solid #d1d5db", fontSize: "0.875rem", padding: "0.5rem", borderRadius: "0.375rem" }}
          >
            <option value="relevent">Sort by: Relevent</option>
            <option value="low-high">Sort by: Low to High</option>
            <option value="high-low">Sort by: High to Low</option>
          </select>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filterProducts.length > 0 ? (
            filterProducts.map((item, index) => (
              <div
                key={item._id || index}
                style={{ backgroundColor: "#fff", padding: "1rem", borderRadius: "0.75rem", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", transition: "all 0.3s ease" }}
              >
                <Productitem
                  id={item._id}
                  image={item.image}
                  name={item.name}
                  price={item.price}
                />
              </div>
            ))
          ) : (
            <div style={{ 
              gridColumn: "1 / -1", 
              textAlign: "center", 
              padding: "40px",
              color: "#666"
            }}>
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;

