# E-commerce Admin Panel

A comprehensive e-commerce platform with full admin functionality, featuring a modern React frontend, Node.js backend, and comprehensive admin dashboard.

## 🚀 Features

### Admin Panel Features
- **Dashboard Analytics**: Real-time statistics, revenue tracking, and order overview
- **User Management**: View, update status, and manage all users
- **Order Management**: Complete order processing with status updates
- **Product Management**: Add, edit, and remove products with image uploads
- **Inventory Tracking**: Monitor stock levels and product availability
- **Sales Analytics**: Detailed sales reports and revenue analytics
- **Order Analytics**: Track order trends and customer behavior

### Backend Features
- **RESTful API**: Complete CRUD operations for all entities
- **Authentication**: JWT-based authentication for users and admin
- **File Upload**: Image upload functionality for products
- **Database**: MongoDB with Mongoose ODM
- **Security**: Input validation, error handling, and secure routes

### Frontend Features
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Real-time Updates**: Live data updates and notifications
- **Toast Notifications**: User-friendly feedback system
- **Responsive Design**: Works on all device sizes

## 📁 Project Structure

```
├── Backend/                 # Node.js/Express API
│   ├── controllers/        # Business logic
│   ├── models/            # Database schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Authentication & validation
│   ├── config/           # Database configuration
│   └── uploads/          # Image storage
├── Fronted/               # Customer-facing React app
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   └── services/     # API services
├── Admin/                 # Admin React app
│   ├── src/
│   │   ├── component/    # Admin components
│   │   ├── page/         # Admin pages
│   │   └── services/     # Admin API services
└── uploads/              # Shared image storage
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ecommerce-admin
```

### 2. Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory:
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

### 3. Frontend Setup
```bash
cd Fronted
npm install
```

Create a `.env` file in the Fronted directory:
```env
VITE_BACKEND_URL=http://localhost:4000
```

### 4. Admin Panel Setup
```bash
cd Admin
npm install
```

Create a `.env` file in the Admin directory:
```env
VITE_BACKEND_URL=http://localhost:4000
```

## 🚀 Running the Application

### Option 1: Use the Batch Script (Windows)
```bash
start-all.bat
```

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd Backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd Fronted
npm run dev
```

**Terminal 3 - Admin Panel:**
```bash
cd Admin
npm run dev
```

## 🌐 Access URLs

- **Backend API**: http://localhost:4000
- **Frontend (Customer)**: http://localhost:5173
- **Admin Panel**: http://localhost:5174

## 🔐 Admin Login

Default admin credentials:
- **Email**: admin@example.com
- **Password**: admin123

## 📊 Admin Features

### Dashboard
- Total users, products, and orders
- Revenue statistics
- Recent orders overview
- Monthly analytics

### User Management
- View all registered users
- Update user status (active/suspended/banned)
- User activity tracking

### Order Management
- View all orders with customer details
- Update order status (pending/processing/shipped/delivered/cancelled)
- Order tracking and notes

### Product Management
- Add new products with multiple images
- Edit existing products
- Remove products
- Category and subcategory management

### Analytics
- Sales reports with date filtering
- Order analytics by period
- Product performance metrics
- Inventory status

## 🔧 API Endpoints

### Admin Endpoints
```
GET    /api/admin/dashboard          # Dashboard statistics
GET    /api/admin/users              # Get all users
PUT    /api/admin/users/:id/status   # Update user status
DELETE /api/admin/users/:id          # Delete user
GET    /api/admin/orders             # Get all orders
PUT    /api/admin/orders/:id/status  # Update order status
GET    /api/admin/analytics/*        # Analytics endpoints
```

### User Endpoints
```
POST   /api/user/register           # User registration
POST   /api/user/login              # User login
POST   /api/user/admin              # Admin login
```

### Product Endpoints
```
GET    /api/product/list            # Get all products
POST   /api/product/add             # Add new product
POST   /api/product/remove          # Remove product
```

### Order Endpoints
```
POST   /api/order/place             # Place new order
GET    /api/order/list              # Get user orders
```

## 🛡️ Security Features

- JWT-based authentication
- Input validation and sanitization
- CORS configuration
- Secure file uploads
- Error handling and logging

## 📱 Responsive Design

The admin panel is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🔄 Real-time Updates

- Live dashboard statistics
- Real-time order status updates
- Instant user management changes
- Toast notifications for all actions

## 🎨 UI/UX Features

- Modern, clean interface
- Intuitive navigation
- Color-coded status indicators
- Loading states and error handling
- Consistent design language

## 🚀 Performance Optimizations

- Efficient database queries
- Image optimization
- Lazy loading for large datasets
- Caching strategies

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

---

**Note**: Make sure to update the environment variables with your actual values before running the application. 