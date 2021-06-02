const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const Recharge = require("../models/recharge");

router.post("/recharge", async(req,res) => {
    try {
        var _userId = req.body.userId
        var _amount = req.body.amount
        const userDetails = await User.findById(_userId);
        if (!userDetails) {
            return res.status(400).json({message: "Invalid user id..!"});
        } else {
            var date = new Date();
            var currentTime = date.toISOString();

            var rechargeAmt = _amount;
            var addAmtWallet = userDetails.wallet + rechargeAmt;
            
            const updateUserWallet = await User.findByIdAndUpdate(_userId, {"wallet" : addAmtWallet}, {new:true});
            const updatedUser = await User.findById(_userId);

            const rechargeDetails = new Recharge({
                amount: rechargeAmt,
                transactionDate: currentTime,
                userDetails: updatedUser
            })

            const createRecharge = await rechargeDetails.save();
            return res.status(200).json({message : "Recharge Succefully.", userDetails: createRecharge});
        }
    } catch (e) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});

module.exports = router;