import React from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import Home from "./pages/home";
import Collection from "./pages/Collection";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Placeorder from "./pages/Placeorder";
import Order from "./pages/order";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Nav from "./componet/nav";
import Footer from "./componet/footer";
import SearchBar from "./componet/searchbar";
import ScrollToTop from "./componet/ScrollToTop";
import PromoBanner from "./componet/PromoBanner";
import PageTransition from "./componet/PageTransition";
import { ToastContainer } from 'react-toastify';
import { AnimatePresence, motion } from "framer-motion";

const AppContent = () => {
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        maxWidth: "1600px",
        margin: "0 auto",
        backgroundColor: "#fff",
        minHeight: "100vh",
      }}
    >
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Nav />
      <PromoBanner />
      <SearchBar />
      
      <main style={{ minHeight: "calc(100vh - 300px)" }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/collection" element={<PageTransition><Collection /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/product/:productId" element={<PageTransition><Product /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/placeorder" element={<PageTransition><Placeorder /></PageTransition>} />
            <Route path="/order" element={<PageTransition><Order /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      
      <Footer />
      <ScrollToTop />
    </motion.div>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;
