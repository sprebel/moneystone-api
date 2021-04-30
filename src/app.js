const express = require("express");
var multer = require('multer');
var upload = multer();
require("./db/conn");
const userRouter = require("./routers/user");
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");

const app = express();
const port = process.env.PORT || 4000

app.use(express.json());
app.use(upload.array()); 
app.use(userRouter);
app.use(authRouter);
app.use(profileRouter);

app.listen(port, () => console.log(`connection is setup at ${port}`));