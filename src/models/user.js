const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    phone : { type : String, unique : true },
    email : { type : String, unique : true },
    password : { type : String },
    name : { type : String },
    invitationCode : { type : String },
    device_earnings : { type : mongoose.Schema.Types.Number },  
    team_earnings : { type : mongoose.Schema.Types.Number },
    wallet : { type : mongoose.Schema.Types.Number },
    status : { type : String },
    finance_earnings : { type : mongoose.Schema.Types.Number },
    total_deposite : { type : mongoose.Schema.Types.Number },
    total_purchase : { type : mongoose.Schema.Types.Number },
    refUser : { type : String },
    invite_income : { type : mongoose.Schema.Types.Number },
    invite_members : { type: Number },
    invite_stage : { type: Number },
})

const User = new mongoose.model('User', userSchema);

module.exports = User;