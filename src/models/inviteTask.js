const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = require("./user");

const inviteTaskSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types, ref: userSchema},
    userName: {type: mongoose.Schema.Types, ref: userSchema},
    userPhone: {type: mongoose.Schema.Types, ref: userSchema},
})

const InviteTask = new mongoose.model('InviteTask', inviteTaskSchema);

module.exports = InviteTask;