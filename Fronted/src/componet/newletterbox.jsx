// import React from "react";

// const Newletterbox=() =>{

//     const submithandle =(event) =>{
//         event.preventDefault();
//     }
//     return(
//         <div className="text-center">
//             <p className="text-2xl font-medium text-gray-800">Subscribe Now! & Get 15% Off </p>
//         <p className="text-gray-400 mt-3">
//             truyjgufrd yruygc yt5rfuygf rfkytuyjgjhrdthgvc ytfr
//         </p>
//         <form onSubmit={submithandle}     className="w-full sm:w-1/2 flex item-center gap-3 mx-auto my-6 border pl-3">
//             <input className="w-full" type="email" placeholder="Enter Your Email" required />
//             <button type="submit"className=" bg-black text-white text-xs px-10 py-4"> SUBSCRIBE</button>
//         </form>
//      </div>
//     );
//     }
//     export default Newletterbox

import React from "react";

const Newletterbox = () => {
  const submithandle = (event) => {
    event.preventDefault();
  };

  // Styles
  const containerStyle = {
    textAlign: "center",
    padding: "40px 20px",
    backgroundColor: "#f9fafb",
    borderRadius: "16px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    maxWidth: "800px",
    margin: "40px auto",
  };

  const titleStyle = {
    fontSize: "clamp(22px, 4vw, 32px)",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "12px",
  };

  const descStyle = {
    color: "#6b7280",
    fontSize: "clamp(13px, 2.5vw, 16px)",
    maxWidth: "500px",
    margin: "0 auto 24px",
    lineHeight: "1.6",
  };

  const formStyle = {
    display: "flex",
    flexDirection: window.innerWidth < 640 ? "column" : "row",
    alignItems: "center",
    gap: "12px",
    justifyContent: "center",
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    flexWrap: "wrap",
  };

  const inputStyle = {
    flex: "1",
    padding: "14px 16px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    outline: "none",
    minWidth: "200px",
  };

  const buttonStyle = {
    padding: "14px 24px",
    backgroundColor: "#111827",
    color: "#fff",
    fontSize: "13px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  return (
    <div style={containerStyle}>
      <p style={titleStyle}>Subscribe Now! & Get 15% Off</p>
      <p style={descStyle}>
        Stay updated with our latest collections, discounts, and special offers.
        Sign up and save big on your first order!
      </p>
      <form onSubmit={submithandle} style={formStyle}>
        <input
          type="email"
          placeholder="Enter Your Email"
          required
          style={inputStyle}
        />
        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#111827")}
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default Newletterbox;
