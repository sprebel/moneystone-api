const express = require("express");
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



module.exports = router;