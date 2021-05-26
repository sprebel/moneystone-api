const express = require("express");
const router = new express.Router();
const Order = require("../models/orders");
const Product = require("../models/product");
const User = require("../models/user")

//create new order
router.post("/order", async(req,res) => {
    try {
        var _productId = req.body.productId
        var _userId = req.body.userId
        const productDetails = await Product.findById(_productId);
        const userDetails = await User.findById(_userId);
        if (!productDetails) {
            return res.status(400).json({message: "Product not available..!"});
        } else if (!userDetails) {
            return res.status(400).json({message: "Invalid user id..!"});
        } else if (userDetails.wallet < productDetails.price) {
            return res.status(400).json({message: "You have insufficient wallet balance"});
        } else {

            var minusWalletAmt = userDetails.wallet - productDetails.price;
            var addPurchase = userDetails.total_purchase + productDetails.price;
            
            const updateUser = await User.findByIdAndUpdate(_userId, {"wallet" : minusWalletAmt, "total_purchase" : addPurchase}, {new:true});

            const orderDate = req.body.orderDay + '-' +  req.body.orderMonth + '-' + req.body.orderYear;
            const expiryDate = req.body.orderYear + 1;
            const orderTimeHour = req.body.orderTimeHour;
            const orderTimeMinitues = req.body.orderTimeMinitues;

            const order = new Order({
                userId: userDetails._id,
                userName: userDetails.name,
                userPhone: userDetails.phone,
                orderDetails: productDetails,
                orderDateTime: orderDate + ' ' + orderTimeHour + ':' + orderTimeMinitues,
                orderExpireDateTime: req.body.orderDay + '-' +  req.body.orderMonth + '-' + expiryDate + ' '  + orderTimeHour + ':' + orderTimeMinitues,
                lastClaimTime: req.body.orderTimeHour,
                lastClaimDate: req.body.orderDay,
                lastClaimMonth: req.body.orderMonth,
                lastClaimYear: req.body.orderYear,
                totalClaimAmt: 0,
            });
            const createOrder = await order.save();
            res.status(200).send(createOrder);
        }
    } catch (e) {
        res.status(500).json({message: "Internal Server Error"});
    }
});


//get all orders
router.get("/order", async(req,res) => {
    try {
        const userOrder = await Order.find().sort({$natural: - 1}).limit(1);
        res.send(userOrder);
    } catch (e) {
        res.status(500).json({message: "Internal Server Error"});
    }
})

//get order details
router.get("/order/:id", async(req,res) => {
    try {
        const _id = req.params.id;
        const userOrder = await Order.findById(_id);
        if (!userOrder) {
            return res.status(400).send();
        } else {
            const houlyRate = userOrder.houlyRate;
            
            res.status(200).json({
                claimReward: houlyRate, 
                orderDetails: userOrder
            });
        }
    } catch (e) {
        res.status(500).json({message: "Internal Server Error"});
    }
})


//delete order
router.delete("/order/:id", async(req,res) => {
    try {
        const _id = req.params.id;
        const deleteOrder= await Order.findByIdAndDelete(_id);
        if (!_id) {
            res.status(400).json({message: "Order not fond..!"});
        }
        res.send(deleteOrder);
    } catch (e) {
        res.status(500).json({message: "Internal Server Error"});
    }
})


//orders find by userid
router.post("/userOrders", async(req,res) => {
    try {
        var _userId = req.body.userId
        const userDetails = await User.findById(_userId);
        if (!userDetails) {
            return res.status(400).json({message: "Invalid user id..!"});
        } else {
            const userOrder = await Order.find({'userId' : userDetails._id});
            console.log(userOrder);
            if (!userOrder) {
                res.status(400).json({error: "No Purchase order..!"});
            } else {
                res.send(userOrder);
            }   
        }
        
    } catch (e) {
        res.status(500).json({message: "Internal Server Error"});
    }
})

//User orders total all products Redeems
router.post("/userTotalDeviceRedeem", async(req,res) => {
    try {
        var _userId = req.body.userId
        const userDetails = await User.findById(_userId);
        if (!userDetails) {
            return res.status(400).json({message: "Invalid user id..!"});
        } else {
            const userOrder = await Order.find({'userId' : userDetails._id});
            if (!userOrder) {
                res.status(400).json({error: "No Purchase order..!"});
            } else {
                var totalClaimAmt = 0;
                for (let i = 0; i < userOrder.length; i++) {
                    const claimAmt = userOrder[i].totalClaimAmt;
                    totalClaimAmt += parseInt(claimAmt);
                    console.log(totalClaimAmt);
                }
                res.status(200).json({
                    "message": "Device Total Redeems",
                    "total": totalClaimAmt,
                });
            }   
        }
        
    } catch (e) {
        res.status(500).json({message: "Internal Server Error"});
    }
})


module.exports = router;