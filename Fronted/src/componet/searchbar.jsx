// import React, { useContext, useEffect, useState } from "react";
// import { Shopcontext } from "../context/shopcontext";
// import { assets } from "../assets/assets";
// import { useLocation } from "react-router-dom";
// const SearchBar=() =>{
// const{search,setSearch,showSearch,setShowSearch}=useContext(Shopcontext);
// const[visible,setVisible]=useState(false)
// const location=useLocation();


// useEffect(()=>{
//      if(location.pathname.includes('collection')){
//         setVisible(true);

//      }
//      else(
//         setVisible(false)
//      )

// },[location])

//     return showSearch && visible ?  (
//         <div className="border-t border-b bg-gray-50 text-center ">
//             <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2">
//         <input value={search} onChange={(e)=>setSearch(e.target.value)} type="text" className="flex-1 outline-none bg-inherit text-sm" placeholder="Search...." />
//         <img className="w-4" src={assets.search_icon} alt=""/>
//         </div>
//         <img onClick={()=>setShowSearch(false)} className="inline w-3 cursor-pointer" src={assets.cross_icon} alt=""/>
//         </div>
//     ) : null
//     }
//     export default SearchBar

import React, { useContext, useEffect, useState } from "react";
import { Shopcontext } from "../context/shopcontext";
import { useLocation } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(Shopcontext);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setVisible(location.pathname.includes("collection"));
  }, [location]);

  if (!(showSearch && visible)) return null;

  return (
    <div className="w-full backdrop-blur-md bg-white/40 border-y border-gray-200 shadow-md py-6 px-4 sm:px-8 sticky top-0 z-30">
      <div className="max-w-3xl mx-auto relative">
        <div className="flex items-center shadow-xl rounded-full overflow-hidden bg-white/80 backdrop-blur-md transition-all border border-gray-300 hover:border-indigo-500">
          <div className="px-4 text-gray-500">
            <FiSearch className="text-xl" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for products, styles, collections..."
            className="flex-1 bg-transparent text-sm sm:text-base py-3 pr-10 outline-none placeholder-gray-400 text-gray-700"
          />
          <button
            onClick={() => setShowSearch(false)}
            className="px-4 text-gray-400 hover:text-red-500 transition"
            aria-label="Close search"
          >
            <FiX className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
