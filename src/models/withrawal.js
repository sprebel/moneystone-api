const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = require("./user");
const bankSchema = require("./bank");

const withdrawalSchema = new mongoose.Schema({
    amount: {type: Number},
    status: {type: String},
    userId: {type: mongoose.Schema.Types, ref: userSchema},
    userDetails: {type: mongoose.Schema.Types, ref: userSchema},
    bankDetails: {type: mongoose.Schema.Types, ref: bankSchema},
    requestTime: {type: mongoose.Schema.Types, ref: bankSchema},
    requestDate: {type: String},
})

const Withrawal = new mongoose.model('Withrawal', withdrawalSchema);

module.exports = Withrawal;