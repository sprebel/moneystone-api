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
// router.post("/userInvite", async(req,res) => {
//     try {
//         var _userId = req.body.userId
//         const userDetails = await User.findById(_userId);
//         if (!userDetails) {
//             return res.status(400).json({message: "Invalid user id..!"});
//         } else {
            
//             const userInvites = await Invite.find({'userId' : userDetails._id});
//             if (!userInvites) {
//                 return res.status(400).json({message: "No Invite Friends..!"});
//             } else {

//                 var invitedUserDetails
//                 for (let i = 0; i < userInvites.length; i++) {
//                     const userid = userInvites[i]['refUser']['_id'];
//                     invitedUserDetails = userid;
//                     console.log(invitedUserDetails);
//                 }

//                 return res.send(userInvites);
//             }
//         }
//     } catch (error) {
//         return res.status(500).json({message: "Internal Server Error"});
//     }
// })


//user invite details
router.post("/userInvite", async(req,res) => {
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

                console.log(userInvites);

                const userInviteListData = [];

                for (let i = 0; i < userInvites.length; i++) {
                    const id = userInvites[i]['_id'];
                    const userid = userInvites[i]['userId'];
                    const refUserid = userInvites[i]['refUser']['_id'];
                    const invitationCode = userInvites[i]['refUser']['invitationCode'];
                    const refbyUser = userInvites[i]['refUser']['refUser'];
                    const stage = userInvites[i]['stage'];
                    const compeleted = userInvites[i]['compeleted'];
                    const redeem = userInvites[i]['redeem'];
                    const findRefUser = await User.findById(refUserid);
                    userInviteListData.push({
                        "_id" : id,
                        "userId" : userid,
                        "refUser": {
                            "_id": refUserid,
                            "name": findRefUser.name,
                            "phone": findRefUser.phone,
                            "email": findRefUser.email,
                            "invitationCode": invitationCode,
                            "refUser": refbyUser,
                            "total_purchase": findRefUser.total_purchase,
                        },
                        "stage": stage,
                        "compeleted": compeleted,
                        "redeem": redeem,
                    });
                }
                
                return res.send(userInviteListData);
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
            var addInviteIncome = userDetails.invite_income + 100;
            const updateUser = await User.findByIdAndUpdate(_userId, {"wallet" : addWalletAmount, "invite_income" : addInviteIncome}, {new:true});
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

//invite user list
router.post("/teamMembers", async(req,res) => {
    try {
        var _userId = req.body.userId
        const userDetails = await User.findById(_userId);
        const userInvites = await Invite.find({'userId' : userDetails._id});
        if (!userDetails) {
            return res.status(400).json({message: "Invalid user id..!"});
        } else if(!userInvites) {
            return res.status(400).json({message: "No Invite Friends..!"});
        } else {
            
            var totalInviteUser = userInvites.length;
            var userPurchaseList = [];
            for (let i = 0; i < userInvites.length; i++) {
                const refUserid = userInvites[i]['refUser']['_id'];
                const findRefUser = await User.findById(refUserid);
                const userPurchaseCount = findRefUser.total_purchase;
                if(userPurchaseCount != 0) {
                    const purchaseAmt = userPurchaseCount;
                    userPurchaseList.push({'amount' : purchaseAmt});
                }
            }
            var totalPurchase = userPurchaseList.map(o => o.amount).reduce((a, c) => { return a + c });
            return res.send({
                'teamMember': totalInviteUser,
                'purchaseNumber': userPurchaseList.length,
                'purchaseAmount': totalPurchase
            });
            //res.status(200).send(userInvites);
        }
    } catch (e) {
        res.status(500).send(e);
    }
})


module.exports = router;