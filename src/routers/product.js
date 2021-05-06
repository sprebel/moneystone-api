const express = require("express");
const router = new express.Router();
const mongoose = require("mongoose");
const multer = require('multer');

const Product = require("../models/product");

//get all Products
router.get("/product", async(req,res) => {
    try {
        const productData = await Product.find();
        res.send(productData);
    } catch (e) {
        res.status(500).send(e);
    }
});

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter,
})


router.post("/", upload.single('image'), (req, res, next) => {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      product_name: req.body.name,
      price: req.body.price,
      image: req.file.path 
    });
    product
      .save()
      .then(result => {
        console.log(result);
        res.status(200).json({
          message: "Created product successfully",
          createdProduct: {
              product_name: result.name,
              price: result.price,
              _id: result._id,
              request: {
                  type: 'GET',
                  url: "http://localhost:4000/products/" + result._id
              }
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  });

module.exports = router;