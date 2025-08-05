// Test script to verify admin panel functionality
const testAdminPanel = async () => {
  try {
    console.log('🧪 Testing Admin Panel Functionality...');
    
    // Step 1: Test admin login
    console.log('\n1️⃣ Testing Admin Login...');
    const loginResponse = await fetch('http://localhost:4000/api/user/admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'adminssc@gmail.com',
        password: 'ssc112233'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('📝 Login response:', loginData);
    
    if (!loginData.success) {
      console.log('❌ Admin login failed');
      return;
    }
    
    const token = loginData.token;
    console.log('✅ Admin login successful!');
    
    // Step 2: Test get products
    console.log('\n2️⃣ Testing Get Products...');
    const productsResponse = await fetch('http://localhost:4000/api/product/list');
    const productsData = await productsResponse.json();
    console.log(`📝 Found ${productsData.products.length} products`);
    
    if (productsData.products.length === 0) {
      console.log('ℹ️ No products to test removal');
      return;
    }
    
    // Step 3: Test remove product
    console.log('\n3️⃣ Testing Remove Product...');
    const firstProduct = productsData.products[0];
    console.log(`🔍 Removing product: ${firstProduct.name} (ID: ${firstProduct._id})`);
    
    const removeResponse = await fetch('http://localhost:4000/api/product/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ id: firstProduct._id })
    });
    
    const removeData = await removeResponse.json();
    console.log('📝 Remove response:', removeData);
    
    if (removeData.success) {
      console.log('✅ Remove successful!');
      
      // Step 4: Verify product was removed
      console.log('\n4️⃣ Verifying Product Removal...');
      const verifyResponse = await fetch('http://localhost:4000/api/product/list');
      const verifyData = await verifyResponse.json();
      console.log(`📝 Now found ${verifyData.products.length} products`);
      
      const productStillExists = verifyData.products.find(p => p._id === firstProduct._id);
      if (productStillExists) {
        console.log('❌ Product still exists after removal');
      } else {
        console.log('✅ Product successfully removed!');
      }
    } else {
      console.log('❌ Remove failed:', removeData.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testAdminPanel(); 