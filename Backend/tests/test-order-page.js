// Test script for order page functionality
// Using native fetch API (available in Node.js 18+)

const BASE_URL = 'http://localhost:4000';

// Test admin login
async function testAdminLogin() {
  try {
    const response = await fetch(`${BASE_URL}/api/user/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'adminssc@gmail.com',
        password: 'ssc112233'
      })
    });
    
    const data = await response.json();
    console.log('Admin Login Test:', data.success ? '✅ PASSED' : '❌ FAILED');
    return data.token;
  } catch (error) {
    console.error('Admin Login Error:', error);
    return null;
  }
}

// Test get all orders
async function testGetOrders(token) {
  try {
    const response = await fetch(`${BASE_URL}/api/order/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({})
    });
    
    const data = await response.json();
    console.log('Get Orders Test:', data.success ? '✅ PASSED' : '❌ FAILED');
    console.log('Orders found:', data.orders ? data.orders.length : 0);
    return data.success;
  } catch (error) {
    console.error('Get Orders Error:', error);
    return false;
  }
}

// Test update order status
async function testUpdateOrderStatus(token) {
  try {
    // First get orders to find an order ID
    const ordersResponse = await fetch(`${BASE_URL}/api/order/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({})
    });
    
    const ordersData = await ordersResponse.json();
    
    if (ordersData.success && ordersData.orders && ordersData.orders.length > 0) {
      const orderId = ordersData.orders[0]._id;
      
      const response = await fetch(`${BASE_URL}/api/order/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify({
          orderId: orderId,
          status: 'Processing'
        })
      });
      
      const data = await response.json();
      console.log('Update Order Status Test:', data.success ? '✅ PASSED' : '❌ FAILED');
      return data.success;
    } else {
      console.log('Update Order Status Test: ⚠️ SKIPPED (no orders found)');
      return true;
    }
  } catch (error) {
    console.error('Update Order Status Error:', error);
    return false;
  }
}

// Test place order functionality
async function testPlaceOrder() {
  try {
    // First login as a regular user
    const loginResponse = await fetch(`${BASE_URL}/api/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      console.log('Place Order Test: ⚠️ SKIPPED (test user not found)');
      return true;
    }
    
    const token = loginData.token;
    
    // Test placing an order
    const orderData = {
      address: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        street: '123 Test St',
        city: 'Test City',
        state: 'Test State',
        zipcode: '12345',
        country: 'Test Country',
        phone: '1234567890'
      },
      items: [
        {
          _id: 'test-product-id',
          name: 'Test Product',
          price: 100,
          size: 'M',
          quantity: 1
        }
      ],
      amount: 110,
      payment: 'cod'
    };
    
    const response = await fetch(`${BASE_URL}/api/order/place`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify(orderData)
    });
    
    const data = await response.json();
    console.log('Place Order Test:', data.success ? '✅ PASSED' : '❌ FAILED');
    return data.success;
  } catch (error) {
    console.error('Place Order Error:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 Testing Order Page Functionality...\n');
  
  const token = await testAdminLogin();
  if (!token) {
    console.log('❌ Cannot proceed without admin token');
    return;
  }
  
  await testGetOrders(token);
  await testUpdateOrderStatus(token);
  await testPlaceOrder();
  
  console.log('\n✅ Order page functionality tests completed!');
  console.log('\n🌐 Access URLs:');
  console.log('   Backend: http://localhost:4000');
  console.log('   Frontend: http://localhost:5173');
  console.log('   Admin Panel: http://localhost:5174');
  console.log('\n🔐 Admin Login:');
  console.log('   Email: adminssc@gmail.com');
  console.log('   Password: ssc112233');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests }; 