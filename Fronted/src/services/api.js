const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api`;

class ApiService {
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

  async getProduct(id) {
    return this.request('/product/single', {
      method: 'POST',
      body: JSON.stringify({ id }),
    });
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
        'Authorization': `Bearer ${token}`,
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
    return this.request('/product/remove', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
  }

  // User APIs
  async register(userData) {
    return this.request('/user/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async adminLogin(credentials) {
    return this.request('/user/admin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Cart APIs (for future implementation)
  async getCart(token) {
    return this.request('/user/cart', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateCart(cartData, token) {
    return this.request('/user/cart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(cartData),
    });
  }

  // Stats API
  async getStats() {
    return this.request('/stats');
  }

  // Get total users count (for admin/stats)
  async getUserCount(token) {
    return this.request('/user/count', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export default new ApiService(); 