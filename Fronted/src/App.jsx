import React from "react"
import{Routes,Route} from "react-router-dom"
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
import Nav from "./componet/nav";
import Footer from "./componet/footer";
import Hero from "./componet/Hero";
import Latestcollection from "./componet/latestcollection";
import Productitem from "./componet/productitem";
import SearchBar from "./componet/searchbar";
  import { ToastContainer, toast } from 'react-toastify';


const App =() =>{
  return(
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
     <Nav />
     <SearchBar /> 
    
   

      <Routes>
    <Route path="/" element={<Home/>} />
    <Route path="/collection" element={<Collection/>} />
    <Route path="/about" element={<About/>} />
    <Route path="/contact" element={<Contact/>} />
    <Route path="/product/:productId" element={<Product/>} />
    <Route path="/cart" element={<Cart/>} />
    <Route path="/login" element={<Login/>} />
    <Route path="/placeorder" element={<Placeorder/>} />
    <Route path="/order" element={<Order/>} />
    <Route path="/profile" element={<Profile/>} />
 
      </Routes>
      <Footer /> 
    </div>    
  );                   
}
export default App


// npm install -D tailwindcss postcss autoprefixer
//npx tailwindcss-cli@latest init -p   new telwind part dwld karne ke liye
