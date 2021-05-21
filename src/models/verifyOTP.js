const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = require("./user");

const verifyOTPSchema = new mongoose.Schema({
    otp: { type : String },
    userId: { type: mongoose.Schema.Types, ref: userSchema },
    email: { type: mongoose.Schema.Types, ref: userSchema }
})

const VerifyOTP = new mongoose.model('VerifyOTP', verifyOTPSchema);

module.exports = VerifyOTP;