import orderModel from "../models/orderModel.js";
import userModel from "../models/usermodel.js";
import productmodel from "../models/productmodel.js";

// Get overall stats
const getOverallStats = async (req, res) => {
    try {
        const totalOrders = await orderModel.countDocuments();
        const totalUsers = await userModel.countDocuments();
        const totalProducts = await productmodel.countDocuments();
        
        const orders = await orderModel.find({});
        const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
        
        const deliveredOrders = await orderModel.countDocuments({ status: 'Delivered' });
        const pendingOrders = await orderModel.countDocuments({ status: { $in: ['Order Placed', 'Processing', 'Shipped'] } });
        
        // Monthly stats
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthlyOrders = await orderModel.countDocuments({ date: { $gte: thisMonth } });
        const monthlyRevenue = orders
            .filter(o => new Date(o.date) >= thisMonth)
            .reduce((sum, order) => sum + (order.amount || 0), 0);

        res.status(200).json({
            success: true,
            stats: {
                totalOrders,
                totalUsers,
                totalProducts,
                totalRevenue,
                deliveredOrders,
                pendingOrders,
                monthlyOrders,
                monthlyRevenue
            }
        });
    } catch (error) {
        console.error("Get overall stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch stats"
        });
    }
};

// Get sales trends (daily/weekly/monthly)
const getSalesTrends = async (req, res) => {
    try {
        const { period = 'daily' } = req.query;
        const now = new Date();
        let startDate;
        let dateFormat;
        
        switch (period) {
            case 'weekly':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                dateFormat = '%Y-%m-%d';
                break;
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                dateFormat = '%Y-%m-%d';
                break;
            case 'yearly':
                startDate = new Date(now.getFullYear(), 0, 1);
                dateFormat = '%Y-%m';
                break;
            default: // daily (last 30 days)
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                dateFormat = '%Y-%m-%d';
        }

        const orders = await orderModel.find({
            date: { $gte: startDate }
        }).sort({ date: 1 });

        const trends = {};
        orders.forEach(order => {
            const date = new Date(order.date);
            let key;
            if (period === 'yearly') {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            } else {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
            }
            
            if (!trends[key]) {
                trends[key] = { date: key, orders: 0, revenue: 0 };
            }
            trends[key].orders += 1;
            trends[key].revenue += order.amount || 0;
        });

        const trendData = Object.values(trends);

        res.status(200).json({
            success: true,
            period,
            data: trendData
        });
    } catch (error) {
        console.error("Get sales trends error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch sales trends"
        });
    }
};

// Get top selling products
const getTopProducts = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        const productSales = {};

        orders.forEach(order => {
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach(item => {
                    const productId = item._id || item.productId;
                    if (productId) {
                        if (!productSales[productId]) {
                            productSales[productId] = {
                                productId,
                                name: item.name,
                                totalSold: 0,
                                totalRevenue: 0
                            };
                        }
                        productSales[productId].totalSold += item.quantity || 1;
                        productSales[productId].totalRevenue += (item.price || 0) * (item.quantity || 1);
                    }
                });
            }
        });

        const topProducts = Object.values(productSales)
            .sort((a, b) => b.totalSold - a.totalSold)
            .slice(0, 10);

        res.status(200).json({
            success: true,
            data: topProducts
        });
    } catch (error) {
        console.error("Get top products error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch top products"
        });
    }
};

// Get recent orders
const getRecentOrders = async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        const recentOrders = await orderModel
            .find({})
            .sort({ date: -1 })
            .limit(parseInt(limit));

        res.status(200).json({
            success: true,
            orders: recentOrders
        });
    } catch (error) {
        console.error("Get recent orders error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch recent orders"
        });
    }
};

// Get customer stats
const getCustomerStats = async (req, res) => {
    try {
        const users = await userModel.find({});
        const orders = await orderModel.find({});

        // Calculate customer-specific stats
        const customerStats = {};
        orders.forEach(order => {
            const userId = order.userId?.toString();
            if (userId) {
                if (!customerStats[userId]) {
                    customerStats[userId] = {
                        userId,
                        totalOrders: 0,
                        totalSpent: 0
                    };
                }
                customerStats[userId].totalOrders += 1;
                customerStats[userId].totalSpent += order.amount || 0;
            }
        });

        const topCustomers = Object.values(customerStats)
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 10);

        // Fetch user details for top customers
        const topCustomersWithDetails = await Promise.all(
            topCustomers.map(async (customer) => {
                const user = await userModel.findById(customer.userId);
                return {
                    ...customer,
                    name: user?.name || 'Unknown',
                    email: user?.email || 'Unknown'
                };
            })
        );

        res.status(200).json({
            success: true,
            totalCustomers: users.length,
            topCustomers: topCustomersWithDetails
        });
    } catch (error) {
        console.error("Get customer stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch customer stats"
        });
    }
};

export {
    getOverallStats,
    getSalesTrends,
    getTopProducts,
    getRecentOrders,
    getCustomerStats
};
