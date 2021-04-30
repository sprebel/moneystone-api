const express = require("express");
var multer = require('multer');
var cors = require('cors')
var upload = multer();
require("./db/conn");
const userRouter = require("./routers/user");
const authRouter = require("./routers/auth");

const app = express();
const port = process.env.PORT || 4000

app.use(express.json());
app.use(cors())
app.use(upload.array()); 
app.use(userRouter);
app.use(authRouter);

app.listen(port, () => console.log(`connection is setup at ${port}`));