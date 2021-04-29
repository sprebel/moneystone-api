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
        const user = new User(req.body);
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
