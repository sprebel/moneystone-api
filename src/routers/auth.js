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

module.exports = router;
