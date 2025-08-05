

import React, { useContext, useState, useEffect } from "react";
import { Shopcontext } from "../context/shopcontext";
import Title from "../componet/title";
import axios from "axios";


const Order = () => {
  const { backendUrl, token, currency } = useContext(Shopcontext);

  const [orderData,setordedata] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadOrderData = async () =>{
    try{
      setLoading(true)
      setError(null)
      
      if(!token){
        setError("No authentication token found")
        return
      }
      
      const response = await axios.post(backendUrl + '/api/order/userorders ',{},{headers:{token}})
      
      if(response.data.success){
        let allOrdersItem = []
        
        if(response.data.orders && Array.isArray(response.data.orders)){
          response.data.orders.forEach((order)=>{
            if(order.items && Array.isArray(order.items)){
              order.items.forEach((item)=>{
                item['status']=order.status
                item['payment']= order.payment
                item['paymentMethod']=order.paymentMethod
                item['data']=order.data
                allOrdersItem.push(item)
              })
            }
          })
        }
        
        setordedata(allOrdersItem.reverse());
      } else {
        setError("Failed to load orders")
      }
    }catch (error) {
      console.error("Error loading orders:", error)
      setError("Failed to load orders. Please try again.")
    } finally {
      setLoading(false)
    }
  }

   useEffect(()=>{
  loadOrderData()
   },[token])

  return (
    <div style={wrapperStyle}>
      <div style={titleStyle}>
        <Title text1="MY_" text2="ORDER" />
      </div>

      <div style={{ marginTop: "30px", width: "100%" }}>
        {loading && (
          <div style={loadingStyle}>
            <p>Loading orders...</p>
          </div>
        )}
        
        {error && (
          <div style={errorStyle}>
            <p>{error}</p>
            <button onClick={loadOrderData} style={retryBtnStyle}>Retry</button>
          </div>
        )}
        
        {!loading && !error && orderData.length === 0 && (
          <div style={emptyStyle}>
            <p>No orders found</p>
          </div>
        )}
        
        {!loading && !error && orderData.map((item, index) => (
          <div
            key={index}
            style={{
              ...cardStyle,
              animation: "fadeInUp 0.6s ease-out",
            }}
          >
            {/* Product + Info */}
            <div style={orderRowStyle}>
              <div style={leftSectionStyle}>
                <img
                  src={item.image && item.image[0] ? item.image[0] : '/placeholder-image.jpg'}
                  alt="product"
                  style={imageStyle}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg'
                  }}
                />
                <div>
                  <p style={productNameStyle}>{item.name || 'Product Name'}</p>
                  <div style={metaDataStyle}>
                    <p style={priceStyle}>{currency}{item.price || 0}</p>
                    <p style={labelStyle}>Quantity: {item.quantity || 0}</p>
                    <p style={labelStyle}>Size: {item.size || 'N/A'}</p>
                  </div>
                  <p style={dateStyle}>
                    DATE: <span style={{ color: "#9ca3af" }}>{item.data ? new Date(item.data).toDateString() : 'N/A'}</span>
                  </p>
                  <p style={dateStyle}>
                    Payment: <span style={{ color: "#9ca3af" }}>{item.paymentMethod || 'N/A'}</span>
                  </p>
                </div>
              </div>

              {/* Status + Button */}
              <div style={rightSectionStyle}>
                <div style={statusBoxStyle}>
                  <span style={statusDot}></span>
                  <p style={statusText}>{item.status || 'Pending'}</p>
                </div>
                <button onClick={loadOrderData} style={trackBtnStyle}>Track Order</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🔵 Inline CSS

const wrapperStyle = {
  padding: "40px 16px",
  fontFamily: "'Segoe UI', sans-serif",
  backgroundColor: "#f1f5f9",
};

const titleStyle = {
  fontSize: "28px",
  fontWeight: "700",
  textAlign: "center",
};

const cardStyle = {
  backgroundColor: "#fff",
  marginBottom: "20px",
  padding: "20px",
  borderRadius: "16px",
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.07)",
  transition: "all 0.3s ease",
  maxWidth: "100%",
};

const orderRowStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  justifyContent: "space-between",
  alignItems: "flex-start",

  // Responsive styles
  '@media (min-width: 768px)': {
    flexDirection: "row",
    alignItems: "center",
  }
};

const leftSectionStyle = {
  display: "flex",
  gap: "16px",
  flex: "1",
  alignItems: "flex-start",
};

const imageStyle = {
  width: "80px",
  height: "80px",
  objectFit: "cover",
  borderRadius: "8px",
  flexShrink: 0,
};

const productNameStyle = {
  fontSize: "16px",
  fontWeight: "600",
  marginBottom: "6px",
  color: "#1e293b",
};

const metaDataStyle = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  fontSize: "14px",
  color: "#475569",
};

const labelStyle = {
  fontWeight: "500",
};

const priceStyle = {
  color: "#1e3a8a",
  fontWeight: "700",
};

const dateStyle = {
  fontSize: "14px",
  marginTop: "8px",
  color: "#334155",
};

const rightSectionStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  alignItems: "flex-end",
  justifyContent: "center",

  // Responsive
  '@media (min-width: 768px)': {
    alignItems: "flex-end",
  }
};

const statusBoxStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const statusDot = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  backgroundColor: "#16a34a",
};

const statusText = {
  fontSize: "14px",
  fontWeight: "500",
  color: "#065f46",
};

const trackBtnStyle = {
  padding: "10px 16px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "600",
  fontSize: "14px",
  cursor: "pointer",
  transition: "transform 0.3s ease, background-color 0.3s ease",
  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
};

const loadingStyle = {
  textAlign: "center",
  padding: "20px",
  color: "#6b7280",
};

const errorStyle = {
  textAlign: "center",
  padding: "20px",
  color: "#991b1b",
  backgroundColor: "#fef3f2",
  border: "1px solid #fca5a5",
  borderRadius: "8px",
  marginBottom: "20px",
};

const retryBtnStyle = {
  padding: "10px 20px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  fontWeight: "600",
  fontSize: "14px",
  cursor: "pointer",
  transition: "transform 0.3s ease, background-color 0.3s ease",
  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
};

const emptyStyle = {
  textAlign: "center",
  padding: "20px",
  color: "#6b7280",
};

// 🔄 Optional keyframe effect (CSS only if allowed in global style)
/*
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
*/

export default Order;
