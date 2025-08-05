

import React, { useContext, useEffect, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import Title from "./title";

const CartTotal = ({ hideCheckout }) => {
  const { currency, delivery_fee, getCartAmount, navigate} = useContext(Shopcontext);
  const subtotal = getCartAmount();
  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div
      className={`w-full max-w-lg mx-auto p-4 sm:p-6 md:p-8 rounded-2xl 
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} 
        transition-all duration-700 ease-out shadow-xl hover:shadow-2xl 
        hover:scale-[1.015]`}
      style={{
        backgroundColor: "#f1f5f9", // Box background color
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#1e293b",
        border: "3px solid black", // ✅ 3px black border applied
      }}
    >
      {/* Title */}
      <div
        className="text-xl sm:text-2xl font-extrabold mb-4 sm:mb-6 tracking-wide"
        style={{
          color: "#3b82f6",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <Title text1="&nbsp;&nbsp;&nbsp;&nbsp;CART_" text2="TOTAL" />
      </div>

      {/* Totals */}
      <div className="flex flex-col gap-4 text-sm sm:text-base">
        <div className="flex justify-between">
          <span className="text-slate-600">&nbsp;&nbsp;&nbsp;&nbsp;Subtotal</span>
          <span className="font-semibold">{currency}{subtotal}.00&nbsp;&nbsp;</span>
        </div>
        <hr className="border-slate-300" />

        <div className="flex justify-between">
          <span className="text-slate-600">&nbsp;&nbsp;&nbsp;&nbsp;Shipping Fee</span>
          <span className="font-semibold">{currency}{delivery_fee}&nbsp;&nbsp;</span>
        </div>
        <hr className="border-slate-300" />

        <div className="flex justify-between text-lg font-bold mt-2 text-blue-700">
          <span>&nbsp;&nbsp;&nbsp;&nbsp;Total</span>
          <span>{currency}{total}&nbsp;&nbsp;</span>
        </div>
      </div>
<br></br>
      {/* Box Button */}
      {!hideCheckout && subtotal > 0 && (
        <div className="mt-6">
          <button onClick={()=>navigate('/placeorder')}
            className="w-full py-3 px-6 rounded-xl font-semibold shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center text-white"
            style={{
              backgroundColor: "#3b82f6", 
              height:'30px'// blue
            }}
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default CartTotal;

