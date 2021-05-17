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

        const user = new User({
            phone : _phone,
            password : _pass,
            name : _name,
            refUser : _ref,
            invitationCode : _invitationCode,
            device_earnings : 0.0,  
            team_earnings : 0.0,
            wallet : 0.0,
            finance_earnings : 0.0,
            total_deposite : 0.0,
        });
        const createUser = await user.save();

        res.status(200).json({message : "Register Successfully", user_data : createUser});
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
