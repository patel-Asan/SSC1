// Test script to verify admin login
const testAdminLogin = async () => {
  try {
    console.log('🧪 Testing Admin Login...');
    
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
    
    if (loginData.success) {
      console.log('✅ Admin login successful!');
      console.log('🔑 Token:', loginData.token);
      
      // Now test remove with the token
      console.log('\n🧪 Testing Remove with Admin Token...');
      
      // Get products first
      const productsResponse = await fetch('http://localhost:4000/api/product/list');
      const productsData = await productsResponse.json();
      
      if (productsData.products.length > 0) {
        const firstProduct = productsData.products[0];
        console.log(`🔍 Testing remove for product: ${firstProduct.name} (ID: ${firstProduct._id})`);
        
        const removeResponse = await fetch('http://localhost:4000/api/product/remove', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.token}`
          },
          body: JSON.stringify({ id: firstProduct._id })
        });
        
        const removeData = await removeResponse.json();
        console.log('📝 Remove response:', removeData);
        
        if (removeData.success) {
          console.log('✅ Remove successful!');
        } else {
          console.log('❌ Remove failed:', removeData.message);
        }
      }
    } else {
      console.log('❌ Admin login failed:', loginData.message);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

testAdminLogin(); 