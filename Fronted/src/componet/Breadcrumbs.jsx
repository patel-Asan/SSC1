import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (location.pathname === "/") return null;

  const breadcrumbMap = {
    collection: "Collection",
    about: "About Us",
    contact: "Contact",
    cart: "Shopping Cart",
    login: "Login",
    placeorder: "Checkout",
    order: "My Orders",
    profile: "My Profile",
    wishlist: "Wishlist",
    product: "Product Details",
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        padding: "16px 40px",
        backgroundColor: "#fafbfc",
        borderBottom: "1px solid #f3f4f6",
      }}
    >
      <ul
        style={{
          display: "flex",
          alignItems: "center",
          listStyle: "none",
          margin: 0,
          padding: 0,
          fontSize: "14px",
          color: "#6b7280",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <li>
          <Link
            to="/"
            style={{
              color: "#ff6f61",
              textDecoration: "none",
              fontWeight: "500",
              transition: "color 0.2s",
            }}
          >
            Home
          </Link>
        </li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const displayName = breadcrumbMap[name] || name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <React.Fragment key={name}>
              <li style={{ color: "#d1d5db" }}>/</li>
              <li>
                {isLast ? (
                  <span style={{ color: "#374151", fontWeight: "600" }}>
                    {displayName}
                  </span>
                ) : (
                  <Link
                    to={routeTo}
                    style={{
                      color: "#ff6f61",
                      textDecoration: "none",
                      fontWeight: "500",
                      transition: "color 0.2s",
                    }}
                  >
                    {displayName}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </motion.nav>
  );
};

export default Breadcrumbs;
