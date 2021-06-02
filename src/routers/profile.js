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
            return res.send(userDetails);
        }
    } catch (e) {
        return res.status(500).send(e);
    }
})

//update name
router.patch("/profile/:id", async(req,res) => {
    try {
        const _id = req.params.id;
        const updateUser = await User.findByIdAndUpdate(_id, req.body, {new:true});
        return res.send(updateUser);
    } catch (e) {
        return res.status(500).send(e);
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
                return res.status(200).send(createBankDetails);
            } else {
                return res.status(400).json({message: "Bank Details Alread add."});
            }
            
        }
        
    } catch (e) {
        return res.status(500).json({message: "Internal Server Error"});
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
                return res.status(200).json({bankDetailsAdd: false});
            } else {
                return res.status(200).json({bankDetailsAdd: true, bankDetails: bankDetails})
            }
        }
    } catch (e) {
        return res.status(500).json({message: "Internal Server Error", error: e});
    }
})

//update bank details
router.post("/updateBankDetails", async(req,res) => {
    try {
        var _userId = req.body.userId
        const userDetails = await User.findById(_userId);

        if (!userDetails) {
            return res.status(400).json({message: "Invalid user id..!"});
        } else {
            const bankDetails = await Bank.findOne({'userId': _userId});
            var bankDetailsId = bankDetails._id;
            
            var bank = {
                accountName: req.body.accountName,
                mobile: req.body.mobile,
                email: req.body.email,
                bankAccount:req.body.bankAccount,
                bankName: req.body.bankName,
                upiId: req.body.upiId,
                ifsc: req.body.ifsc,
                userId: userDetails._id
            };
            const updateBankDetails = await Bank.findByIdAndUpdate(bankDetailsId, bank, {new:true});
            return res.status(200).send(updateBankDetails);
            
        }
        
    } catch (e) {
        return res.status(500).json({message: "Internal Server Error"});
    }
})


//invited users
router.post("/invitesUser", async(req,res) => {
    try {
        var _invitationCode = req.body.invitationCode
        const userDetails = await User.find({"refUser" : _invitationCode});
        return res.send(userDetails);

    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
})


//claim invite income
router.post("/claimInviteStage", async(req,res) => {
    try {

        var _invitationCode = req.body.invitationCode
        var _inviteStage = req.body.inviteStage
        const userDetails = await User.find({"refUser" : _invitationCode, "invite_stage": _inviteStage});
        return res.send(userDetails);
        
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
})

module.exports = router;