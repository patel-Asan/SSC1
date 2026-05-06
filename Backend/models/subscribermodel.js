import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  couponCode: { type: String, unique: true },
  status: { 
    type: String, 
    enum: ['active', 'unsubscribed'],
    default: 'active' 
  },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: { type: Date, default: null }
}, {
  timestamps: true
});

const subscriberModel = mongoose.models.subscriber || mongoose.model('subscriber', subscriberSchema);

export default subscriberModel;
