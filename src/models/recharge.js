const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = require("./user");


const rechargeSchema = new mongoose.Schema({
    amount : { type : mongoose.Schema.Types.Number },
    transactionDate : { type : String },
    userDetails: {type: mongoose.Schema.Types, ref: userSchema}
})

const Recharge = new mongoose.model('Recharge', rechargeSchema);

module.exports = Recharge;