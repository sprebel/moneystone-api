const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const Recharge = require("../models/recharge");

router.post("/recharge", async(req,res) => {
    try {
        var _userId = req.body.userId
        const userDetails = await User.findById(_userId);
        if (!userDetails) {
            return res.status(400).json({message: "Invalid user id..!"});
        } else {
            
        }
    } catch (e) {
        res.status(500).json({message: "Internal Server Error"});
    }
});

module.exports = router;