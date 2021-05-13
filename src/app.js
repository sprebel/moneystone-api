const express = require("express");
var cors = require('cors');
require("./db/conn");
const userRouter = require("./routers/user");
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const productRouter = require("./routers/product");
const orderRouter = require("./routers/order");
const deviceEarningsRouter = require("./routers/deviceEarnings");
const recharge = require("./routers/recharge");

const app = express();
const port = process.env.PORT || 4000

app.use(express.json());
app.use(cors())
app.use(userRouter);
app.use(authRouter);
app.use(profileRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(deviceEarningsRouter);
app.use(recharge);

app.listen(port, () => console.log(`connection is setup at ${port}`));