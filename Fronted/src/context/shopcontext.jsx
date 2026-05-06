import { createContext, useState, useEffect, use } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import apiService from "../services/api.js";

export const Shopcontext = createContext();

const ShopContextProvider = (props) => {
  const currency = "₹";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [wishlistItems, setWishlistItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [stats, setStats] = useState({
    products: 0,
    customers: 0,
    rating: 0,
    reviews: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Recalculate stats when products change
  useEffect(() => {
    if (products.length > 0) {
      calculateStatsFromData();
    }
  }, [products]);

  // Refetch user count when token changes (user login/logout)
  useEffect(() => {
    if (token && products.length > 0) {
      calculateStatsFromData();
    }
  }, [token]);

  const fetchStats = async () => {
    try {
      const response = await apiService.getStats();
      if (response.success && response.stats) {
        setStats(response.stats);
      } else {
        // Calculate from available data if API fails
        calculateStatsFromData();
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Calculate from available data if API fails
      calculateStatsFromData();
    }
  };

  // Calculate stats from actual loaded data
  const calculateStatsFromData = async () => {
    // Get products count from loaded products
    const productsCount = products?.length || 0;
    
    // Calculate average rating from all product reviews if available
    let totalRating = 0;
    let reviewCount = 0;
    
    if (products && products.length > 0) {
      products.forEach(product => {
        if (product.reviews && product.reviews.length > 0) {
          product.reviews.forEach(review => {
            totalRating += review.rating || 0;
            reviewCount++;
          });
        }
        // Also check reviewCount field if exists
        if (product.reviewCount > 0) {
          reviewCount += product.reviewCount;
        }
      });
    }
    
    const avgRating = reviewCount > 0 ? (totalRating / reviewCount) : 4.8;
    
    // Try to get user count from backend if token available
    let userCount = 0;
    if (token) {
      try {
        const userResponse = await apiService.getUserCount(token);
        if (userResponse.success) {
          userCount = userResponse.count || userResponse.userCount || 0;
        }
      } catch (error) {
        console.log('Could not fetch user count:', error.message);
      }
    }
    
    setStats({
      products: productsCount,
      customers: userCount, // From backend API
      rating: avgRating,
      reviews: reviewCount
    });
  };

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

  // Wishlist Functions
  const addToWishlist = async (product) => {
    if (!token) {
      toast.error("Please login to add items to wishlist");
      navigate("/login");
      return;
    }

    const exists = wishlistItems.find((item) => item._id === product._id);
    if (exists) {
      toast.info("Item already in wishlist");
      return;
    }

    setWishlistItems((prev) => [...prev, product]);
    await addToWishlistBackend(product._id);
    toast.success("Added to wishlist");
  };

  const removeFromWishlist = async (productId) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
    await removeFromWishlistBackend(productId);
    toast.success("Removed from wishlist");
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    toast.success("Wishlist cleared");
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
      fetchUserWishlist(storedToken);
      fetchRecentlyViewed(storedToken);
    }
  },[])

  useEffect(() => {
    if(token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  const fetchUserWishlist = async (token) => {
    try {
      const response = await axios.get(`${backendUrl}/api/wishlist/`, { headers: { token } });
      if (response.data.success) {
        setWishlistItems(response.data.products || []);
      }
    } catch (error) {
      console.error("Fetch wishlist error:", error);
    }
  };

  const addToWishlistBackend = async (productId) => {
    try {
      if (!token) {
        toast.error("Please login to add items to wishlist");
        navigate("/login");
        return;
      }
      const response = await axios.post(`${backendUrl}/api/wishlist/add`, { productId }, { headers: { token } });
      if (response.data.success) {
        fetchUserWishlist(token);
      }
    } catch (error) {
      console.error("Add to wishlist error:", error);
    }
  };

  const removeFromWishlistBackend = async (productId) => {
    try {
      if (!token) return;
      const response = await axios.post(`${backendUrl}/api/wishlist/remove`, { productId }, { headers: { token } });
      if (response.data.success) {
        fetchUserWishlist(token);
      }
    } catch (error) {
      console.error("Remove from wishlist error:", error);
    }
  };

  const addToRecentlyViewed = async (productId) => {
    try {
      if (!token) return;
      await axios.post(`${backendUrl}/api/user/recently-viewed`, { productId }, { headers: { token } });
      fetchRecentlyViewed(token);
    } catch (error) {
      console.error("Add to recently viewed error:", error);
    }
  };

  const fetchRecentlyViewed = async (token) => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/recently-viewed`, { headers: { token } });
      if (response.data.success) {
        setRecentlyViewed(response.data.products || []);
      }
    } catch (error) {
      console.error("Fetch recently viewed error:", error);
    }
  };

  const getProductsByCategory = (cat) => products.filter(p => p.category === cat);
  const getBestsellerProducts = () => products.filter(p => p.bestseller);

  // Review API Functions
  const getProductReviews = async (productId) => {
    try {
      const response = await axios.get(`${backendUrl}/api/review/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Get product reviews error:", error);
      return { success: false, reviews: [] };
    }
  };

  const addReview = async (productId, rating, comment) => {
    try {
      if (!token) {
        toast.error("Please login to add a review");
        navigate("/login");
        return { success: false };
      }
      const response = await axios.post(
        `${backendUrl}/api/review/add`,
        { productId, rating, comment },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Review added successfully!");
      } else {
        toast.error(response.data.message || "Failed to add review");
      }
      return response.data;
    } catch (error) {
      console.error("Add review error:", error);
      toast.error(error.response?.data?.message || "Failed to add review");
      return { success: false };
    }
  };

  const updateReview = async (reviewId, rating, comment) => {
    try {
      if (!token) {
        toast.error("Please login to update review");
        return { success: false };
      }
      const response = await axios.put(
        `${backendUrl}/api/review/update/${reviewId}`,
        { rating, comment },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Review updated successfully!");
      } else {
        toast.error(response.data.message || "Failed to update review");
      }
      return response.data;
    } catch (error) {
      console.error("Update review error:", error);
      toast.error(error.response?.data?.message || "Failed to update review");
      return { success: false };
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      if (!token) {
        toast.error("Please login to delete review");
        return { success: false };
      }
      const response = await axios.delete(
        `${backendUrl}/api/review/delete/${reviewId}`,
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Review deleted successfully!");
      } else {
        toast.error(response.data.message || "Failed to delete review");
      }
      return response.data;
    } catch (error) {
      console.error("Delete review error:", error);
      toast.error(error.response?.data?.message || "Failed to delete review");
      return { success: false };
    }
  };

  const checkUserReview = async (productId) => {
    try {
      if (!token) return { hasReviewed: false, review: null };
      const response = await axios.get(
        `${backendUrl}/api/review/check/${productId}`,
        { headers: { token } }
      );
      return response.data;
    } catch (error) {
      console.error("Check user review error:", error);
      return { hasReviewed: false, review: null };
    }
  };

  const applyCoupon = async (code, orderAmount) => {
    try {
      const response = await axios.post(`${backendUrl}/api/coupon/apply`, {
        code,
        orderAmount
      });
      
      if (response.data.success) {
        setCoupon(response.data.coupon);
        setDiscount(response.data.coupon.discount);
        setCouponCode(code.toUpperCase());
        setCouponMessage("");
        toast.success(`Coupon applied! ₹${response.data.coupon.discount} off`);
        return { success: true, coupon: response.data.coupon };
      } else {
        setCoupon(null);
        setDiscount(0);
        setCouponMessage(response.data.message);
        toast.error(response.data.message);
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error("Apply coupon error:", error);
      setCoupon(null);
      setDiscount(0);
      setCouponMessage(error.response?.data?.message || "Failed to apply coupon");
      toast.error(error.response?.data?.message || "Failed to apply coupon");
      return { success: false, message: error.response?.data?.message };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setDiscount(0);
    setCouponCode("");
    setCouponMessage("");
    toast.info("Coupon removed");
  };

  const getFinalAmount = () => {
    const subtotal = getCartAmount();
    return subtotal - discount;
  };

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
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist,
    getProductReviews,
    addReview,
    updateReview,
    deleteReview,
    checkUserReview,
    stats,
    recentlyViewed,
    addToRecentlyViewed,
    coupon,
    setCoupon,
    discount,
    setDiscount,
    couponCode,
    setCouponCode,
    couponMessage,
    setCouponMessage,
    applyCoupon,
    removeCoupon,
    getFinalAmount,
  };

  return (
    <Shopcontext.Provider value={value}>
      {props.children}
    </Shopcontext.Provider>
  );
};

export default ShopContextProvider;
