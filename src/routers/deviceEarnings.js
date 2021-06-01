const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const Order = require("../models/orders");
const DeviceEarnings = require('../models/deviceEarnings');

//get device redeems
router.post("/deviceEarnigs", async(req,res) => {
    try {
        var _orderId = req.body.orderId;
        var _currentTime = req.body.currentTime;
        var _currentDate = req.body.currentDate;
        var _currentMonth = req.body.currentMonth;
        var _currentYear = req.body.currentYear;

        const orderDetails = await Order.findById(_orderId);
        if (!orderDetails) {
            return res.status(400).json({message: "Product not found..!"});
        } else {

            var hourlyRate = orderDetails.orderDetails.hourlyPrice;

            const _lastClaimTime = orderDetails.lastClaimTime;
            const _lastClaimDate = orderDetails.lastClaimDate;
            const _lastClaimMonth = orderDetails.lastClaimMonth;

            var remainingClaim;
            if (_lastClaimMonth == _currentMonth) {
                if (_lastClaimDate == _currentDate) {
                    remainingClaim = (_currentTime - _lastClaimTime) * hourlyRate;
                    console.log(`Today` + remainingClaim);
                } else {
                    remainingClaim = (((_currentDate - _lastClaimDate) * 24) + (_currentTime - _lastClaimTime)) * hourlyRate;
                    console.log(remainingClaim);
                    console.log(`Not Today` + remainingClaim);
                }
            } else {
                var days = (31 - _lastClaimDate + 1) * 24
                var time = _currentTime - _lastClaimTime;
                remainingClaim = (days + time) * hourlyRate;
                console.log(`days ` + days);
                console.log(`time ` + time);
                console.log(`Not Currrent Month ` + remainingClaim);
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
        var _currentTime = req.body.currentTime;
        var _currentDate = req.body.currentDate;
        var _currentMonth = req.body.currentMonth;
        var _currentYear = req.body.currentYear;
        
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

            var remainingClaim;

            if (lastClaimMonth == _currentMonth) {
                if (lastClaimDate == _currentDate) {
                    remainingClaim = (_currentTime - lastClaimTime) * hourlyRate;
                } else {
                    remainingClaim = (((_currentDate - lastClaimDate) * 24) + (_currentTime - lastClaimTime)) * hourlyRate;
                }
            } else {
                remainingClaim = (((30 - lastClaimDate + _currentDate - 1) * 24) + (_currentTime - lastClaimTime)) * hourlyRate;
            }
            
            console.log(remainingClaim);

            var totalClaimAmt = orderDetails.totalClaimAmt + remainingClaim;

            var addWalletAmt = userDetails.wallet + remainingClaim;
            var addDeviceAmt = userDetails.device_earnings + remainingClaim;

            const updateUser = await User.findByIdAndUpdate(_userId, {"wallet" : addWalletAmt, "device_earnings" : addDeviceAmt}, {new:true});

            const updateOrder = await Order.findByIdAndUpdate(_orderId, 
                {
                    "lastClaimTime" : _currentTime,
                    "lastClaimDate" : _currentDate,
                    "lastClaimMonth" : _currentMonth,
                    "lastClaimYear" : _currentYear,
                    "totalClaimAmt" : totalClaimAmt,
                }, {new:true});

            return res.status(200).json({message: "Reedem Successfully."});
            
        }

    } catch (e) {
        return res.status(500).json({message: "Internal Server Error"});
    }
});


module.exports = router;