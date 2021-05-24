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

            const _lastClaimTime = orderDetails.lastClaimTime;
            const _lastClaimDate = orderDetails.lastClaimDate;
            const _lastClaimMonth = orderDetails.lastClaimMonth;

            var date = new Date();
            var currentHour = date.getHours();
            var currentDate = date.getDate();
            var currentMonth = date.getMonth() + 1;
            var currentYear = date.getFullYear();

            console.log(currentHour);
            console.log(currentHour);

            var remainingClaim;

            if (currentMonth == _lastClaimMonth) {
                if (_lastClaimDate == currentDate) {
                    remainingClaim = (currentHour - _lastClaimTime) * hourlyRate;
                    console.log(`Today` + remainingClaim);
                } else {
                    remainingClaim = (((currentDate - _lastClaimDate) * 24) + (currentHour - _lastClaimTime)) * hourlyRate;
                    console.log(remainingClaim);
                    console.log(`Not Today` + remainingClaim);
                }
            } else {
                remainingClaim = (((30 - _lastClaimDate + _lastClaimDate - 1) * 24) + (currentHour - _lastClaimDate)) * hourlyRate;
                console.log(`Not Currrent Month` + remainingClaim);
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
            const lastClaimMonth = orderDetails.lastClaimMonth;

            var date = new Date();
            var currentHour = date.getHours();
            var currentDate = date.getDate();
            var currentMonth = date.getMonth() + 1;
            var currentYear = date.getFullYear();

            var remainingClaim;

            if (lastClaimMonth == currentMonth) {
                if (lastClaimDate == currentDate) {
                    remainingClaim = (currentHour - lastClaimTime) * hourlyRate;
                } else {
                    remainingClaim = (((currentDate - lastClaimDate) * 24) + (currentHour - lastClaimTime)) * hourlyRate;
                }
            } else {
                remainingClaim = (((30 - lastClaimDate + currentDate - 1) * 24) + (currentHour - lastClaimTime)) * hourlyRate;
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
                    "lastClaimMonth" : currentMonth,
                    "lastClaimYear" : currentYear,
                    "totalClaimAmt" : totalClaimAmt,
                }, {new:true});

            return res.status(200).json({message: "Reedem Successfully."});
            
        }

    } catch (e) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});


module.exports = router;