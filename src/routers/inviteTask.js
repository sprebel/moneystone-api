const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const InviteTask = require("../models/inviteTask");

//get invite tasks
router.get("/inviteTask", async(req,res) => { 
    try {
        const inviteTaskData = await InviteTask.find();
        res.send(inviteTaskData);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
 });

 module.exports = router;
