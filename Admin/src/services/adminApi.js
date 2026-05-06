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

  // Dashboard - Fetch real data from backend
  async getDashboardStats() {
    try {
      const response = await fetch(`${this.baseURL}/api/admin/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      console.log('📊 Dashboard API response:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch dashboard stats');
      }
      
      return {
        success: true,
        data: data.data
      };
    } catch (error) {
      console.error('Dashboard stats error:', error);
      // Return mock data if API fails
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
  }

  // User Management
  async getAllUsers() {
    try {
      const response = await fetch(`${this.baseURL}/api/admin/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      return {
        success: data.success,
        data: data.users || []
      };
    } catch (error) {
      console.error('Get users error:', error);
      throw error;
    }
  }

  async updateUserStatus(userId, status) {
    try {
      const response = await fetch(`${this.baseURL}/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        },
        body: JSON.stringify({ status })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Update user status error:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const response = await fetch(`${this.baseURL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
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

  // Analytics
  async getOrderAnalytics(period = 'month') {
    try {
      const response = await fetch(`${this.baseURL}/api/analytics/orders?period=${period}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      return {
        success: data.success,
        data: data.data || []
      };
    } catch (error) {
      console.error('Order analytics error:', error);
      return { success: false, data: [] };
    }
  }

  async getProductAnalytics() {
    try {
      const response = await fetch(`${this.baseURL}/api/analytics/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      return {
        success: data.success,
        data: data.data || { topProducts: [], categoryStats: [] }
      };
    } catch (error) {
      console.error('Product analytics error:', error);
      return { success: false, data: { topProducts: [], categoryStats: [] } };
    }
  }

  async getSalesReport(startDate, endDate) {
    try {
      const response = await fetch(`${this.baseURL}/api/analytics/sales?startDate=${startDate}&endDate=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      return {
        success: data.success,
        data: data.data || []
      };
    } catch (error) {
      console.error('Sales report error:', error);
      return { success: false, data: [] };
    }
  }

  async getInventoryStatus() {
    try {
      const response = await fetch(`${this.baseURL}/api/analytics/inventory`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'token': localStorage.getItem('token')
        }
      });
      
      const data = await response.json();
      return {
        success: data.success,
        data: data.data || { inventoryStats: [], lowStockProducts: [] }
      };
    } catch (error) {
      console.error('Inventory status error:', error);
      return { success: false, data: { inventoryStats: [], lowStockProducts: [] } };
    }
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