const API_BASE_URL = 'http://localhost:4000/api';

class AdminApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Product APIs
  async getProducts() {
    return this.request('/product/list');
  }

  async addProduct(productData, token) {
    const formData = new FormData();
    
    // Add text fields
    Object.keys(productData).forEach(key => {
      if (key !== 'images') {
        formData.append(key, productData[key]);
      }
    });

    // Add images
    if (productData.images) {
      productData.images.forEach((image, index) => {
        formData.append(`image${index + 1}`, image);
      });
    }

    const url = `${this.baseURL}/product/add`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'token': token,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to add product');
    }
    return data;
  }

  async removeProduct(id, token) {
    console.log("🔍 API Service - Removing product with ID:", id);
    console.log("🔑 API Service - Token:", token);
    
    if (!id) {
      throw new Error("Product ID is required");
    }
    
    if (!token) {
      throw new Error("Authentication token is required");
    }
    
    const requestBody = { id };
    console.log("📝 API Service - Request body:", requestBody);
    
    try {
      const response = await this.request('/product/remove', {
        method: 'POST',
        headers: {
          'token': token,
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log("✅ API Service - Remove successful:", response);
      return response;
    } catch (error) {
      console.error("❌ API Service - Remove failed:", error);
      throw error;
    }
  }

  // Admin login
  async adminLogin(credentials) {
    return this.request('/user/admin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }
}

export default new AdminApiService(); 