const mongoose = require("mongoose");
const validator = require("validator");

const productSchema = new mongoose.Schema({
    productName : { type : String, require : true },
    image : { type : String },
    price : { type : String },
    details : { type : String },
    featureOne : { type : String },
    featureTwo : { type : String },
    status : { type : String },
    height : { type : String },
    length : { type : String },
    width : { type : String },
});

const Product = new mongoose.model('Product', productSchema);

module.exports = Product;