const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const Bank = require("../models/bank");
const Withrawal = require("../models/withrawal");
const Deposite = require("../models/deposite");
const DepositeWithrawal = require("../models/depositeWithrawal");

//add withrawal
router.post("/withrawal", async(req,res) => {
    console.log(req.body);
    try {
        var _userId = req.body.userId
        var _amount = req.body.amount
       
        const userDetails = await User.findById(_userId);

        if (!userDetails) {
            return res.status(400).json({message: "Invalid user id..!"});
        } else if (userDetails.wallet < _amount) {
            return res.status(400).json({message: "You have insufficient wallet balance"});
        } else {
            var date = new Date();
            var currentTime = date.toISOString();

            var minusWalletAmt = userDetails.wallet - _amount;

            const updateUser = await User.findByIdAndUpdate(_userId, {"wallet" : minusWalletAmt}, {new:true});

            const bankDetails = await Bank.findOne({'userId': _userId});
            const withdrawals = new Withrawal({
                amount : _amount,
                status : "Pending",
                userId : _userId,
                userDetails : userDetails,
                bankDetails : bankDetails,
                requestTime : currentTime
            });

            const sendWithrawalReq = await withdrawals.save();
            res.status(200).json({message : "Withrawal Request Sent.", withrawalDetails: sendWithrawalReq});
        }


    } catch (e) {
        res.status(500).json({message: "Internal Server Error"});
    }
});

//get all withdrawals
router.get("/withrawal", async(req,res) => {
    try {
        const withrawalData = await Withrawal.find();
        res.send(withrawalData);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post("/userWithrawal", async(req,res) => {
    try {
        var _userId = req.body.userId
        const userDetails = await User.findById(_userId);

        if (!userDetails) {
            return res.status(400).json({message: "Invalid user id..!"});
        } else {
            const userWithrawal = await Withrawal.find({'userId' : _userId});
            if (!userWithrawal) {
                res.status(400).json({error: "No Withrawal..!"});
            } else {
                res.status(200).send(userWithrawal);
            }
        }
        const withrawalData = await Withrawal.find();
        res.send(withrawalData);
    } catch (e) {
        //res.status(500).json({message: "Internal Server Error"});
    }
});

//update withradwal
router.patch("/withrawal/:id", async(req,res) => {
    try {
        const _id = req.params.id;
        const updateWithrawal = await Withrawal.findByIdAndUpdate(_id, req.body, {new:true});
        res.send(updateWithrawal);
    } catch (e) {
        res.status(500).send(e);
    }
})

//deposite withrawal
router.post("/depositWithrawals", async(req,res) => {
    try {
        var _userId = req.body.userId
        var _depositId = req.body.depositId
        var _amount = req.body.amount
        const depositeDetails = await Deposite.findById(_depositId);
        
        
        if (!depositeDetails) {
            return res.status(400).json({message: "Invalid deposit id..!"});
        } else { 

            const userDetails = await User.findById(_userId);

            var date = new Date();
            var currentTime = date.toISOString();

            var addWalletAmt = userDetails.wallet + _amount;
            const updateUser = await User.findByIdAndUpdate(_userId, {"wallet" : addWalletAmt}, {new:true});
            const deleteDeposite = await Deposite.findByIdAndDelete(_depositId);

            const depositeWithrawal = new DepositeWithrawal({
                amount: _amount,
                transactionDate: currentTime,
                depositeDetails: depositeDetails,
            });

            const addWithrawal = await depositeWithrawal.save();
            return res.status(200).json({message : "Withrawal Succefully to wallet.", "withrawalDetails": addWithrawal});
        }

    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
})


module.exports = router;

