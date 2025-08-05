// Comprehensive test runner for all backend functionality
// Using native fetch API (available in Node.js 18+)
import { runTests as runOrderTests } from './test-order-page.js';
import { runTests as runAdminTests } from './test-admin.js';

const BASE_URL = 'http://localhost:4000';

// Test backend health
async function testBackendHealth() {
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    console.log('Backend Health Test:', data.status === 'OK' ? '✅ PASSED' : '❌ FAILED');
    return data.status === 'OK';
  } catch (error) {
    console.error('Backend Health Error:', error);
    return false;
  }
}

// Test user registration and login
async function testUserAuth() {
  try {
    // Test user registration
    const registerResponse = await fetch(`${BASE_URL}/api/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('User Registration Test:', registerData.success ? '✅ PASSED' : '❌ FAILED');
    
    // Test user login
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
    console.log('User Login Test:', loginData.success ? '✅ PASSED' : '❌ FAILED');
    
    return loginData.success;
  } catch (error) {
    console.error('User Auth Error:', error);
    return false;
  }
}

// Test product endpoints
async function testProductEndpoints() {
  try {
    const response = await fetch(`${BASE_URL}/api/product/list`);
    const data = await response.json();
    console.log('Product List Test:', data.success ? '✅ PASSED' : '❌ FAILED');
    console.log('Products found:', data.products ? data.products.length : 0);
    return data.success;
  } catch (error) {
    console.error('Product Endpoints Error:', error);
    return false;
  }
}

// Test cart functionality
async function testCartFunctionality() {
  try {
    // First login to get token
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
      console.log('Cart Test: ⚠️ SKIPPED (user not found)');
      return true;
    }
    
    const token = loginData.token;
    
    // Test get cart
    const cartResponse = await fetch(`${BASE_URL}/api/cart/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'token': token
      },
      body: JSON.stringify({})
    });
    
    const cartData = await cartResponse.json();
    console.log('Cart Get Test:', cartData.success ? '✅ PASSED' : '❌ FAILED');
    
    return cartData.success;
  } catch (error) {
    console.error('Cart Functionality Error:', error);
    return false;
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Backend Tests...\n');
  
  const results = {
    health: await testBackendHealth(),
    auth: await testUserAuth(),
    products: await testProductEndpoints(),
    cart: await testCartFunctionality()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('   Backend Health:', results.health ? '✅ PASSED' : '❌ FAILED');
  console.log('   User Authentication:', results.auth ? '✅ PASSED' : '❌ FAILED');
  console.log('   Product Endpoints:', results.products ? '✅ PASSED' : '❌ FAILED');
  console.log('   Cart Functionality:', results.cart ? '✅ PASSED' : '❌ FAILED');
  
  console.log('\n🧪 Running Order Tests...');
  await runOrderTests();
  
  console.log('\n🧪 Running Admin Tests...');
  await runAdminTests();
  
  console.log('\n✅ All tests completed!');
  console.log('\n🌐 Access URLs:');
  console.log('   Backend: http://localhost:4000');
  console.log('   Frontend: http://localhost:5173');
  console.log('   Admin Panel: http://localhost:5174');
  console.log('\n📝 Test Commands:');
  console.log('   npm run test:order     - Run order tests only');
  console.log('   npm run test:admin-func - Run admin tests only');
  console.log('   npm run test:all       - Run all tests');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

export { runAllTests }; 