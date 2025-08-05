// import React from "react";
// import Title from "../componet/title";
// import { assets } from "../assets/assets";
// import Newletterbox from "../componet/newletterbox";
// const About = () => {
//     return (
//         <div>
//             <div className="text-2xl text-center pt-8 border-t">
//                 <Title text1={'ABOUT_'} text2={'Us'} />
//             </div>
//             <div className="my-10 flex flex-col md:flex-row gap-16">
//                 <img className="w-full md:max-w-[450px]" src={assets.about_img} alt="" />
//                 <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-700">
//                     <p>gvyfidhvilguvlghigciygfvi fhiujhfeuofhe cefheuihfiuefhef heiufheuif feufgf ifhyue</p>
//                     <p>geuyfgeyigfeiugfeiughfueh dbbduhbde gegebf </p>
//                     <b>Our Mission</b>
//                     <p>fegfegfejhbfhek bfduhfde hejhfe fehuehe iwjdw </p>
//                 </div>
//             </div>

//             <div className="text-xl py-4">
//                 <Title text1={'WHY_'} text2={'CHOOSE US'} />
//             </div>
//             <div className="flex flex-col md:flex-row text-sm mb-20">
//                 <div className="border px-10 md:px-16 py-8 sm:py-20 flex-col gap-5">
//                     <b>QUALITY ASSURANCE:</b>
//                     <p>uyhgfdyhcgdehvcdjgcd gdbekhgded gdygduyew degydywgd </p>
//                 </div>
//                 <div className="border px-10 md:px-16 py-8 sm:py-20 flex-col gap-5">
//                     <b>CONVENINCE:</b>
//                     <p>uyhgfdyhcgdehvcdjgcd gdbekhgded gdygduyew degydywgd </p>
//                 </div>
//                 <div className="border px-10 md:px-16 py-8 sm:py-20 flex-col gap-5">
//                     <b>EXCEPTION COUSTOMER SERVICE</b>
//                     <p>uyhgfdyhcgdehvcdjgcd gdbekhgded gdygduyew degydywgd </p>
//                 </div>
//             </div>
//             <Newletterbox />
//         </div>
//     )
// }
// export default About

import React from "react";
import Title from "../componet/title";
import { assets } from "../assets/assets";
import Newletterbox from "../componet/newletterbox";

const About = () => {
  return (
    <div style={wrapperStyle}>
      <div style={{ ...sectionHeader }}>
        <Title text1={"ABOUT_"} text2={"Us"} />
        <div style={underline}></div>
      </div>

      <div
        style={{
          ...aboutWrapper,
          flexDirection: window.innerWidth >= 768 ? "row" : "column",
        }}
      >
        <div style={{ ...imageBox }}>
          <img src={assets.about_img} alt="About" style={imgStyle} />
        </div>
        <div style={{ ...aboutText }}>
          <p style={quoteText}>
            “Our passion drives us. Our quality defines us. Our mission is to
            make a difference.”
          </p>
          <p>
            We strive to provide a seamless experience to our users, backed by
            innovation and integrity.
          </p>
          <h3 style={subTitle}>🚀 Our Mission</h3>
          <p>
            To create value through top-tier services, customer focus, and
            relentless improvement. We grow when our users succeed.
          </p>
        </div>
      </div>

      <div style={{ ...sectionHeader }}>
        <Title text1={"WHY_"} text2={"CHOOSE US"} />
        <div style={underline}></div>
      </div>

      <div
        style={{
          ...chooseGrid,
          flexDirection: window.innerWidth >= 768 ? "row" : "column",
        }}
      >
        {features.map((item, index) => (
          <div
            key={index}
            style={{
              ...card,
              background: backgrounds[index % backgrounds.length],
              color: "#fff",
            }}
          >
            <div style={{ ...icon, color: "#fff" }}>{item.icon}</div>
            <b style={cardTitle}>{item.title}</b>
            <p style={cardText}>{item.text}</p>
          </div>
        ))}
      </div>

      <div>
        <Newletterbox />
      </div>
    </div>
  );
};

const wrapperStyle = {
  padding: "40px 20px",
  fontFamily: "'Segoe UI', sans-serif",
  color: "#1e293b",
  maxWidth: "1200px",
  margin: "0 auto",
  background: "linear-gradient(to bottom, #f1f5f9, #e2e8f0)",
};

const sectionHeader = {
  textAlign: "center",
  marginBottom: "20px",
  position: "relative",
};

const underline = {
  height: "3px",
  width: "60px",
  background: "linear-gradient(to right, #14b8a6, #3b82f6)",
  margin: "10px auto",
  borderRadius: "3px",
};

const aboutWrapper = {
  display: "flex",
  gap: "40px",
  margin: "40px 0 60px",
  alignItems: "center",
};

const imageBox = {
  flex: 1,
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const imgStyle = {
  width: "100%",
  objectFit: "cover",
  borderRadius: "16px",
};

const aboutText = {
  flex: 1,
  fontSize: "15px",
  lineHeight: "1.7",
  color: "#475569",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const quoteText = {
  fontStyle: "italic",
  color: "#0f172a",
  fontSize: "17px",
  borderLeft: "4px solid #3b82f6",
  paddingLeft: "12px",
};

const subTitle = {
  fontSize: "17px",
  fontWeight: "bold",
  color: "#1e40af",
};

const chooseGrid = {
  display: "flex",
  gap: "20px",
  margin: "30px 0 60px",
};

const card = {
  flex: 1,
  padding: "20px",
  borderRadius: "14px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
  transition: "all 0.4s ease-in-out",
  textAlign: "center",
};

const cardTitle = {
  fontSize: "16px",
  margin: "10px 0",
  fontWeight: "600",
};

const cardText = {
  fontSize: "14px",
};

const icon = {
  fontSize: "28px",
  marginBottom: "10px",
};

const features = [
  {
    title: "QUALITY ASSURANCE",
    text: "We ensure only premium services, every time you engage with us.",
    icon: "✅",
  },
  {
    title: "CONVENIENCE",
    text: "Easy navigation, fast access, and always available to serve you.",
    icon: "📱",
  },
  {
    title: "24/7 SUPPORT",
    text: "Human-friendly, prompt and always caring – that’s our promise.",
    icon: "🚣️",
  },
];

const backgrounds = [
  "linear-gradient(135deg, #06b6d4, #3b82f6)",
  "linear-gradient(135deg, #10b981, #14b8a6)",
  "linear-gradient(135deg, #6366f1, #8b5cf6)",
];

export default About;
