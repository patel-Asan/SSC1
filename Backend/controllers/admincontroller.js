import userModel from "../models/usermodel.js";
import orderModel from "../models/orderModel.js";
import productModel from "../models/productmodel.js";

// Dashboard Statistics
export const getDashboardStats = async (req, res) => {
    try {
        // Get total counts
        const totalUsers = await userModel.countDocuments();
        const totalProducts = await productModel.countDocuments();
        const totalOrders = await orderModel.countDocuments();
        
        // Get recent orders
        const recentOrders = await orderModel.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'name email');
        
        // Get total revenue (from delivered orders)
        const orders = await orderModel.find({ status: 'delivered' });
        console.log('📦 Delivered orders found:', orders.length);
        console.log('📦 Orders:', orders.map(o => ({ id: o._id, status: o.status, amount: o.amount, totalAmount: o.totalAmount })));
        const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || order.amount || 0), 0);
        console.log('💰 Total Revenue calculated:', totalRevenue);
        
        // Get monthly stats
        const currentMonth = new Date();
        currentMonth.setDate(1);
        currentMonth.setHours(0, 0, 0, 0);
        
        const monthlyOrders = await orderModel.countDocuments({
            createdAt: { $gte: currentMonth }
        });
        
        const monthlyRevenue = await orderModel.aggregate([
            {
                $match: {
                    status: 'delivered',
                    createdAt: { $gte: currentMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: { $ifNull: ['$totalAmount', '$amount', 0] } }
                }
            }
        ]);
        
        const monthlyRevenueAmount = monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0;
        console.log('📊 Monthly Revenue:', monthlyRevenueAmount);
        console.log('📊 Sending data:', { totalUsers, totalProducts, totalOrders, totalRevenue, monthlyOrders, monthlyRevenue: monthlyRevenueAmount });
        
        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue,
                monthlyOrders,
                monthlyRevenue: monthlyRevenueAmount,
                recentOrders
            }
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
};

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find().select('-password').sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

// Update user status
export const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!['active', 'suspended', 'banned'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Must be 'active', 'suspended', or 'banned'"
            });
        }
        
        const user = await userModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data: user
        });
    } catch (error) {
        console.error("Update user status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update user status"
        });
    }
};

// Delete user
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await userModel.findByIdAndDelete(id);
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete user"
        });
    }
};

// Get all orders
export const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error("Get orders error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch orders"
        });
    }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }
        
        const order = await orderModel.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('userId', 'name email');
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        
        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });
    } catch (error) {
        console.error("Update order status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update order status"
        });
    }
};

// Order Analytics
export const getOrderAnalytics = async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        
        let startDate = new Date();
        if (period === 'week') {
            startDate.setDate(startDate.getDate() - 7);
        } else if (period === 'month') {
            startDate.setMonth(startDate.getMonth() - 1);
        } else if (period === 'year') {
            startDate.setFullYear(startDate.getFullYear() - 1);
        }
        
        const analytics = await orderModel.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: "$totalAmount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        
        res.status(200).json({
            success: true,
            data: analytics
        });
    } catch (error) {
        console.error("Order analytics error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch order analytics"
        });
    }
};

// Product Analytics
export const getProductAnalytics = async (req, res) => {
    try {
        const topProducts = await productModel.find()
            .sort({ bestseller: -1, date: -1 })
            .limit(10);
        
        const categoryStats = await productModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        
        res.status(200).json({
            success: true,
            data: {
                topProducts,
                categoryStats
            }
        });
    } catch (error) {
        console.error("Product analytics error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch product analytics"
        });
    }
};

// Sales Report
export const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        
        let matchQuery = {};
        if (startDate && endDate) {
            matchQuery.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        
        const salesReport = await orderModel.aggregate([
            {
                $match: {
                    ...matchQuery,
                    status: 'delivered'
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m",
                            date: "$createdAt"
                        }
                    },
                    totalSales: { $sum: "$totalAmount" },
                    orderCount: { $sum: 1 },
                    avgOrderValue: { $avg: "$totalAmount" }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        
        res.status(200).json({
            success: true,
            data: salesReport
        });
    } catch (error) {
        console.error("Sales report error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch sales report"
        });
    }
};

// Inventory Status
export const getInventoryStatus = async (req, res) => {
    try {
        const inventoryStats = await productModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    totalProducts: { $sum: 1 },
                    avgPrice: { $avg: "$price" },
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" }
                }
            },
            {
                $sort: { totalProducts: -1 }
            }
        ]);
        
        const lowStockProducts = await productModel.find({
            $expr: {
                $lt: [{ $size: "$sizes" }, 3]
            }
        }).limit(10);
        
        res.status(200).json({
            success: true,
            data: {
                inventoryStats,
                lowStockProducts
            }
        });
    } catch (error) {
        console.error("Inventory status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch inventory status"
        });
    }
}; 