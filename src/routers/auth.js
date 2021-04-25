const express = require("express");
const router = new express.Router();
const User = require("../models/user");

//user login
router.post("/auth/login", async(req,res) => {
    const { phone, password } = req.body;
    try {
            const user = new User(req.body);
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
        res.status(200).json({message : "Register Successfully", user_data : createUser});;
    } catch (e) {
        res.status(500).json({message: "Error, Mobile number already registed"});
    }
});

//chnage password


module.exports = router;
