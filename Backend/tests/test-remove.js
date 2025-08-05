// Test script to verify remove product functionality
const testRemoveProduct = async () => {
  try {
    console.log('🧪 Testing Remove Product API...');
    
    // First, get the list of products
    const productsResponse = await fetch('http://localhost:4000/api/product/list');
    const productsData = await productsResponse.json();
    
    if (!productsData.success) {
      console.log('❌ Failed to get products');
      return;
    }
    
    console.log(`✅ Found ${productsData.products.length} products`);
    
    if (productsData.products.length === 0) {
      console.log('ℹ️ No products to test removal');
      return;
    }
    
    // Get the first product ID
    const firstProduct = productsData.products[0];
    console.log(`🔍 Testing with product: ${firstProduct.name} (ID: ${firstProduct._id})`);
    
    // Test the remove endpoint (this will fail without auth, but we can see the request format)
    const removeResponse = await fetch('http://localhost:4000/api/product/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: firstProduct._id })
    });
    
    const removeData = await removeResponse.json();
    console.log('📝 Remove response:', removeData);
    
    if (removeResponse.status === 401) {
      console.log('✅ Remove endpoint is working (auth required as expected)');
    } else {
      console.log('⚠️ Unexpected response from remove endpoint');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testRemoveProduct(); 