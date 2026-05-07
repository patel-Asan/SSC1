import React, { useEffect, useState } from "react";
import Navbar from "./component/navbar";
import Side from "./component/sidebar";
import { Routes, Route, useLocation } from "react-router-dom";
import ADD from "./page/Add";
import List from "./page/list";
import Orders from "./page/order";
import Dashboard from "./page/Dashboard";
import Messages from "./page/Messages";
import Reports from "./page/Reports";
import Categories from "./page/categories";
import Inventory from "./page/inventory";
import Reviews from "./page/reviews";
import Coupons from "./page/coupons";
import Customers from "./page/customers";
import Newsletter from "./page/newsletter";
import Login from "./component/login";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '₹'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="light"
      />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <Side sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0
          }}>
            <Navbar setToken={setToken} setSidebarOpen={setSidebarOpen} />
            <div style={{
              flex: 1,
              overflowX: "auto",
              animation: "fadeIn 0.4s ease-out"
            }}>
              <Routes>
                <Route path="/" element={<Dashboard token={token} />} />
                <Route path="/add" element={<ADD token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/order" element={<Orders token={token} />} />
                <Route path="/messages" element={<Messages token={token} />} />
                <Route path="/reports" element={<Reports token={token} />} />
                <Route path="/categories" element={<Categories token={token} />} />
                <Route path="/inventory" element={<Inventory token={token} />} />
                <Route path="/reviews" element={<Reviews token={token} />} />
                <Route path="/coupons" element={<Coupons token={token} />} />
                <Route path="/customers" element={<Customers token={token} />} />
                <Route path="/newsletter" element={<Newsletter token={token} />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
