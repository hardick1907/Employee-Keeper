import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true},
    password: { type: String, required: true },
    username: { type: String, required: true, unique:true},
    email: { type: String, required: true },
    bio: { type: String, required: true },
    city: { type: String, required: true },
});

export const AdminModel = mongoose.model('Admin', adminSchema);