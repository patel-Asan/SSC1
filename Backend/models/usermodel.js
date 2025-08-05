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
    }
}, { 
    minimize: false,
    timestamps: true 
});

const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;