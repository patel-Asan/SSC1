import orderModel from "../models/orderModel.js"
import userModel from "../models/usermodel.js"


// Placing orders using COD Method
const placeOrder = async (req,res) => {

    try{
        const { items, amount, address} = req.body;
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
            totalAmount: amount, // Add totalAmount field
            address,
            paymentMethod:"COD",
            payment:false,
            date : Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

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


export{placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus}