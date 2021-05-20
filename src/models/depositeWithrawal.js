const mongoose = require("mongoose");
const validator = require("validator");
const depositeSchema = require("./deposite");

const depositeWithrawalSchema = new mongoose.Schema({
    withrawalamount: {type: Number},
    withrawalDate: {type: Number},
    depositeDetails : { type: mongoose.Schema.Types, ref: depositeSchema }
})

const DepositeWithrawal = new mongoose.model('DepositeWithrawal', depositeWithrawalSchema);

module.exports = DepositeWithrawal;