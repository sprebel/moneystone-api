const express = require("express");
const router = new express.Router();
const User = require("../models/user")
const Order = require("../models/orders");
const DeviceEarnings = require('../models/deviceEarnings');

//get orders and claim
router.post("/deviceEarnigs", async(req,res) => {
    try {
        var _orderId = req.body.orderId
        const orderDetails = await Order.findById(_orderId);
        if (!orderDetails) {
            return res.status(400).json({message: "Product not found..!"});
        } else {

            const hourlyRate = orderDetails.hourlyRate;

            const lastClaim = 10;

            var date = new Date();
            var d = date.getHours(); 
            //const currentTime = new Date;
            console.log(d);
            

            const deviceEarnigs = new DeviceEarnings({
                lastClaim: 0,
                RemainingClaim: 0,
                orderDetails: orderDetails
            });
            res.send(deviceEarnigs);
        }
    } catch (e) {
        res.status(500).json({message: "Internal Server Error"});
    }
});

module.exports = router;