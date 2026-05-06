import userModel from "../models/usermodel.js";
import orderModel from "../models/orderModel.js";

// Get all customers
const getAllCustomers = async (req, res) => {
    try {
        const customers = await userModel.find({}).select('-password').sort({ createdAt: -1 });
        
        // Get order stats for each customer
        const customersWithStats = await Promise.all(
            customers.map(async (customer) => {
                const orders = await orderModel.find({ userId: customer._id });
                const totalSpent = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
                const totalOrders = orders.length;
                
                return {
                    ...customer.toObject(),
                    totalSpent,
                    totalOrders,
                    lastOrder: orders.length > 0 ? orders[orders.length - 1].date : null
                };
            })
        );

        res.status(200).json({
            success: true,
            customers: customersWithStats
        });
    } catch (error) {
        console.error("Get all customers error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch customers"
        });
    }
};

// Get customer details with order history
const getCustomerDetails = async (req, res) => {
    try {
        const { id } = req.params;
        
        const customer = await userModel.findById(id).select('-password');
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        const orders = await orderModel.find({ userId: id }).sort({ date: -1 });
        const totalSpent = orders.reduce((sum, order) => sum + (order.amount || 0), 0);

        res.status(200).json({
            success: true,
            customer: {
                ...customer.toObject(),
                totalSpent,
                totalOrders: orders.length,
                orders
            }
        });
    } catch (error) {
        console.error("Get customer details error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch customer details"
        });
    }
};

// Update customer info
const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, address } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;

        const customer = await userModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).select('-password');

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            customer
        });
    } catch (error) {
        console.error("Update customer error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update customer"
        });
    }
};

// Delete customer
const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await userModel.findByIdAndDelete(id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        // Also delete customer's orders
        await orderModel.deleteMany({ userId: id });

        res.status(200).json({
            success: true,
            message: "Customer deleted successfully"
        });
    } catch (error) {
        console.error("Delete customer error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete customer"
        });
    }
};

export {
    getAllCustomers,
    getCustomerDetails,
    updateCustomer,
    deleteCustomer
};
