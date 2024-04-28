import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, 'please provide a name']},
    email: { type: String, required: [true, 'email already exist'], unique: true},
    password: { type: String, required: [true, 'please provide a password']},
    isVerified: { type: Boolean, default: false},
    isAdmin: { type: Boolean, default: false},
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyOTP: String,
    verifyOTPExpiry: Date
})

const User = mongoose.models.users || mongoose.model("users", userSchema)

export default User
