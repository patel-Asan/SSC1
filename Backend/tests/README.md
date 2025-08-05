# Backend Tests

This directory contains comprehensive test scripts for the e-commerce backend API.

## Test Files

### Core Tests
- `test-backend.js` - Basic backend connectivity test
- `test-admin-login.js` - Admin authentication test
- `test-admin-panel.js` - Admin panel functionality test
- `test-remove.js` - Product removal test
- `test-upload.js` - File upload test
- `test-image-upload.js` - Image upload test

### New Tests (Added for Order Functionality)
- `test-order-page.js` - Order placement and management tests
- `test-admin.js` - Comprehensive admin functionality tests
- `run-all-tests.js` - Comprehensive test runner for all functionality

## Running Tests

### Individual Tests
```bash
# Run specific tests
npm run test                    # Basic backend test
npm run test:admin             # Admin login test
npm run test:admin-panel       # Admin panel test
npm run test:upload            # Upload test
npm run test:image-upload      # Image upload test
npm run test:order             # Order functionality test
npm run test:admin-func        # Admin functionality test
```

### Comprehensive Tests
```bash
# Run all tests
npm run test:all               # Run all individual tests
npm run test:comprehensive     # Run comprehensive test suite
```

### Direct Execution
```bash
# Run tests directly with Node.js
node tests/test-order-page.js
node tests/test-admin.js
node tests/run-all-tests.js
```

## Test Coverage

### Order Functionality Tests
- ✅ Admin login and authentication
- ✅ Get all orders (admin)
- ✅ Update order status
- ✅ Place new orders (user)
- ✅ User authentication
- ✅ Order data validation

### Admin Functionality Tests
- ✅ Admin dashboard statistics
- ✅ User management
- ✅ Order management
- ✅ Product management
- ✅ Admin authentication

### Backend Health Tests
- ✅ Server connectivity
- ✅ API endpoint availability
- ✅ Database connectivity
- ✅ Authentication flow

## Test Data

### Admin Credentials
- Email: `adminssc@gmail.com`
- Password: `ssc112233`

### Test User Credentials
- Email: `test@example.com`
- Password: `test123`

## Expected Results

When tests pass successfully, you should see:
```
🧪 Testing Order Page Functionality...

Admin Login Test: ✅ PASSED
Get Orders Test: ✅ PASSED
Orders found: X
Update Order Status Test: ✅ PASSED
Place Order Test: ✅ PASSED

✅ Order page functionality tests completed!
```

## Troubleshooting

### Common Issues

1. **Backend not running**
   - Ensure backend server is started: `npm run server`
   - Check if port 4000 is available

2. **Database connection issues**
   - Verify MongoDB is running
   - Check connection string in `.env` file

3. **Authentication failures**
   - Ensure admin credentials are correct
   - Check JWT secret in `.env` file

4. **Test user not found**
   - Some tests may skip if test user doesn't exist
   - This is normal behavior

### Debug Mode

To see detailed error information, check the console output for:
- Network errors
- Authentication failures
- Database connection issues
- API response errors

## Adding New Tests

To add new test files:

1. Create a new test file in this directory
2. Use the existing test structure as a template
3. Add the test script to `package.json`
4. Update this README with test description

Example test structure:
```javascript
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4000';

async function testFunction() {
  try {
    const response = await fetch(`${BASE_URL}/api/endpoint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const data = await response.json();
    console.log('Test Name:', data.success ? '✅ PASSED' : '❌ FAILED');
    return data.success;
  } catch (error) {
    console.error('Test Error:', error);
    return false;
  }
}

export { testFunction };
```

## Environment Setup

Make sure you have:
- Node.js installed
- MongoDB running
- Backend server started (`npm run server`)
- All dependencies installed (`npm install`)

## API Endpoints Tested

- `GET /health` - Backend health check
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/user/admin` - Admin login
- `GET /api/product/list` - Product listing
- `POST /api/cart/get` - Get user cart
- `POST /api/order/place` - Place order
- `POST /api/order/list` - Get orders (admin)
- `POST /api/order/status` - Update order status
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - Get users (admin)
- `GET /api/admin/orders` - Get orders (admin) 