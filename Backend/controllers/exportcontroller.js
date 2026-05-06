import orderModel from "../models/orderModel.js";
import userModel from "../models/usermodel.js";

// Export orders as CSV
const exportOrdersCSV = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders to export"
            });
        }

        // CSV Header
        const csvHeader = 'Order ID,Customer,Email,Amount,Status,Date,Items,Address\n';

        // CSV Rows
        const csvRows = await Promise.all(orders.map(async (order) => {
            const user = await userModel.findById(order.userId);
            const items = order.items?.map(item => `${item.name} (${item.quantity}x)`).join('; ') || '';
            const address = order.address ? 
                `${order.address.street || ''}, ${order.address.city || ''}, ${order.address.zipcode || ''}` : 
                '';

            return [
                order._id?.toString() || '',
                user?.name || 'Unknown',
                user?.email || 'Unknown',
                order.amount || 0,
                order.status || 'N/A',
                new Date(order.date).toLocaleDateString(),
                `"${items}"`,
                `"${address}"`
            ].join(',');
        }));

        const csvContent = csvHeader + csvRows.join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=orders_export.csv');
        res.status(200).send(csvContent);
    } catch (error) {
        console.error("Export orders CSV error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to export orders"
        });
    }
};

// Export customers as CSV
const exportCustomersCSV = async (req, res) => {
    try {
        const customers = await userModel.find({}).sort({ createdAt: -1 });

        if (customers.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No customers to export"
            });
        }

        // CSV Header
        const csvHeader = 'User ID,Name,Email,Phone,Created At\n';

        // CSV Rows
        const csvRows = customers.map(customer => {
            return [
                customer._id?.toString() || '',
                customer.name || 'Unknown',
                customer.email || 'Unknown',
                customer.phone || 'N/A',
                new Date(customer.createdAt).toLocaleDateString()
            ].join(',');
        });

        const csvContent = csvHeader + csvRows.join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=customers_export.csv');
        res.status(200).send(csvContent);
    } catch (error) {
        console.error("Export customers CSV error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to export customers"
        });
    }
};

export {
    exportOrdersCSV,
    exportCustomersCSV
};
