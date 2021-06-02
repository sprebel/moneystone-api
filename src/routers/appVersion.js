const express = require("express");
const router = new express.Router();
const AppVersion = require("../models/appVersion");

//get version
router.get("/appVersion", async(req,res) => {
    try {
        const versionData = await AppVersion.find();
        return res.send(versionData);
    } catch (e) {
        return res.status(500).send(e);
    }
})

//update version
router.get("/latestVersion", async(req,res) => {
    try {
        const versionData = await AppVersion.find().sort({$natural: - 1}).limit(1);
        const latestVersion = versionData[0];
        return res.status(200).send(latestVersion);
    } catch (e) {
        return res.status(500).json({message: e});
    }
})

//add Version
router.post("/appVersion", async(req,res) => {
    console.log(req.body);
    try {
        const appVersion = new AppVersion(req.body);
        const createAppVersion = await appVersion.save();
        return res.status(200).send(createAppVersion);
    } catch (e) {
        return res.status(500).json({message: e});
    }
});

module.exports = router;