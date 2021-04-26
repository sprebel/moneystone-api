const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    phone : {
        type : String,
        unique : true,
    },
    password : {
        type : String,
    },
    name : {
        type : String,
    },
    device_earnings : {
        amt : {type : String}
    },  
    team_earnings : {
        amt : {type : String}
    },
    wallet : {
        amt : {type : String}
    },

})

const User = new mongoose.model('User', userSchema);

module.exports = User;