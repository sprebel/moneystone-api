const express = require("express");
const router = new express.Router();
const User = require("../models/user");

//user login
router.post("/auth/login", async(req,res) => {
    const { phone, password } = req.body;
    try {
            const loginDetails = await User.findOne({'phone' : phone});
            if (!loginDetails) {
                res.status(400).json({message: "User not found..!"});
            } else {
                if (password != loginDetails.password) {
                    res.status(400).json({message: "Incorrect Password..!"});
                } else {
                    res.json({message : "Login Successfully", user_data : loginDetails});
                }
            }
            
        } catch (e) {
            res.status(500).json({message: "Internal Server Error"});
        }
})

//create new user
router.post("/auth/register", async(req,res) => {
    console.log(req.body);
    try {
        var _phone = req.body.phone;
        var _name = req.body.name;
        var _pass = req.body.password; 
        var _ref = req.body.refUser;  //user Refrence, who..?
        var _invitationCode = _name.substring(0, 3).toUpperCase() +  _phone.substring(5); //unique user code

        const findMobileNumber = await User.findOne({'phone' : _phone});

        if (findMobileNumber) {
            return res.status(400).json({message: "Registration Faild, Mobile Number Already Registered..!"});
        } else {
            const userRefrence = await User.findOne({"invitationCode" : _ref});
            console.log(userRefrence);
        
            if (!userRefrence) {
                return res.status(400).json({message: "Invalid refrrel code..!"});
            } else {

                var addInviteMember;
                var inviteStage;
                if (userRefrence.invite_members == 0) {
                    addInviteMember = userRefrence.invite_members + 1;
                    inviteStage = 1;
                } else if (userRefrence.invite_members <= 3) {
                    addInviteMember = userRefrence.invite_members + 1;
                    inviteStage = 2;
                } else if (userRefrence.invite_members <= 8) {
                    addInviteMember = userRefrence.invite_members + 1;
                    inviteStage = 5;
                } else if (userRefrence.invite_members <= 18) {
                    addInviteMember = userRefrence.invite_members + 1;
                    inviteStage = 10;
                } else if (userRefrence.invite_members <= 38) {
                    addInviteMember = userRefrence.invite_members + 1;
                    inviteStage = 20;
                } else if (userRefrence.invite_members <= 88) {
                    addInviteMember = userRefrence.invite_members + 1;
                    inviteStage = 50;
                } else if (userRefrence.invite_members <= 188) {
                    addInviteMember = userRefrence.invite_members + 1;
                    inviteStage = 100;
                } else if (userRefrence.invite_members <= 388) {
                    addInviteMember = userRefrence.invite_members + 1;
                    inviteStage = 200;
                } else if (userRefrence.invite_members <= 888) {
                    addInviteMember = userRefrence.invite_members + 1;
                    inviteStage = 500;
                }
 
                const updateUser = await User.findByIdAndUpdate(userRefrence._id, {"invite_members" : addInviteMember, "invite_stage" : inviteStage}, {new:true});
                
                console.log(updateUser);

                const user = new User({
                    phone : _phone,
                    password : _pass,
                    name : _name,
                    invitationCode : _invitationCode,
                    device_earnings : 0.0,  
                    team_earnings : 0.0,
                    wallet : 0.0,
                    finance_earnings : 0.0,
                    total_deposite : 0.0,
                    total_purchase : 0.0,
                    refUser : _ref,
                    invite_income : 0.0,
                    invite_members : 0.0,
                    invite_stage : 0
                });

                const createUser = await user.save();
                // const inviteTask = new InviteTask({
                //     userId = userRefrence._id,
                //     userName = userRefrence.name,
                //     userPhone : userRefrence.userPhone,
                // });
                // console.log(createInviteTask);
                // const createInviteTask = await inviteTask.save();
        
                res.status(200).json({message : "Register Successfully", user_data : createUser});
            }
        }

    } catch (e) {
        res.status(500).json({message: "Error, Mobile number already registed"});
    }
});

//chnage password
router.post("/auth/changepass", async(req,res) => {
    const { phone, password } = req.body;
    try {
        const userDetails = await User.findOne({'phone' : phone});
        if (!userDetails) {
            res.status(400).json({error: "User not found..!"});
        } else if(password == null || password == "") {
            res.status(400).json({error: "Password can't black..!"});
        } else {
            const updatePass = await User.findOneAndUpdate({'phone' : phone}, {"password" : password}, {new:true});
            //res.send(updatePass);
            res.json({message : "New password set successfully", user_data : updatePass});
        }
    } catch (e) {
        res.status(500).json({error : e});
    }
});

module.exports = router;
