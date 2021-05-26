const mongoose = require("mongoose");

const appVersionSchema = new mongoose.Schema({
    versionName: { type : String },
    versionCode: { type : String },
})

const AppVersion = new mongoose.model('AppVersion', appVersionSchema);

module.exports = AppVersion;