const express = require("express");
const Bank = require("../models/bank");
const router = new express.Router();
const User = require("../models/user");


//get profile
router.get("/profile/:id", async(req,res) => {
    try {
        const _id = req.params.id;
        const userDetails = await User.findById(_id);
        if (!userDetails) {
            return res.status(400).json({error: "Invalid userid"});
        } else {
            res.send(userDetails);
        }
    } catch (e) {
        res.status(500).send(e);
    }
})

//update name
router.patch("/profile/:id", async(req,res) => {
    try {
        const _id = req.params.id;
        const updateUser = await User.findByIdAndUpdate(_id, req.body, {new:true});
        res.send(updateUser);
    } catch (e) {
        res.status(500).send(e);
    }
})

//add Bank Details
router.post("/bankDetails", async(req,res) => {
    try {
        var _userId = req.body.userId
        const userDetails = await User.findById(_userId);

        if (!userDetails) {
            return res.status(400).json({message: "Invalid user id..!"});
        } else {
            const bankDetails = await Bank.findOne({'userId': _userId});
            
            if (!bankDetails) {
                const bank = new Bank({
                    accountName: req.body.accountName,
                    mobile: req.body.mobile,
                    email: req.body.email,
                    bankAccount:req.body.bankAccount,
                    bankName: req.body.bankName,
                    upiId: req.body.upiId,
                    ifsc: req.body.ifsc,
                    userId: userDetails._id
                });
                const createBankDetails = await bank.save();
                res.status(200).send(createBankDetails);
            } else {
                res.status(400).json({message: "Bank Details Alread add."});
            }
            
        }
        
    } catch (e) {
        res.status(500).json({message: "Internal Server Error"});
    }
})

//user bank Details
router.post("/userBankDetails", async(req,res) => {
    try {
        var _userId = req.body.userId
        const userDetails = await User.findById(_userId);

        if (!userDetails) {
            return res.status(400).json({message: "Invalid user id..!"});
        } else {
            const bankDetails = await Bank.findOne({'userId': _userId});
            if (!bankDetails) {
                res.status(200).json({bankDetailsAdd: false});
            } else {
                res.status(200).json({bankDetailsAdd: true, bankDetails: bankDetails})
            }
        }
    } catch (e) {
        res.status(500).json({message: "Internal Server Error", error: e});
    }
})

module.exports = router;