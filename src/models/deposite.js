    const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = require("./user");

const depositeSchema = new mongoose.Schema({
    days: {type: Number},
    percentage: {type: Number},
    depositeUnit: {type: Number},
    depositeAmt: {type: Number},
    transactionDate : { type: Number },
    transactionMonth : { type: Number },
    transactionYear : { type: Number },
    depositeIncome : { type: Number },
    userId: {type: mongoose.Schema.Types, ref: userSchema},
    userName: {type: mongoose.Schema.Types, ref: userSchema},
    userPhone: {type: mongoose.Schema.Types, ref: userSchema},
},{
    timestamps: true
})

const Deposite = new mongoose.model('Deposite', depositeSchema);

module.exports = Deposite;