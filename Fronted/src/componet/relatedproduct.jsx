
import React, { useContext, useEffect, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import Title from "./title";
import Productitem from "./productitem";
import { motion } from "framer-motion";

const RelatedProduct = ({ category, subCategory }) => {
  const { products } = useContext(Shopcontext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0 && category && subCategory) {
      let productsCopy = [...products];
      productsCopy = productsCopy.filter(
        (item) => item.category === category && item.subCategory === subCategory
      );
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category, subCategory]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      style={{
        padding: "80px 40px",
        backgroundColor: "#fafbfc",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ marginBottom: "48px" }}
      >
        <Title text1="Related" text2="Products" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "24px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {related.length === 0 ? (
          <p style={{ textAlign: "center", gridColumn: "1/-1", color: "#9ca3af", fontSize: "16px" }}>
            No related products found.
          </p>
        ) : (
          related.map((item, index) => (
            <motion.div
              key={item._id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Productitem
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
              />
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
};

export default RelatedProduct;
