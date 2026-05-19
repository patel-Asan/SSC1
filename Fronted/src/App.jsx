import React, { Suspense, lazy } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import Nav from "./componet/nav";
import Footer from "./componet/footer";
import SearchBar from "./componet/searchbar";
import ScrollToTop from "./componet/ScrollToTop";
import PromoBanner from "./componet/PromoBanner";
import PageTransition from "./componet/PageTransition";
import { ToastContainer } from 'react-toastify';
import { AnimatePresence, motion } from "framer-motion";

const Home = lazy(() => import("./pages/Home"));
const Collection = lazy(() => import("./pages/Collection"));
const Contact = lazy(() => import("./pages/Contact"));
const About = lazy(() => import("./pages/About"));
const Product = lazy(() => import("./pages/Product"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Placeorder = lazy(() => import("./pages/Placeorder"));
const Order = lazy(() => import("./pages/order"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const Profile = lazy(() => import("./pages/Profile"));
const Wishlist = lazy(() => import("./pages/Wishlist"));

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
        background: "linear-gradient(180deg, #f8fbff 0%, #ffffff 40%, #f4f7ff 100%)",
        minHeight: "100vh",
        overflowX: "hidden",
        color: "#111827",
      }}
    >
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        limit={3}
        style={{ zIndex: 10001 }}
        toastStyle={{ 
          marginTop: "120px", 
          borderRadius: "14px", 
          padding: "14px 20px",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      />
      <Nav />
      <PromoBanner />
      <SearchBar />
      
      <main style={{ minHeight: "calc(100vh - 300px)" }}>
        <AnimatePresence mode="wait">
          <Suspense fallback={
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
              <div style={{
                width: 40, height: 40, border: '4px solid #f3f4f6',
                borderTop: '4px solid #ff6f61', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
          }>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/collection" element={<PageTransition><Collection /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/product/:productId" element={<PageTransition><Product /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
            <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
            <Route path="/placeorder" element={<PageTransition><Placeorder /></PageTransition>} />
            <Route path="/order-success" element={<PageTransition><OrderSuccess /></PageTransition>} />
            <Route path="/order" element={<PageTransition><Order /></PageTransition>} />
            <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
            <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
          </Routes>
          </Suspense>
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
