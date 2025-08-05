// Test script for admin functionality
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
        email: 'admin@example.com',
        password: 'admin123'
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

// Test dashboard stats
async function testDashboard(token) {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/dashboard`, {
      headers: {
        'token': token
      }
    });
    
    const data = await response.json();
    console.log('Dashboard Test:', data.success ? '✅ PASSED' : '❌ FAILED');
    return data.success;
  } catch (error) {
    console.error('Dashboard Error:', error);
    return false;
  }
}

// Test get users
async function testGetUsers(token) {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/users`, {
      headers: {
        'token': token
      }
    });
    
    const data = await response.json();
    console.log('Get Users Test:', data.success ? '✅ PASSED' : '❌ FAILED');
    return data.success;
  } catch (error) {
    console.error('Get Users Error:', error);
    return false;
  }
}

// Test get orders
async function testGetOrders(token) {
  try {
    const response = await fetch(`${BASE_URL}/api/admin/orders`, {
      headers: {
        'token': token
      }
    });
    
    const data = await response.json();
    console.log('Get Orders Test:', data.success ? '✅ PASSED' : '❌ FAILED');
    return data.success;
  } catch (error) {
    console.error('Get Orders Error:', error);
    return false;
  }
}

// Test product management
async function testProductManagement(token) {
  try {
    // Test get products
    const getResponse = await fetch(`${BASE_URL}/api/admin/products`, {
      headers: {
        'token': token
      }
    });
    
    const getData = await getResponse.json();
    console.log('Get Products Test:', getData.success ? '✅ PASSED' : '❌ FAILED');
    
    // Test add product (if endpoint exists)
    const addResponse = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        category: 'test',
        image: ['test-image.jpg']
      })
    });
    
    const addData = await addResponse.json();
    console.log('Add Product Test:', addData.success ? '✅ PASSED' : '❌ FAILED');
    
    return getData.success;
  } catch (error) {
    console.error('Product Management Error:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 Testing Admin Functionality...\n');
  
  const token = await testAdminLogin();
  if (!token) {
    console.log('❌ Cannot proceed without admin token');
    return;
  }
  
  await testDashboard(token);
  await testGetUsers(token);
  await testGetOrders(token);
  await testProductManagement(token);
  
  console.log('\n✅ Admin functionality tests completed!');
  console.log('\n🌐 Access URLs:');
  console.log('   Backend: http://localhost:4000');
  console.log('   Admin Panel: http://localhost:5174');
  console.log('\n🔐 Admin Login:');
  console.log('   Email: admin@example.com');
  console.log('   Password: admin123');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests }; 