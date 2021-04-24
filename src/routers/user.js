const express = require("express");
const router = new express.Router();
const User = require("../models/user");

//create new user
router.post("/user", async(req,res) => {
    console.log(req.body);
    try {
        const user = new User(req.body);
        const createUser = await user.save();
        res.status(200).send(createUser);
    } catch (e) {
        res.status(400).send(e);
    }
});

//get all user
router.get("/user", async(req,res) => {
    try {
        const userData = await User.find();
        res.send(userData);
    } catch (e) {
        res.status(400).send(e);
    }
})

//get user details
router.get("/user/:id", async(req,res) => {
    try {
        const _id = req.params.id;
        const userDetails = await User.findById(_id);
        if (!userDetails) {
            return res.status(404).send();
        } else {
            res.send(userDetails);
        }
    } catch (e) {
        res.status(400).send(e);
    }
})

//update user
router.patch("/user/:id", async(req,res) => {
    try {
        const _id = req.params.id;
        const updateUser = await User.findByIdAndUpdate(_id, req.body, {new:true});
        res.send(updateUser);
    } catch (e) {
        res.status(400).send(e);
    }
})

//delete user
router.delete("/user/:id", async(req,res) => {
    try {
        const _id = req.params.id;
        const deleteUser = await User.findByIdAndDelete(_id);
        if (!_id) {
            res.status(404).send(e);
        }
        res.send(deleteUser);
    } catch (e) {
        res.status(400).send(e);
    }
})

module.exports = router;