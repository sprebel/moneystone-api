const express = require("express");
var multer = require('multer');
var cors = require('cors');
const GridFsStorage = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
var upload = multer();
require("./db/conn");
const userRouter = require("./routers/user");
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const productRouter = require("./routers/product");

const app = express();
const port = process.env.PORT || 4000

app.use(express.json());
app.use(cors())
app.use(upload.array()); 
app.use(userRouter);
app.use(authRouter);
app.use(profileRouter);
app.use(productRouter);

app.listen(port, () => console.log(`connection is setup at ${port}`));