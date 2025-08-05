import { createContext, useState, useEffect, use } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // ✅ Added import
import apiService from "../services/api.js";
// import { products as staticProducts } from "../assets/assets.js";

export const Shopcontext = createContext();

const ShopcontextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getProducts();
      if (response.success) {
        setProducts(response.products);
        console.log("✅ Products loaded from API:", response.products.length);
      } else {
        throw new Error(response.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products from API:', error);
      // setProducts(staticProducts); // Uncomment if using fallback
      setError("Using offline data - API connection failed");
      toast.warning("Using offline data - API connection failed");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }

    // Check authentication first
    if (!token) {
      toast.error("Please login to add items to cart");
      navigate("/login");
      return;
    }

    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;
    } else {
      cartData[itemId] = { [size]: 1 };
    }

    setCartItems(cartData);
    toast.success("Added to cart");

    try {
      await axios.post(
        `${backendUrl}/api/cart/add`,
        { itemId, size },
        { headers: { token } }
      );
    } catch (error) {
      console.log("Add to cart error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to add item to cart. Please try again.");
      }
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    // Check authentication first
    if (!token) {
      toast.error("Please login to modify cart");
      navigate("/login");
      return;
    }

    const cartData = structuredClone(cartItems);
    cartData[itemId][size] = quantity;
    setCartItems(cartData);

    try {
      await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } });
    } catch (error) {
      console.log("Update cart error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to update cart. Please try again.");
      }
    }
  };

  const removeFromCart = async (itemId, size) => {
    // Check authentication first
    if (!token) {
      toast.error("Please login to modify cart");
      navigate("/login");
      return;
    }

    const cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      delete cartData[itemId][size];
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }
    setCartItems(cartData);
    toast.success("Removed from cart");

    try {
      await axios.post(backendUrl + '/api/cart/remove', { itemId, size }, { headers: { token } });
    } catch (error) {
      console.log("Remove from cart error:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to remove item from cart. Please try again.");
      }
    }
  };

  const clearCart = () => {
    setCartItems({});
    toast.success("Cart cleared");
  };

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find((p) => p._id === id);
      if (product) {
        for (const size in cartItems[id]) {
          total += product.price * cartItems[id][size];
        }
      }
    }
    return total;
  };

  const getCartCount = () => {
    let count = 0;
    for (const id in cartItems) {
      for (const size in cartItems[id]) {
        count += cartItems[id][size];
      }
    }
    return count;
  };

  const getProductById = (id) => products.find(p => p._id === id);

  const getFilteredProducts = () => {
    if (!search.trim()) return products;
    return products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    );
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token } });
      if (response.data.success) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.log("Get user cart error:", error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        setToken('');
        localStorage.removeItem('token');
        toast.error("Session expired. Please login again.");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to load cart. Please try again.");
      }
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if(storedToken) {
      setToken(storedToken);
      getUserCart(storedToken);
    }
  },[])

  useEffect(() => {
    if(token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  const getProductsByCategory = (cat) => products.filter(p => p.category === cat);
  const getBestsellerProducts = () => products.filter(p => p.bestseller);

  const value = {
    products,
    loading,
    error,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getCartAmount,
    setCartItems,
    getProductById,
    getFilteredProducts,
    getProductsByCategory,
    getBestsellerProducts,
    fetchProducts,
    navigate,
    backendUrl,
    setToken,
    token,
  };

  return (
    <Shopcontext.Provider value={value}>
      {props.children}
    </Shopcontext.Provider>
  );
};

export default ShopcontextProvider;
