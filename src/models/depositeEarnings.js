const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = require("./user");

const depositeEarningsSchema = new mongoose.Schema({
    financeEarning: {type: Number},
    totalDeposite: {type: Number},
    userId: {type: mongoose.Schema.Types, ref: userSchema},
    userName: {type: mongoose.Schema.Types, ref: userSchema},
    userPhone: {type: mongoose.Schema.Types, ref: userSchema},
})

const DepositeEarnings = new mongoose.model('DepositeEarnings', depositeEarningsSchema);

module.exports = DepositeEarnings;