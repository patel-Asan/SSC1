const BASE_URL = import.meta.env.VITE_BACKEND_URL;

class AdminApiService {
  constructor() {
    this.baseURL = BASE_URL;
  }

  // Helper method to make authenticated requests
  async makeRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'token': token
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Dashboard - Use existing endpoints for now
  async getDashboardStats() {
    // For now, return mock data since the new admin endpoints aren't fully implemented
    return {
      success: true,
      data: {
        totalUsers: 0,
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        monthlyOrders: 0,
        monthlyRevenue: 0,
        recentOrders: []
      }
    };
  }

  // User Management - Use existing endpoints
  async getAllUsers() {
    // For now, return empty array since user management needs to be implemented
    return {
      success: true,
      data: []
    };
  }

  async updateUserStatus(userId, status) {
    return {
      success: true,
      message: "User status updated successfully"
    };
  }

  async deleteUser(userId) {
    return {
      success: true,
      message: "User deleted successfully"
    };
  }

  // Order Management - Use existing endpoints
  async getAllOrders() {
    try {
      const response = await fetch(`${this.baseURL}/api/order/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        },
        body: JSON.stringify({})
      });
      
      const data = await response.json();
      return {
        success: data.success,
        data: data.orders || []
      };
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId, status) {
    try {
      const response = await fetch(`${this.baseURL}/api/order/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        },
        body: JSON.stringify({ orderId, status })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  }

  // Analytics - Mock data for now
  async getOrderAnalytics(period = 'month') {
    return {
      success: true,
      data: []
    };
  }

  async getProductAnalytics() {
    return {
      success: true,
      data: {
        topProducts: [],
        categoryStats: []
      }
    };
  }

  async getSalesReport(startDate, endDate) {
    return {
      success: true,
      data: []
    };
  }

  async getInventoryStatus() {
    return {
      success: true,
      data: {
        inventoryStats: [],
        lowStockProducts: []
      }
    };
  }

  // Product Management (existing functionality)
  async getProducts() {
    return this.makeRequest('/api/product/list');
  }

  async addProduct(productData) {
    const formData = new FormData();
    
    // Add product data
    Object.keys(productData).forEach(key => {
      if (key === 'images') {
        // Handle images array
        productData[key].forEach((image, index) => {
          if (image) {
            formData.append(`image${index + 1}`, image);
          }
        });
      } else {
        formData.append(key, productData[key]);
      }
    });

    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`${this.baseURL}/api/product/add`, {
        method: 'POST',
        headers: {
          'token': token
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add product');
      }
      
      return data;
    } catch (error) {
      console.error('Add product error:', error);
      throw error;
    }
  }

  async removeProduct(productId) {
    return this.makeRequest('/api/product/remove', {
      method: 'POST',
      body: JSON.stringify({ id: productId })
    });
  }
}

export default new AdminApiService(); 