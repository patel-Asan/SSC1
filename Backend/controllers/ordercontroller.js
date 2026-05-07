import orderModel from "../models/orderModel.js"
import userModel from "../models/usermodel.js"
import { notifyNewOrder, notifyOrderCancelled, notifyOrderDelivered } from "./notificationcontroller.js"
import { incrementCouponUsage } from "./couponcontroller.js"
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from "./emailcontroller.js"


// Placing orders using COD Method
const placeOrder = async (req,res) => {

    try{
        const { items, amount, address, coupon } = req.body;
        const userId = req.user._id; // Get userId from auth middleware (req.user)

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found"
            });
        }

        const orderData= {
            userId,
            items,
            amount,
            totalAmount: amount,
            address,
            paymentMethod:"COD",
            payment:false,
            date : Date.now()
        }

        if (coupon) {
            orderData.couponCode = coupon;
            await incrementCouponUsage(coupon);
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        // Create notification for new order
        await notifyNewOrder({
            orderId: newOrder._id,
            userId: userId,
            amount: amount
        });

        // Send order confirmation email
        try {
            const user = await userModel.findById(userId);
            if (user?.email) {
                await sendOrderConfirmationEmail(user.email, {
                    orderId: newOrder._id,
                    amount: amount,
                    items: items,
                    paymentMethod: 'COD',
                    status: 'Processing'
                });
            }
        } catch (emailErr) {
            console.error("Failed to send order confirmation email:", emailErr);
        }

        await userModel.findByIdAndUpdate(userId,{cartData:{}})

        res.json({success:true,message:" Order Placed"})

    } catch (error){
        console.log(error)
        res.json({success:false,message:error.message})

    }
}
// Placing orders using Stripe Method
const placeOrderStripe = async (req,res) => {
}
// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req,res) => {
}

// All Orders data for Admin Panel
const allOrders = async (req,res) => {
 try{
    const orders = await orderModel.find({})
    res.json({success:true,orders})
 }catch (error){
 console.log(error)
 res.json({success:false,message:error.message}) 
 }
}

const  userOrders = async (req,res) => {
    try{
        const userId = req.user._id; // Get userId from auth middleware (req.user)

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID not found"
            });
        }

        const orders= await orderModel.find({ userId})
        res.json({success:true,orders})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message}) 
    }

}


const updateStatus = async (req,res) => {
    try {
        const { orderId, status } = req.body;
        
        if (!orderId || !status) {
            return res.status(400).json({
                success: false,
                message: "Order ID and status are required"
            });
        }

        const updatedOrder = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Send order status email
        try {
            const user = await userModel.findById(updatedOrder.userId);
            if (user?.email) {
                await sendOrderStatusEmail(user.email, {
                    orderId: updatedOrder._id,
                    status: status,
                    amount: updatedOrder.amount
                });
            }
        } catch (emailErr) {
            console.error("Failed to send order status email:", emailErr);
        }

        if (status === 'Cancelled') {
            await notifyOrderCancelled({
                orderId: updatedOrder._id,
                userId: updatedOrder.userId,
                amount: updatedOrder.amount
            });
        } else if (status === 'Delivered') {
            await notifyOrderDelivered({
                orderId: updatedOrder._id,
                userId: updatedOrder.userId,
                amount: updatedOrder.amount
            });
        }

        res.json({
            success: true,
            message: "Order status updated successfully",
            order: updatedOrder
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const trackOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        const order = await orderModel.findOne({ _id: orderId, userId });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const statusTimeline = [
            { status: 'Order Placed', date: order.date, completed: true },
            { status: 'Processing', date: order.date, completed: ['Processing', 'Shipped', 'Delivered'].includes(order.status) },
            { status: 'Shipped', date: order.shippedDate || order.date, completed: ['Shipped', 'Delivered'].includes(order.status) },
            { status: 'Delivered', date: order.deliveredDate || null, completed: order.status === 'Delivered' },
        ];

        const estimatedDelivery = new Date(order.date);
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

        res.json({
            success: true,
            order: {
                id: order._id,
                status: order.status,
                items: order.items,
                amount: order.amount,
                address: order.address,
                paymentMethod: order.paymentMethod,
                date: order.date,
                estimatedDelivery,
            },
            timeline: statusTimeline
        });
    } catch (error) {
        console.error("Track order error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getOrderByTrackingId = async (req, res) => {
    try {
        const { trackingId } = req.params;
        const order = await orderModel.findById(trackingId);
        
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const statusTimeline = [
            { status: 'Order Placed', date: order.date, completed: true },
            { status: 'Processing', date: order.date, completed: ['Processing', 'Shipped', 'Delivered'].includes(order.status) },
            { status: 'Shipped', date: order.shippedDate || order.date, completed: ['Shipped', 'Delivered'].includes(order.status) },
            { status: 'Delivered', date: order.deliveredDate || null, completed: order.status === 'Delivered' },
        ];

        const estimatedDelivery = new Date(order.date);
        estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

        res.json({
            success: true,
            order: {
                id: order._id,
                status: order.status,
                amount: order.amount,
                paymentMethod: order.paymentMethod,
                date: order.date,
                estimatedDelivery,
            },
            timeline: statusTimeline
        });
    } catch (error) {
        console.error("Get order by tracking ID error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


export{placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus, trackOrder, getOrderByTrackingId}