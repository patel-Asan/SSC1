// import React from "react";

// const Title=({text1,text2}) =>{
//     return(
//        <div className="inline-flex gap-2 items-center mb-3">
//         <p className="text-grey-500">{text1}<span className="text-grey-700 font-medium">{text2}</span>
//         </p>
//             <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
//        </div>
//     );
//     }
//     export default Title



import React, { useEffect, useState } from "react";

const Title = ({ text1, text2 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const styles = {
    container: {
      display: "inline-block",
      marginBottom: "20px",
      transition: "all 0.8s ease",
      transform: visible ? "translateY(0)" : "translateY(30px)",
      opacity: visible ? 1 : 0,
    },
    text1: {
      fontSize: "27px",
      fontWeight: "720",
      color: "#1e3a8a", // navy blue
      fontFamily: "'Segoe UI', sans-serif",
      letterSpacing: "1px",
      textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
      marginRight: "8px",
    },
    text2: {
      fontSize: "26px",
      fontWeight: "720",
      color: "#2563eb", // blue
      fontFamily: "'Segoe UI', sans-serif",
      textDecoration: "underline",
      textDecorationColor: "#60a5fa",
      textUnderlineOffset: "6px",
      letterSpacing: "1px",
      textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
    },
  };

  return (
    <div style={styles.container}>
      <span style={styles.text1}>{text1}</span>
      <span style={styles.text2}>{text2}</span>
    </div>
  );
};

export default Title;
