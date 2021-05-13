const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = require("./user");

const bankSchema = new mongoose.Schema({
    accountName: { type : String },
    mobile: { type : String },
    email: { type : String },
    bankAccount:{ type : String },
    bankName: { type : String },
    upiId: { type : String },
    ifsc: { type : String },
    userId: { type : String },
})

const Bank = new mongoose.model('Bank', bankSchema);

module.exports = Bank;