const mongoose = require("mongoose");
const validator = require("validator");
const productSchema = require("./product");
const userSchema = require("./user");

const orderSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types, ref: userSchema},
    userName: {type: mongoose.Schema.Types, ref: userSchema},
    userPhone: {type: mongoose.Schema.Types, ref: userSchema},
    orderDateTime: { type: String },
    orderDetails: {type: mongoose.Schema.Types, ref: productSchema}
})

const Order = new mongoose.model('Order', orderSchema);

module.exports = Order;