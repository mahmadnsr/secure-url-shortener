import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [2, "Name must be at least 2 characters"],
        maxlength: [50, "Name cannot exceed 50 characters"],
        match: [/^[A-Za-z\s]+$/, "Name can only contain alphabets and spaces"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"]
    },
    password: {
        type: String,
        required: true,
        select: false
    }
}, { timestamps: true });

const user_Model = mongoose.model("user", userSchema);

export { user_Model };
