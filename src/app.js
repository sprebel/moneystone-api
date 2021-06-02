const express = require("express");
require("./db/conn");
var cors = require('cors')
const userRouter = require("./routers/user");
const authRouter = require("./routers/auth");
const profileRouter = require("./routers/profile");
const productRouter = require("./routers/product");
const orderRouter = require("./routers/order");
const deviceEarningsRouter = require("./routers/deviceEarnings");
const recharge = require("./routers/recharge");
const deposite = require("./routers/deposite");
const withrawal = require("./routers/withrawal");
const invite = require("./routers/invite");
const appVersion = require("./routers/appVersion");

const app = express();
var serverPort = 5001;
const port = process.env.PORT || serverPort

app.use(express.json());
app.use(cors());
app.use(userRouter);
app.use(authRouter);
app.use(profileRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(deviceEarningsRouter);
app.use(recharge);
app.use(deposite);
app.use(withrawal);
app.use(invite);
app.use(appVersion);

app.listen(port, () => console.log(`connection is setup at ${port}`));
