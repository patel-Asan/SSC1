import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    address: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zipcode: { type: String, default: "" },
        country: { type: String, default: "" }
    },
    addresses: [{
        label: { type: String, default: "Home" },
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zipcode: { type: String, default: "" },
        country: { type: String, default: "" },
        phone: { type: String, default: "" },
        isDefault: { type: Boolean, default: false }
    }],
    cartData: { type: Object, default: {} },
    status: { 
        type: String, 
        enum: ['active', 'suspended', 'banned'], 
        default: 'active' 
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'], 
        default: 'user' 
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    recentlyViewed: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'product' },
        viewedAt: { type: Date, default: Date.now }
    }]
}, { 
    minimize: false,
    timestamps: true 
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;