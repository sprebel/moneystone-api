const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    phone : { type : String, unique : true },
    password : { type : String },
    name : { type : String },
    device_earnings : { type : String },  
    team_earnings : { type : String },
    wallet : { type : mongoose.Schema.Types.Number },
    status : { type : String }
})

const User = new mongoose.model('User', userSchema);

module.exports = User;