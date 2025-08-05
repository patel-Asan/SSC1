import React, { useEffect, useState } from "react";
import Navbar from "./component/navbar";
import Side from "./component/sidebar";
import { Routes, Route } from "react-router-dom";
import ADD from "./page/Add";
import List from "./page/list";
import Orders from "./page/order";
import Dashboard from "./page/Dashboard";
import Users from "./page/Users";
import Login from "./component/login";
import { ToastContainer} from 'react-toastify';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '$'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  return (
    <div>
        <ToastContainer />
      {token === "" ? (
        <Login setToken={setToken} />
      ) : (
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div style={{ display: "flex" }}>
            <Side />
            <div style={{ flex: 1, padding: "20px" }}>
              <Routes>
                <Route path="/" element={<Dashboard token={token} />} />
                <Route path="/dashboard" element={<Dashboard token={token} />} />
                <Route path="/add" element={<ADD token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/order" element={<Orders token={token} />} />
                <Route path="/users" element={<Users token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
