const express = require("express");
const router = new express.Router();
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
const Product = require("../models/product");
const mongoURI = require("../db/conn");

//-------------------------- get all Products -----------------//
router.get("/product", async(req,res) => {
  try {
      const productData = await Product.find();
      res.send(productData);
  } catch (e) {
      res.status(500).send(e);
  }
});


// Storage
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './uploads/');
//   },
//   filename: function(req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + '.png');
//   }
// });

const upload = multer({ storage: storage });

const url = mongoURI;
const connect = mongoose.createConnection(url, {
      useNewUrlParser:true,
      useCreateIndex:true,
      useFindAndModify:false,
      useUnifiedTopology:true
});
let gfs;

connect.once('open', () => {
  gfs = new mongoose.mongo.GridFSBucket(connect.db, {
    bucketName: "uploads"
  });
});


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


//------------------------ Fetch Products Images ---------------------//
router.get("/product/img", async (req,res) => {
  gfs.find().toArray((err, files) => {
    if (!files || files.length === 0) {
      return res.status(200).json({
        success : false,
        message: 'No images available'
      });
    }

    //images formates supported: [jpg, png]
    files.map(file => {
      if (file.contentType === 'images/jpeg' || file.contentType === 'images/png') {
        file.isImage = false;
      } else {
        file.isImage = false;
      }
    });

    res.status(200).json({success: true, files});

  });
});

//------------------------ Fetch Single Images ---------------------//
router.get('/product/img/:filename', async (req, res) => {
  gfs.find({filename: req.params.filename}).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No files available',
      });
    }
    
    res.status(200).json({
      success: true,
      file: files[0],
    });

  });
});


//----------------- Fetch a particular image and render on browser -------------//
router.get('/product/img/d/:filename', async (req, res, next) => {
  gfs.find({filename: req.params.filename}).toArray((err, files) => {
    if (!files[0] || files.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No files available',
      });
    }

    if (file[0].contentType === 'images/jpeg' || file[0].contentType === 'images/png') {
      gfs.openDownloadStreamByName(req.params.filename).pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image',
      })
    }
  });
});

router.route('/product/img/download/:filename')
        .get((req, res, next) => {
            gfs.find({ filename: req.params.filename }).toArray((err, files) => {
                if (!files[0] || files.length === 0) {
                    return res.status(200).json({
                        success: false,
                        message: 'No files available',
                    });
                }

                if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
                    // render image to browser
                    gfs.openDownloadStreamByName(req.params.filename).pipe(res);
                } else {
                    res.status(404).json({
                        err: 'Not an image',
                    });
                }
            });
        });

module.exports = router;