import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Shopcontext } from "../context/shopcontext";
import { assets } from "../assets/assets";
import RelatedProduct from "../componet/relatedproduct";
import ProductSkeleton from "../componet/ProductSkeleton";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, currency, addToCart, addToWishlist, removeFromWishlist, isInWishlist, loading, error, getProductById, getProductReviews, addReview, updateReview, deleteReview, checkUserReview, token } = useContext(Shopcontext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageErrors, setImageErrors] = useState({});
  const [selectedTab, setSelectedTab] = useState("description");
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [stockCount, setStockCount] = useState(15);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [userReview, setUserReview] = useState(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProductData = () => {
      const foundProduct = getProductById(productId);
      if (foundProduct) {
        setProductData(foundProduct);
        const firstImage = Array.isArray(foundProduct.image) && foundProduct.image.length > 0 
          ? foundProduct.image[0] 
          : "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center";
        setImage(firstImage);
        setIsWishlisted(isInWishlist(foundProduct._id));
      }
    };
    
    if (products && products.length > 0) {
      fetchProductData();
    }
  }, [productId, products, getProductById, isInWishlist]);

  const handleImageError = (imageUrl, index) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
    const fallbackImage = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center";
    if (image === imageUrl) {
      setImage(fallbackImage);
    }
  };

  const getImageSrc = (imageUrl, index) => {
    if (imageErrors[index]) {
      return "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center";
    }
    return imageUrl;
  };

  const handleAddToCart = () => {
    if (!size) {
      toast.error("Please select a size!", { position: "top-center" });
      return;
    }
    setIsAdding(true);
    for (let i = 0; i < quantity; i++) {
      addToCart(productData._id, size);
    }
    toast.success(`${quantity} x ${productData.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(productData._id);
      toast.info("Removed from wishlist", { autoClose: 1500 });
    } else {
      addToWishlist(productData);
      toast.success("Added to wishlist!", { autoClose: 1500 });
    }
    setIsWishlisted(!isWishlisted);
  };

  const handleThumbnailClick = (item, index) => {
    setImage(getImageSrc(item, index));
    setActiveImageIndex(index);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  // Fetch reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;
      setIsReviewLoading(true);
      try {
        const response = await getProductReviews(productId);
        if (response.success) {
          setReviews(response.reviews || []);
          setReviewCount(response.reviews?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setIsReviewLoading(false);
      }
    };
    
    fetchReviews();
  }, [productId, getProductReviews]);

  // Check if current user has reviewed this product
  useEffect(() => {
    const checkUserHasReviewed = async () => {
      if (!token || !productId) {
        setUserReview(null);
        return;
      }
      try {
        const response = await checkUserReview(productId);
        if (response.success && response.hasReviewed) {
          setUserReview(response.review);
        } else {
          setUserReview(null);
        }
      } catch (error) {
        console.error("Error checking user review:", error);
      }
    };
    
    checkUserHasReviewed();
  }, [productId, token, checkUserReview]);

  const handleSubmitReview = async () => {
    if (!token) {
      toast.error("Please login to add a review");
      navigate("/login");
      return;
    }
    
    if (newComment.trim().length < 3) {
      toast.error("Review comment must be at least 3 characters");
      return;
    }
    
    setIsReviewLoading(true);
    try {
      if (editingReview) {
        const response = await updateReview(editingReview._id, newRating, newComment);
        if (response.success) {
          setReviews(reviews.map(r => r._id === editingReview._id ? response.review : r));
          setUserReview(response.review);
          setShowReviewForm(false);
          setEditingReview(null);
          setNewRating(5);
          setNewComment("");
        }
      } else {
        const response = await addReview(productId, newRating, newComment);
        if (response.success) {
          setReviews([response.review, ...reviews]);
          setReviewCount(reviewCount + 1);
          setUserReview(response.review);
          setShowReviewForm(false);
          setNewRating(5);
          setNewComment("");
        }
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsReviewLoading(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewRating(review.rating);
    setNewComment(review.comment);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    setIsReviewLoading(true);
    try {
      const response = await deleteReview(reviewId);
      if (response.success) {
        setReviews(reviews.filter(r => r._id !== reviewId));
        setReviewCount(reviewCount - 1);
        setUserReview(null);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setIsReviewLoading(false);
    }
  };

  const cancelReviewForm = () => {
    setShowReviewForm(false);
    setEditingReview(null);
    setNewRating(5);
    setNewComment("");
  };

  if (loading) {
    return (
      <div style={{ paddingTop: "2px", paddingLeft: isMobile ? "16px" : "40px", paddingRight: isMobile ? "16px" : "40px", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: isMobile ? "20px" : "40px", flexDirection: isMobile ? "column" : "row" }}>
          <div style={{ flex: 1, minWidth: isMobile ? "100%" : "300px" }}>
            <ProductSkeleton count={1} />
          </div>
          <div style={{ flex: 1, minWidth: isMobile ? "100%" : "300px", paddingTop: "20px" }}>
            <div style={{ height: "40px", width: "80%", background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "12px", marginBottom: "20px" }} />
            <div style={{ height: "24px", width: "40%", background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "8px", marginBottom: "30px" }} />
            <div style={{ height: "100px", width: "100%", background: "linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: "12px", marginBottom: "20px" }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "60vh",
          paddingTop: "2px",
          textAlign: "center"
        }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          style={{
            backgroundColor: "#fef2f2",
            padding: "40px",
            borderRadius: "24px",
            maxWidth: "400px"
          }}
        >
          <span style={{ fontSize: "48px" }}>⚠️</span>
          <h3 style={{ color: "#dc2626", marginTop: "16px", marginBottom: "8px" }}>Oops! Something went wrong</h3>
          <p style={{ color: "#991b1b" }}>{error}</p>
        </motion.div>
      </motion.div>
    );
  }

  if (!productData) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "60vh",
          paddingTop: "2px",
          textAlign: "center"
        }}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          style={{
            backgroundColor: "#f3f4f6",
            padding: "60px 40px",
            borderRadius: "24px",
            maxWidth: "400px"
          }}
        >
          <span style={{ fontSize: "64px" }}>📦</span>
          <h3 style={{ color: "#374151", marginTop: "20px", marginBottom: "8px" }}>Product Not Found</h3>
          <p style={{ color: "#6b7280", marginBottom: "24px" }}>The product you're looking for doesn't exist.</p>
          <motion.button
            onClick={() => navigate("/collection")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              backgroundColor: "#ff6f61",
              color: "#fff",
              border: "none",
              padding: "14px 28px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Browse Collection →
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        paddingTop: "2px",
        paddingLeft: isMobile ? "16px" : "40px",
        paddingRight: isMobile ? "16px" : "40px",
        maxWidth: "1400px",
        margin: "0 auto",
        overflowX: "hidden",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "24px" : "40px" }}>
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: isMobile ? "12px" : "14px",
            color: "#9ca3af",
            flexWrap: "wrap",
          }}
        >
          <motion.span 
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
            whileHover={{ color: "#ff6f61" }}
          >Home</motion.span>
          <span>/</span>
          <motion.span 
            onClick={() => navigate("/collection")}
            style={{ cursor: "pointer" }}
            whileHover={{ color: "#ff6f61" }}
          >Collection</motion.span>
          <span>/</span>
          <span style={{ color: "#1f2937", fontWeight: "500", maxWidth: isMobile ? "150px" : "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{productData.name}</span>
        </motion.nav>

        {/* Main Product Section */}
        <div style={{ 
          display: "flex", 
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? "24px" : "60px",
          backgroundColor: "#fff",
          borderRadius: isMobile ? "16px" : "24px",
          padding: isMobile ? "20px" : "40px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
          position: "relative",
        }}>
          {/* Product Badges */}
          <div style={{
            position: "absolute",
            top: isMobile ? "12px" : "20px",
            left: isMobile ? "12px" : "20px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            zIndex: 10,
          }}>
            {productData.isNew && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                style={{
                  backgroundColor: "#10b981",
                  color: "#fff",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                }}
              >
                NEW
              </motion.span>
            )}
            {productData.isBestseller && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                style={{
                  backgroundColor: "#ff6f61",
                  color: "#fff",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "700",
                  letterSpacing: "0.5px",
                }}
              >
                BESTSELLER
              </motion.span>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            onClick={handleWishlistToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: "absolute",
              top: isMobile ? "12px" : "20px",
              right: isMobile ? "12px" : "20px",
              width: isMobile ? "40px" : "48px",
              height: isMobile ? "40px" : "48px",
              borderRadius: "50%",
              backgroundColor: isWishlisted ? "#fef2f2" : "#fff",
              border: `2px solid ${isWishlisted ? "#ef4444" : "#e5e7eb"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontSize: isMobile ? "18px" : "20px",
              zIndex: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            {isWishlisted ? "❤️" : "🤍"}
          </motion.button>

          {/* Left: Images */}
          <motion.div 
            style={{ 
              flex: "1",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: isMobile ? "12px" : "20px",
            }}
            initial={{ x: isMobile ? 0 : -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <motion.div 
              style={{ 
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fafbfc",
                borderRadius: isMobile ? "16px" : "20px",
                padding: isMobile ? "16px" : "20px",
                minHeight: isMobile ? "300px" : "400px",
                overflow: "hidden",
                position: "relative",
                order: isMobile ? 1 : 2,
              }}
              key={image}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.img
                src={image}
                alt="Main Product"
                style={{ 
                  maxHeight: isMobile ? "280px" : "450px", 
                  width: "100%", 
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                }}
                whileHover={{ scale: 1.03 }}
              />
            </motion.div>

            {/* Thumbnails */}
            <div style={{ 
              display: "flex",
              flexDirection: isMobile ? "row" : "column",
              gap: isMobile ? "8px" : "12px",
              overflow: "auto",
              order: isMobile ? 2 : 1,
              justifyContent: isMobile ? "center" : "flex-start",
              padding: isMobile ? "4px" : "0",
            }}>
              {productData.image.map((item, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleThumbnailClick(item, index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ 
                    border: `3px solid ${activeImageIndex === index ? "#ff6f61" : "#e5e7eb"}`,
                    borderRadius: isMobile ? "10px" : "12px",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    opacity: activeImageIndex === index ? 1 : 0.7,
                    transform: activeImageIndex === index ? "scale(1.05)" : "scale(1)",
                    backgroundColor: "transparent",
                    padding: 0,
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={getImageSrc(item, index)}
                    alt={`Thumbnail ${index}`}
                    style={{ 
                      width: isMobile ? "60px" : "80px", 
                      height: isMobile ? "60px" : "80px", 
                      objectFit: "cover", 
                      display: "block" 
                    }}
                    onError={() => handleImageError(item, index)}
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right: Product Info */}
          <motion.div
            initial={{ x: isMobile ? 0 : 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: isMobile ? "1rem" : "1.5rem",
              maxWidth: isMobile ? "100%" : "500px",
            }}
          >
            {/* Product Name */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: isMobile ? "22px" : "clamp(24px, 3vw, 36px)",
                fontWeight: "800",
                color: "#111827",
                lineHeight: "1.2",
                letterSpacing: "-0.5px",
                marginBottom: 0,
              }}
            >
              {productData.name}
            </motion.h1>

            {/* Stock & Rating Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? "12px" : "16px",
                flexWrap: "wrap",
              }}
            >
              {/* Stock Badge */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                backgroundColor: stockCount > 10 ? "#d1fae5" : stockCount > 0 ? "#fef3c7" : "#fee2e2",
                padding: "6px 12px",
                borderRadius: "20px",
              }}>
                <div style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: stockCount > 10 ? "#10b981" : stockCount > 0 ? "#f59e0b" : "#ef4444",
                }} />
                <span style={{
                  fontSize: isMobile ? "12px" : "13px",
                  color: stockCount > 10 ? "#065f46" : stockCount > 0 ? "#92400e" : "#991b1b",
                  fontWeight: "600",
                }}>
                  {stockCount > 10 ? "In Stock" : stockCount > 0 ? `Only ${stockCount} left` : "Out of Stock"}
                </span>
              </div>
              
              {/* Rating */}
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span 
                    key={star} 
                    style={{ 
                      fontSize: isMobile ? "14px" : "16px",
                      color: star <= (reviews.length > 0 ? Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0) ? "#ff6f61" : "#e5e7eb",
                    }}
                  >
                    ★
                  </span>
                ))}
                <span style={{ 
                  marginLeft: "8px",
                  fontSize: isMobile ? "12px" : "13px", 
                  color: "#6b7280",
                  fontWeight: "500",
                }}>
                  {reviews.length > 0 
                    ? `${(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)} (${reviews.length})` 
                    : "No reviews yet"}
                </span>
              </div>
            </motion.div>

            {/* Price */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: isMobile ? "8px" : "12px",
                flexWrap: "wrap",
              }}
            >
              <span style={{
                fontSize: isMobile ? "24px" : "28px",
                fontWeight: "800",
                color: "#ff6f61",
              }}>
                {currency}{productData.price}
              </span>
              <span style={{
                fontSize: isMobile ? "14px" : "16px",
                color: "#9ca3af",
                textDecoration: "line-through",
              }}>
                {currency}{(productData.price * 1.2).toFixed(2)}
              </span>
              <span style={{
                backgroundColor: "#d1fae5",
                color: "#065f46",
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: "600",
              }}>
                10% OFF
              </span>
            </motion.div>

            {/* Divider */}
            <hr style={{ 
              margin: "0.5rem 0", 
              width: "100%", 
              border: "none",
              borderTop: "1px solid #f3f4f6" 
            }} />

           

            {/* Size Selection */}
            <motion.div 
              style={{ display: "flex", flexDirection: "column", gap: isMobile ? "10px" : "12px" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p style={{ 
                fontWeight: "700", 
                fontSize: isMobile ? "14px" : "15px", 
                color: "#1f2937",
                letterSpacing: "0.5px",
                margin: 0,
              }}>
                SELECT SIZE {size && <span style={{ color: "#ff6f61" }}>({size})</span>}
              </p>
              <div style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                gap: isMobile ? "8px" : "10px" 
              }}>
                {productData.sizes.map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSize(item)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      border: `2px solid ${item === size ? "#ff6f61" : "#e5e7eb"}`,
                      padding: isMobile ? "10px 18px" : "12px 24px",
                      borderRadius: "12px",
                      backgroundColor: item === size ? "#ff6f61" : "#fff",
                      fontWeight: "600",
                      cursor: "pointer",
                      boxShadow: item === size ? "0 4px 12px rgba(255,111,97,0.3)" : "0 1px 3px rgba(0,0,0,0.05)",
                      transition: "all 0.3s ease",
                      color: item === size ? "#fff" : "#374151",
                      fontSize: isMobile ? "13px" : "14px",
                      minWidth: isMobile ? "50px" : "60px",
                    }}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Quantity Selector */}
            <motion.div 
              style={{ display: "flex", flexDirection: "column", gap: isMobile ? "10px" : "12px" }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              <p style={{ 
                fontWeight: "700", 
                fontSize: isMobile ? "14px" : "15px", 
                color: "#1f2937",
                letterSpacing: "0.5px",
                margin: 0,
              }}>
                QUANTITY
              </p>
              <div style={{ 
                display: "flex", 
                alignItems: "center",
                gap: "12px",
                backgroundColor: "#f9fafb",
                padding: "6px",
                borderRadius: "12px",
                width: "fit-content",
              }}>
                <motion.button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#fff",
                    color: "#374151",
                    fontSize: "18px",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  −
                </motion.button>
                <span style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#1f2937",
                  minWidth: "30px",
                  textAlign: "center",
                }}>
                  {quantity}
                </span>
                <motion.button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#fff",
                    color: "#ff6f61",
                    fontSize: "18px",
                    fontWeight: "600",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  }}
                >
                  +
                </motion.button>
              </div>
            </motion.div>

            {/* Add to Cart & Buy Now Buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{ 
                display: "flex", 
                flexDirection: isMobile ? "column" : "row",
                gap: "12px",
                marginTop: "0.5rem",
              }}
            >
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(255,111,97,0.4)" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1,
                  padding: isMobile ? "16px 24px" : "18px 32px",
                  backgroundColor: isAdding ? "#10b981" : "#ff6f61",
                  color: "#fff",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: "700",
                  fontSize: isMobile ? "15px" : "16px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: isAdding ? "0 4px 20px rgba(16,185,129,0.4)" : "0 4px 15px rgba(255,111,97,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                {isAdding ? "✓ Added!" : "🛒 Add to Cart"}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(31,41,55,0.3)" }}
                whileTap={{ scale: 0.98 }}
                style={{
                  flex: 1,
                  padding: isMobile ? "16px 24px" : "18px 32px",
                  backgroundColor: "#1f2937",
                  color: "#fff",
                  border: "none",
                  borderRadius: "14px",
                  fontWeight: "700",
                  fontSize: isMobile ? "15px" : "16px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                }}
              >
                ⚡ Buy Now
              </motion.button>
            </motion.div>

            {/* Delivery Info */}
            <motion.div 
              style={{ 
                fontSize: isMobile ? "13px" : "14px", 
                color: "#6b7280", 
                lineHeight: "1.8",
                marginTop: "1rem",
                padding: isMobile ? "16px" : "20px",
                backgroundColor: "#fafbfc",
                borderRadius: "16px",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <p style={{ marginBottom: "6px" }}>✓ <strong style={{ color: "#1f2937" }}>100% Original</strong> Products</p>
              <p style={{ marginBottom: "6px" }}>💰 <strong style={{ color: "#1f2937" }}>Cash On Delivery</strong> Available</p>
              <p>🔄 <strong style={{ color: "#1f2937" }}>5-Day</strong> Return Policy</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Description & Reviews Section */}
        <motion.div 
          style={{
            backgroundColor: "#fff",
            borderRadius: isMobile ? "16px" : "24px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {/* Tabs */}
          <div style={{
            display: "flex",
            borderBottom: "2px solid #f3f4f6",
            padding: isMobile ? "0 16px" : "0 40px",
          }}>
            {["description", "reviews"].map((tab) => (
              <motion.button 
                key={tab}
                onClick={() => setSelectedTab(tab)}
                style={{
                  padding: isMobile ? "16px 20px" : "20px 32px",
                  backgroundColor: selectedTab === tab ? "#fff" : "transparent",
                  color: selectedTab === tab ? "#ff6f61" : "#6b7280",
                  border: "none",
                  borderBottom: selectedTab === tab ? "3px solid #ff6f61" : "3px solid transparent",
                  fontWeight: selectedTab === tab ? "700" : "600",
                  fontSize: isMobile ? "14px" : "15px",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  marginBottom: "-2px",
                  flex: isMobile ? 1 : "none",
                  textAlign: "center",
                }}
                whileHover={{ backgroundColor: "#fff5f3", color: "#ff6f61" }}
              >
                {tab === "description" ? "Description" : `Reviews (${reviewCount})`}
              </motion.button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{
                padding: isMobile ? "20px" : "40px",
                fontSize: isMobile ? "14px" : "15px",
                lineHeight: "1.7",
                color: "#4b5563",
              }}
            >
              {selectedTab === "description" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: isMobile ? "20px" : "24px",
                  }}
                >
                  {/* Description Header Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: isMobile ? "20px" : "24px",
                      background: "linear-gradient(135deg, #fff5f3 0%, #fff 100%)",
                      borderRadius: "16px",
                      border: "1px solid #ffe4e0",
                    }}
                  >
                    <div style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "26px",
                      flexShrink: 0,
                    }}>
                      📋
                    </div>
                    <div>
                      <h3 style={{
                        margin: "0 0 4px 0",
                        fontSize: isMobile ? "16px" : "18px",
                        fontWeight: "700",
                        color: "#1f2937",
                      }}>
                        About This Product
                      </h3>
                      <p style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "#6b7280",
                      }}>
                        Everything you need to know
                      </p>
                    </div>
                  </motion.div>

                  {/* Description Content */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                      padding: isMobile ? "20px" : "28px",
                      backgroundColor: "#fafbfc",
                      borderRadius: "16px",
                      border: "1px solid #f3f4f6",
                    }}
                  >
                    {productData.description ? (
                      <p style={{
                        margin: 0,
                        fontSize: isMobile ? "15px" : "16px",
                        lineHeight: "1.8",
                        color: "#374151",
                        whiteSpace: "pre-wrap",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}>
                        {productData.description}
                      </p>
                    ) : (
                      <div style={{
                        textAlign: "center",
                        padding: "32px 20px",
                        color: "#9ca3af",
                      }}>
                        <div style={{ fontSize: "48px", marginBottom: "12px" }}>📝</div>
                        <p style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: "600", color: "#6b7280" }}>
                          No Description Available
                        </p>
                        <p style={{ margin: 0, fontSize: "13px" }}>
                          Product details will be added soon
                        </p>
                      </div>
                    )}
                  </motion.div>

                  {/* Product Features Grid */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
                      gap: "12px",
                    }}
                  >
                    {[
                      { icon: "✅", title: "Authentic", desc: "100% Original" },
                      { icon: "🚚", title: "Fast Delivery", desc: "2-3 Days" },
                      { icon: "↩️", title: "Easy Returns", desc: "5-Day Policy" },
                    ].map((feature, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "16px",
                          backgroundColor: "#fff",
                          borderRadius: "12px",
                          border: "1px solid #f3f4f6",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <span style={{ fontSize: "24px" }}>{feature.icon}</span>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "#1f2937" }}>
                            {feature.title}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>
                            {feature.desc}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              )}
              {selectedTab === "reviews" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {/* Add Review Button or Review Form */}
                  {!showReviewForm ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: isMobile ? "16px" : "20px",
                        backgroundColor: "#fafbfc",
                        borderRadius: "16px",
                        flexWrap: isMobile ? "wrap" : "nowrap",
                        gap: isMobile ? "12px" : "0",
                      }}
                    >
                      <div>
                        <strong style={{ color: "#1f2937", display: "block", marginBottom: "4px" }}>
                          {userReview ? "Your Review" : "Share Your Experience"}
                        </strong>
                        <p style={{ color: "#6b7280", fontSize: isMobile ? "13px" : "14px", margin: 0 }}>
                          {userReview 
                            ? "You've already reviewed this product" 
                            : token 
                              ? "Write a review to help others make better decisions" 
                              : "Login to write a review"}
                        </p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (!token) {
                            navigate("/login");
                            return;
                          }
                          if (userReview) {
                            handleEditReview(userReview);
                          } else {
                            setShowReviewForm(true);
                          }
                        }}
                        style={{
                          padding: isMobile ? "10px 16px" : "12px 24px",
                          backgroundColor: userReview ? "#1f2937" : "#ff6f61",
                          color: "#fff",
                          border: "none",
                          borderRadius: "12px",
                          fontWeight: "600",
                          fontSize: isMobile ? "13px" : "14px",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {userReview ? "Edit Your Review" : token ? "Write a Review" : "Login to Review"}
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      style={{
                        padding: isMobile ? "20px" : "28px",
                        background: "linear-gradient(135deg, #fff 0%, #fff5f3 100%)",
                        borderRadius: "20px",
                        border: "2px solid #ff6f61",
                        boxShadow: "0 8px 32px rgba(255,111,97,0.15)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                        <div style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontSize: "20px",
                        }}>
                          ✍️
                        </div>
                        <div>
                          <h4 style={{ color: "#1f2937", margin: "0 0 4px 0", fontSize: "18px", fontWeight: "700" }}>
                            {editingReview ? "Edit Your Review" : "Write a Review"}
                          </h4>
                          <p style={{ margin: 0, fontSize: "13px", color: "#6b7280" }}>
                            Your feedback matters to us and other customers
                          </p>
                        </div>
                      </div>
                      
                      {/* Rating Selection */}
                      <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", color: "#374151", fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>
                          How would you rate this product?
                        </label>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setNewRating(star)}
                              style={{
                                fontSize: "32px",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: star <= newRating ? "#ff6f61" : "#e5e7eb",
                                transition: "all 0.2s ease",
                                textShadow: star <= newRating ? "0 2px 4px rgba(255,111,97,0.3)" : "none",
                                filter: star <= newRating ? "drop-shadow(0 0 4px rgba(255,111,97,0.4))" : "none",
                              }}
                            >
                              ★
                            </motion.button>
                          ))}
                          <span style={{ marginLeft: "12px", fontSize: "14px", fontWeight: "600", color: "#ff6f61" }}>
                            {newRating === 5 && "Excellent!"}
                            {newRating === 4 && "Very Good!"}
                            {newRating === 3 && "Good"}
                            {newRating === 2 && "Fair"}
                            {newRating === 1 && "Poor"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Comment Input */}
                      <div style={{ marginBottom: "20px" }}>
                        <label style={{ display: "block", color: "#374151", fontSize: "14px", fontWeight: "600", marginBottom: "8px" }}>
                          Share your experience
                        </label>
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Tell us what you liked or disliked about this product. Your feedback helps others make better decisions!"
                          style={{
                            width: "100%",
                            minHeight: "120px",
                            padding: "16px",
                            border: "2px solid #e5e7eb",
                            borderRadius: "12px",
                            fontSize: "14px",
                            fontFamily: "inherit",
                            resize: "vertical",
                            boxSizing: "border-box",
                            transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                            outline: "none",
                          }}
                          onFocus={(e) => {
                            e.target.style.borderColor = "#ff6f61";
                            e.target.style.boxShadow = "0 0 0 3px rgba(255,111,97,0.1)";
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = "#e5e7eb";
                            e.target.style.boxShadow = "none";
                          }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px", fontSize: "12px", color: "#9ca3af" }}>
                          <span>Min. 3 characters required</span>
                          <span style={{ color: newComment.length >= 3 ? "#10b981" : "#9ca3af" }}>
                            {newComment.length} characters
                          </span>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={cancelReviewForm}
                          style={{
                            padding: "10px 20px",
                            backgroundColor: "#f3f4f6",
                            color: "#6b7280",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "600",
                            cursor: "pointer",
                          }}
                          disabled={isReviewLoading}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleSubmitReview}
                          disabled={isReviewLoading || newComment.trim().length < 3}
                          style={{
                            padding: "10px 24px",
                            backgroundColor: isReviewLoading || newComment.trim().length < 3 ? "#d1d5db" : "#ff6f61",
                            color: "#fff",
                            border: "none",
                            borderRadius: "10px",
                            fontWeight: "600",
                            cursor: isReviewLoading || newComment.trim().length < 3 ? "not-allowed" : "pointer",
                          }}
                        >
                          {isReviewLoading ? "Submitting..." : editingReview ? "Update Review" : "Submit Review"}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Reviews Summary */}
                  {reviews.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        padding: isMobile ? "20px" : "24px",
                        background: "linear-gradient(135deg, #fff5f3 0%, #fff 100%)",
                        borderRadius: "20px",
                        border: "1px solid #ffe4e0",
                        marginBottom: "8px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "16px" : "24px", flexWrap: isMobile ? "wrap" : "nowrap" }}>
                        {/* Average Rating */}
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: isMobile ? "36px" : "48px", fontWeight: "800", color: "#ff6f61", lineHeight: 1 }}>
                            {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                          </div>
                          <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginTop: "4px" }}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} style={{ fontSize: "14px", color: star <= Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) ? "#ff6f61" : "#e5e7eb" }}>
                                ★
                              </span>
                            ))}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6b7280", marginTop: "4px" }}>
                            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                          </div>
                        </div>
                        
                        {/* Rating Distribution */}
                        <div style={{ flex: 1, minWidth: isMobile ? "100%" : "200px" }}>
                          {[5, 4, 3, 2, 1].map((rating) => {
                            const count = reviews.filter((r) => r.rating === rating).length;
                            const percentage = (count / reviews.length) * 100;
                            return (
                              <div key={rating} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                <span style={{ fontSize: "12px", color: "#6b7280", width: "20px" }}>{rating}★</span>
                                <div style={{ flex: 1, height: "6px", backgroundColor: "#f3f4f6", borderRadius: "3px", overflow: "hidden" }}>
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                    style={{ height: "100%", backgroundColor: "#ff6f61", borderRadius: "3px" }}
                                  />
                                </div>
                                <span style={{ fontSize: "12px", color: "#9ca3af", width: "30px", textAlign: "right" }}>{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Reviews List */}
                  {isReviewLoading && reviews.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        style={{ fontSize: "24px", marginBottom: "12px" }}
                      >
                        ⏳
                      </motion.div>
                      <p>Loading reviews...</p>
                    </div>
                  ) : reviews.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      style={{ textAlign: "center", padding: "48px 24px", color: "#6b7280", backgroundColor: "#fafbfc", borderRadius: "20px" }}
                    >
                      <div style={{ fontSize: "48px", marginBottom: "16px" }}>💬</div>
                      <p style={{ fontSize: "16px", fontWeight: "600", color: "#374151", marginBottom: "8px" }}>No reviews yet</p>
                      <p style={{ fontSize: "14px" }}>Be the first to share your experience with this product!</p>
                    </motion.div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                      {reviews.map((review, index) => (
                        <motion.div
                          key={review._id || index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.08 }}
                          whileHover={{ y: -2, boxShadow: "0 8px 25px rgba(0,0,0,0.08)" }}
                          style={{ 
                            padding: isMobile ? "20px" : "24px",
                            borderRadius: "20px",
                            backgroundColor: userReview?._id === review._id ? "linear-gradient(135deg, #fff5f3 0%, #fff 100%)" : "#fff",
                            background: userReview?._id === review._id ? "linear-gradient(135deg, #fff5f3 0%, #fff 100%)" : "#fff",
                            border: userReview?._id === review._id ? "1px solid #ff6f61" : "1px solid #f3f4f6",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", flexWrap: isMobile ? "wrap" : "nowrap", gap: isMobile ? "12px" : "16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              {/* Avatar */}
                              <div style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #ff6f61 0%, #ff8a7a 100%)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: "18px",
                                fontWeight: "600",
                              }}>
                                {(review.userName || review.userId?.name || "A").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <strong style={{ color: "#1f2937", display: "block", fontSize: "15px", fontWeight: "600" }}>
                                  {review.userName || review.userId?.name || "Anonymous"}
                                </strong>
                                <span style={{ fontSize: "12px", color: "#9ca3af", display: "flex", alignItems: "center", gap: "6px" }}>
                                  ✓ Verified Purchase
                                </span>
                              </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              {/* Star Rating */}
                              <div style={{ display: "flex", gap: "2px" }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span 
                                    key={star} 
                                    style={{ 
                                      fontSize: "14px", 
                                      color: star <= review.rating ? "#ff6f61" : "#e5e7eb",
                                      transition: "color 0.2s",
                                    }}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <span style={{ fontSize: "12px", color: "#9ca3af", whiteSpace: "nowrap" }}>
                                {new Date(review.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                              </span>
                            </div>
                          </div>
                          
                          {/* Review Comment */}
                          <p style={{ color: "#4b5563", lineHeight: "1.7", fontSize: "14px", marginLeft: isMobile ? "0" : "56px" }}>
                            {review.comment}
                          </p>
                          
                          {/* Edit/Delete Actions */}
                          {userReview?._id === review._id && (
                            <div style={{ display: "flex", gap: "8px", marginTop: "16px", marginLeft: isMobile ? "0" : "56px" }}>
                              <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "#e5e7eb" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleEditReview(review)}
                                style={{
                                  padding: "8px 16px",
                                  backgroundColor: "#f3f4f6",
                                  border: "none",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  color: "#6b7280",
                                  fontWeight: "500",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                ✏️ Edit
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.02, backgroundColor: "#fecaca" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleDeleteReview(review._id)}
                                style={{
                                  padding: "8px 16px",
                                  backgroundColor: "#fef2f2",
                                  border: "none",
                                  borderRadius: "8px",
                                  cursor: "pointer",
                                  fontSize: "13px",
                                  color: "#ef4444",
                                  fontWeight: "500",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px",
                                }}
                              >
                                🗑️ Delete
                              </motion.button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Related Products */}
        {productData?.category && productData?.subCategory && (
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <RelatedProduct category={productData.category} subCategory={productData.subCategory} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default Product;
