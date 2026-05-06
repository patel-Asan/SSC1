import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  couponCode: { type: String, default: null },
  address: { type: Object, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending' 
  },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false },
  trackingNumber: { type: String },
  notes: { type: String },
  date: { type: Number, required: true }
}, {
  timestamps: true
});

const orderModel = mongoose.models.order || mongoose.model('order', orderSchema);

export default orderModel;
