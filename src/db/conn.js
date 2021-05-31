const mongoose = require("mongoose");

const mongoURI = "mongodb+srv://abhi_lapsi:Anikesh@16@cluster0.q06xr.mongodb.net/moneystone-db?retryWrites=true&w=majority";

mongoose.connect(
    //"mongodb://127.0.0.1:27017/moneystone",
    mongoURI,
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
}).then(() => {
    console.log("Connection is successful...");
}).catch((e) => {
    console.log("No connection..!");
})

module.exports = mongoURI;