const mongoose = require("mongoose");
const validator = require("validator");
const orderSchema = require("./product");

const deviceEarningsSchema = new mongoose.Schema({
    orderDetails: {type: mongoose.Schema.Types, ref: orderSchema},
    lastClaim: {type: Number},
    RemainingClaim: {type: Number},
});

const DeviceEarningsSchema = new mongoose.model('DeviceEarnings', deviceEarningsSchema);

module.exports = DeviceEarningsSchema;