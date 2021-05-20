const mongoose = require("mongoose");
const validator = require("validator");
const depositeSchema = require("./deposite");

const depositeWithrawalSchema = new mongoose.Schema({

})

const DepositeWithrawal = new mongoose.model('Deposite', depositeSchema);

module.exports = DepositeWithrawal;