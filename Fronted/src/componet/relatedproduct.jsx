// import React, { useContext, useEffect, useState } from "react";
// import { Shopcontext } from "../context/shopcontext";
// import Title from "./title";
// import Productitem from "./productitem";

// const RelatedProduct = ({ category, subCategory }) => {
//   const { products } = useContext(Shopcontext);
//   const [related, setRelated] = useState([]);

//   useEffect(() => {
//     if (products.length > 0) {
//       let productsCopy = [...products];
//       productsCopy = productsCopy.filter((item) => category === item.category);
//       productsCopy = productsCopy.filter((item) => subCategory === item.subCategory);
//       setRelated(productsCopy.slice(0, 5));
//     }
//   }, [products]);

//   return (
//     <div
//       className="my-20 px-4 sm:px-10"
//       style={{
//         background: "#f3f4f6", // Tailwind gray-100
//         paddingTop: "2rem",
//         paddingBottom: "2rem",
//         borderRadius: "1rem",
//       }}
//     >
//       {/* Title Section */}
//       <div className="text-center mb-8">
//         <Title text1="Related" text2="Products" />
//       </div>

//       {/* Products Grid */}
//       <div
//         className="grid gap-6 sm:gap-6 md:gap-8"
//         style={{
//           display: "grid",
//           gridTemplateColumns:
//             "repeat(auto-fill, minmax(140px, 1fr))",
//         }}
//       >
//         {related.map((item, index) => (
//           <div
//             key={index}
//             className="hover:shadow-lg hover:scale-[1.02] transition duration-200 ease-in-out bg-white p-3 rounded-xl"
//             style={{
//               boxShadow: "0 1px 4px rgba(0, 0, 0, 0.06)",
//               transition: "transform 0.2s ease-in-out",
//               cursor: "pointer",
//             }}
//           >
//             <Productitem
//             key={index}
//             id={item._id}
//             name={item.name}
//             image={item.image}
//             price={item.price}
//           />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RelatedProduct;

import React, { useContext, useEffect, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import Title from "./title";
import Productitem from "./productitem";

const RelatedProduct = ({ category, subCategory }) => {
  const { products } = useContext(Shopcontext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    console.log("All products:", products);
    console.log("Filter category:", category);
    console.log("Filter subCategory:", subCategory);

    if (products.length > 0 && category && subCategory) {
      let productsCopy = [...products];
      productsCopy = productsCopy.filter(
        (item) => item.category === category && item.subCategory === subCategory
      );
      console.log("Filtered related products:", productsCopy);
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, category, subCategory]);

  return (
    <div
      style={{
        background: "#f9fafb",
        padding: "2rem 1rem",
        borderRadius: "1rem",
        marginTop: "80px",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <Title text1="Related" text2="Products" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "20px",
        }}
      >
        {related.length === 0 ? (
          <p style={{ textAlign: "center", gridColumn: "1/-1" }}>
            No related products found.
          </p>
        ) : (
          related.map((item, index) => (
            <div
              key={index}
              style={{
                background: "#fff",
                padding: "12px",
                borderRadius: "16px",
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
                transition: "transform 0.3s ease-in-out",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <Productitem
                id={item._id}
                name={item.name}
                image={item.image}
                price={item.price}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RelatedProduct;
