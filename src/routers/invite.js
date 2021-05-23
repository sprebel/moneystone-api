const express = require("express");
const router = new express.Router();
const Invite = require("../models/invite");
const User = require("../models/user");

//all invite list
router.get("/allInvite", async(req,res) => {
    try {
        const inviteData = await Invite.find();
        res.send(inviteData);
    } catch (e) {
        res.status(500).send(e);
    }
})

//get invite by user
router.get("/userInvite", async(req,res) => {
    try {
        var _userId = req.body.userId
        const userDetails = await User.findById(_userId);
        if (!userDetails) {
            return res.status(400).json({message: "Invalid user id..!"});
        } else {
            const userInvites = await Invite.find({'userId' : userDetails._id});
            if (!userInvites) {
                return res.status(400).json({message: "No Invite Friends..!"});
            } else {
                return res.send(userInvites);
            }
        }
    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
})

//redeem Invite
router.post("/inviteRedeem", async(req,res) => {
    try {
        var _userId = req.body.userId
        var _inviteId = req.body.inviteId
        const userDetails = await User.findById(_userId);
        const userInvites = await Invite.findById(_inviteId);
        const refUserDetails = await User.findById(userInvites.refUser._id);

        if (!userDetails) {
            return res.status(400).json({message: "Invalid user id..!"});
        } else if (!userInvites) {
            return res.status(400).json({message: "Invalid invite id..!"});
        } else if (userInvites.compeleted == true) {
            return res.status(400).json({message: "Faild, You already redeem..!"});
        } else if (refUserDetails.total_purchase == 0) {
            return res.status(400).json({message: "Faild Redeem, Friend not spend..!"});
        } else {
            var addWalletAmount = userDetails.wallet + 100;
            const updateUser = await User.findByIdAndUpdate(_userId, {"wallet" : addWalletAmount}, {new:true});
            const updateInvite = await Invite.findByIdAndUpdate(_inviteId, {"redeem" : 100, "compeleted" : true}, {new:true});
            return res.status(200).json({message: "Invite Friend Redeem Successful."})
        }

        

    } catch (error) {
        return res.status(500).json({message: "Internal Server Error"});
    }
})

//delete user
router.delete("/invite/:id", async(req,res) => {
    try {
        const _id = req.params.id;
        const deleteInvite = await Invite.findByIdAndDelete(_id);
        if (!_id) {
            res.status(404).send(e);
        }
        res.send(deleteInvite);
    } catch (e) {
        res.status(500).send(e);
    }
})


module.exports = router;