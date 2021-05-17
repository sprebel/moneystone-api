const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const Order = require("../models/orders");
const DeviceEarnings = require('../models/deviceEarnings');

//get device redeems
router.post("/deviceEarnigs", async(req,res) => {
    try {
        var _orderId = req.body.orderId;
        const orderDetails = await Order.findById(_orderId);
        if (!orderDetails) {
            return res.status(400).json({message: "Product not found..!"});
        } else {

            var hourlyRate = orderDetails.orderDetails.hourlyPrice;

            const lastClaimTime = orderDetails.lastClaimTime;
            const lastClaimDate = orderDetails.lastClaimDate;

            var date = new Date();
            var currentHour = date.getHours();
            var currentDate = date.getDate();

            console.log(hourlyRate);
            console.log(lastClaimTime);
            console.log(currentDate);
            console.log(currentHour);

            var remainingClaim;

            if (lastClaimDate == currentDate) {
                remainingClaim = (currentHour - lastClaimTime) * hourlyRate;
            } else {
                remainingClaim = (((currentDate - lastClaimDate) * 24) + (currentHour - lastClaimTime)) * hourlyRate;
            }
            console.log(remainingClaim);     

            const deviceEarnigs = new DeviceEarnings({
                RemainingClaim: remainingClaim,
                orderDetails: orderDetails
            });
            res.send(deviceEarnigs);
        }
    } catch (e) {
        res.status(500).json({message: "Internal Server Error"});
    }
});


//Device redeem
router.post("/deviceRedeem", async(req,res) => {
    try {
        var _userId = req.body.userId
        var _orderId = req.body.orderId;
        const orderDetails = await Order.findById(_orderId);
        const userDetails = await User.findById(_userId);
        if (!userDetails) {
            return res.status(400).json({message: "Invalid user id..!"});
        } else if (!orderDetails) {
            return res.status(400).json({message: "Product not found..!"});
        } else {
            
            var hourlyRate = orderDetails.orderDetails.hourlyPrice;

            const lastClaimTime = orderDetails.lastClaimTime;
            const lastClaimDate = orderDetails.lastClaimDate;

            var date = new Date();
            var currentHour = date.getHours();
            var currentDate = date.getDate();

            var remainingClaim;

            if (lastClaimDate == currentDate) {
                remainingClaim = (currentHour - lastClaimTime) * hourlyRate;
            } else {
                remainingClaim = (((currentDate - lastClaimDate) * 24) + (currentHour - lastClaimTime)) * hourlyRate;
            }
            
            console.log(remainingClaim);

            var totalClaimAmt = orderDetails.totalClaimAmt + remainingClaim;

            var addWalletAmt = userDetails.wallet + remainingClaim;
            var addDeviceAmt = userDetails.device_earnings + remainingClaim;

            const updateUser = await User.findByIdAndUpdate(_userId, {"wallet" : addWalletAmt, "device_earnings" : addDeviceAmt}, {new:true});

            const updateOrder = await Order.findByIdAndUpdate(_orderId, 
                {
                    "lastClaimTime" : currentHour,
                    "lastClaimDate" : currentDate,
                    "totalClaimAmt" : totalClaimAmt,
                }, 
                {new:true});

            res.status(200).json({message: "Reedem Successfully."});
            
        }

    } catch (e) {
        res.status(500).json({message: "Internal Server Error"});
    }
});


module.exports = router;