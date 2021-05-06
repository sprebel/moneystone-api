const mongoose = require("mongoose");
const validator = require("validator");

const productSchema = new mongoose.Schema({
    product_name : { type : String, required: true },
    image : { type : String },
    price : { type : String },
    details : { type : String },
    feature_one : { type : String },
    feature_two : { type : String },
    status : { type : String },
    height : { type : String },
    length : { type : String },
    width : { type : String },
});

const Product = new mongoose.model('Product', productSchema);

module.exports = Product;