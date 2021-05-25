const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = require("./user");

const inviteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types, ref: userSchema },
    refUser: { type: mongoose.Schema.Types, ref: userSchema },
    refUserPurchase: { type: Number },
    stage: { type: Number },
    compeleted: { type: Boolean },
    redeem: { type: Number },
})

const Invite = new mongoose.model('Invite', inviteSchema);

module.exports = Invite;