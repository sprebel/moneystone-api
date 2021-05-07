const express = require("express");
const router = new express.Router();
const multer = require('multer');
// const GridFsStorage = require('multer-gridfs-storage');
// const crypto = require('crypto');
// const path = require('path');
// const mongoose = require('mongoose');
const Product = require("../models/product");

//-------------------------- get all Products -----------------//
router.get("/product", async(req,res) => {
  try {
      const productData = await Product.find();
      res.send(productData);
  } catch (e) {
      res.status(500).send(e);
  }
});

// const mongoURI = "mongodb+srv://abhi_lapsi:Anikesh@16@cluster0.q06xr.mongodb.net/moneystone-db?retryWrites=true&w=majority";

// // connection
// const conn = mongoose.createConnection(mongoURI, {
//   useNewUrlParser:true,
//   useCreateIndex:true,
//   useFindAndModify:false,
//   useUnifiedTopology:true,
// });

// init gfs
// let gfs;
// conn.once('open', () => {
//   // init stream
//   gfs = new mongoose.mongo.GridFSBucket(conn.db, {
//     bucketName: 'uploads',
//   });
// });

// Storage
// const storage = new GridFsStorage({
//   url: "mongodb+srv://abhi_lapsi:Anikesh@16@cluster0.q06xr.mongodb.net/moneystone-db?retryWrites=true&w=majority",
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'uploads',
//         };
//         resolve(fileInfo);
//       });
//     });
//   },
// });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.png');
  }
});

const upload = multer({ storage: storage });


//------------------------ Upload Products ---------------------//
router.post("/product", upload.single('image'), async(req,res) => {
  try {
    const product = new Product({
      productName: req.body.productName,
      price: req.body.price,
      image: req.file.path
    });

    const uploadProduct = await product.save();

    res.status(200).json({
      message: "Product Add Successfully.",
      image : "http://localhost:4000/products/" + uploadProduct._id + ".png",
      createdProduct : uploadProduct,
    });

  } catch (e) {
    res.status(500).send(e);
  }
});


module.exports = router;