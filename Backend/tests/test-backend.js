// Simple test script to verify backend functionality
const testBackend = async () => {
  try {
    console.log('🧪 Testing Backend API...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:4000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health Check:', healthData);
    
    // Test products endpoint
    const productsResponse = await fetch('http://localhost:4000/api/product/list');
    const productsData = await productsResponse.json();
    console.log('✅ Products API:', `Found ${productsData.products?.length || 0} products`);
    
    console.log('🎉 Backend is working correctly!');
    
  } catch (error) {
    console.error('❌ Backend test failed:', error.message);
  }
};

testBackend(); 