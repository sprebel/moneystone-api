const express = require("express");
const router = new express.Router();
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
const Product = require("../models/product");
const mongoURI = require("../db/conn");
const domain = require("../config/domain")

//-------------------------- get all Products -----------------//
router.get("/product", async(req,res) => {
  try {
      const productData = await Product.find();
      res.send(productData);
  } catch (e) {
      res.status(500).send(e);
  }
});

//get product details
router.get("/product/:id", async(req,res) => {
  try {
      const _id = req.params.id;
      const productDetails = await Product.findById(_id);
      if (!productDetails) {
          return res.status(404).send();
      } else {
          res.send(productDetails);
      }
  } catch (e) {
      res.status(500).send(e);
  }
})

var filename;

// Storage
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        filename = buf.toString('hex') + path.extname(file.originalname);
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
      image: req.file.path,
      details: req.body.details,
      featureOne: req.body.featureOne,
      featureTwo: req.body.featureTwo,
      status: req.body.status,
      minimum: req.body.minimum,
      height: req.body.height,
      length: req.body.length,
      width: req.body.width
    });

    const addProduct = new Product({
      productName: req.body.productName,
      price: req.body.price,
      image: domain + "/product/img/download/" + filename,
      details: req.body.details,
      featureOne: req.body.featureOne,
      featureTwo: req.body.featureTwo,
      status: req.body.status,
      minimum: req.body.minimum,
      height: req.body.height,
      length: req.body.length,
      width: req.body.width
    });

    console.log(addProduct);
    const uploadProduct = await addProduct.save();
    res.status(200).json({
      message: "Product Add Successfully.",
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


router.route('/product/img/:id')
  .delete((req, res, next) => {
      console.log(req.params.id);
      gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
          if (err) {
              return res.status(404).json({ err: err });
          }

          res.status(200).json({
              success: true,
              message: `File with ID ${req.params.id} is deleted`,
          });
      });
});

//delete product
router.delete("/product/:id", async(req,res) => {
  try {
      const _id = req.params.id;
      const deleteProduct = await Product.findByIdAndDelete(_id);
      if (!_id) {
          res.status(404).send(e);
      }
      res.send(deleteProduct);
  } catch (e) {
      res.status(500).send(e);
  }
})

//------------------- Update products -------------------//
router.patch("/product/:id", async(req,res) => {
  try {
    const _id = req.params.id;
    const updateProduct = await Product.findByIdAndUpdate(_id, req.body, {new:true});
    res.send(updateProduct);
  } catch (e) {
    res.status(500).send(e);  
  }
})

module.exports = router;