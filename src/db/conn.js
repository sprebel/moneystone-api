const mongoose = require("mongoose");

mongoose.connect(
    //"mongodb://127.0.0.1:27017/moneystone", 
    "mongodb+srv://abhi_lapsi:Anikesh@16@cluster0.q06xr.mongodb.net/moneystone-db?retryWrites=true&w=majority",
    {
        useNewUrlParser:true,
        useCreateIndex:true,
        useFindAndModify:false,
        useUnifiedTopology:true,
}).then(() => {
    console.log("Connection is successful...");
}).catch((e) => {
    console.log("No connection..!");
})