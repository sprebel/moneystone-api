const express = require("express");
const router = new express.Router();
const User = require("../models/user");
const VerifyOTP = require("../models/verifyOTP");
var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
    // host: "mail.moneystone.com",
    // port: 465,
    service: 'gmail',
    path: "INBOX",
    specialUse: "\\Inbox",
    event: "messageNew",
    auth: {
        user: "mymoneystone@gmail.com",
        pass: "Money@2021"
    }
});


//user login
router.post("/auth/login", async(req,res) => {
    const { phone, password } = req.body;
    try {
            const loginDetails = await User.findOne({'phone' : phone});
            if (!loginDetails) {
                res.status(400).json({message: "User not found..!"});
            } else {
                if (password != loginDetails.password) {
                    res.status(400).json({message: "Incorrect Password..!"});
                } else {
                    res.json({message : "Login Successfully", user_data : loginDetails});
                }
            }
            
        } catch (e) {
            res.status(500).json({message: "Internal Server Error"});
        }
})

//create new user
router.post("/auth/register", async(req,res) => {
    console.log(req.body);
    try {
        var _phone = req.body.phone;
        var _email = req.body.email;
        var _validOTP = req.body.validOTP;
        var _name = req.body.name;
        var _pass = req.body.password; 
        var _ref = req.body.refUser;  //user Refrence, who..?
        var _invitationCode = _name.substring(0, 3).toUpperCase() +  _phone.substring(5); //unique user code

        const findMobileNumber = await User.findOne({'phone' : _phone});
        const findEmail = await User.findOne({'email' : _email});

        if (findMobileNumber) {
            return res.status(400).json({message: "Registration Faild, Mobile Number Already Registered..!"});
        } else if (findEmail) {
            return res.status(400).json({message: "Registration Faild, Email Address Already Registered..!"});
        } else {

            const otpDetails = await VerifyOTP.find({'email': _email}).sort({$natural: - 1}).limit(1);
            var otp = otpDetails[0]['otp'] ?? '00000';

            if (_validOTP != otp) {
                res.json({message : "Faild, OTP doesn't match"});
            } 
            else {
                const userRefrence = await User.findOne({"invitationCode" : _ref});
                console.log(userRefrence);
            
                if (!userRefrence) {
                    return res.status(400).json({message: "Invalid refrrel code..!"});
                } else {
    
                    var addInviteMember;
                    var inviteStage;
                    if (userRefrence.invite_members == 0) {
                        addInviteMember = userRefrence.invite_members + 1;
                        inviteStage = 1;
                    } else if (userRefrence.invite_members <= 3) {
                        addInviteMember = userRefrence.invite_members + 1;
                        inviteStage = 2;
                    } else if (userRefrence.invite_members <= 8) {
                        addInviteMember = userRefrence.invite_members + 1;
                        inviteStage = 5;
                    } else if (userRefrence.invite_members <= 18) {
                        addInviteMember = userRefrence.invite_members + 1;
                        inviteStage = 10;
                    } else if (userRefrence.invite_members <= 38) {
                        addInviteMember = userRefrence.invite_members + 1;
                        inviteStage = 20;
                    } else if (userRefrence.invite_members <= 88) {
                        addInviteMember = userRefrence.invite_members + 1;
                        inviteStage = 50;
                    } else if (userRefrence.invite_members <= 188) {
                        addInviteMember = userRefrence.invite_members + 1;
                        inviteStage = 100;
                    } else if (userRefrence.invite_members <= 388) {
                        addInviteMember = userRefrence.invite_members + 1;
                        inviteStage = 200;
                    } else if (userRefrence.invite_members <= 888) {
                        addInviteMember = userRefrence.invite_members + 1;
                        inviteStage = 500;
                    }
     
                    const updateUser = await User.findByIdAndUpdate(userRefrence._id, {"invite_members" : addInviteMember, "invite_stage" : inviteStage}, {new:true});
                    
                    console.log(updateUser);
    
                    const user = new User({
                        name : _name,
                        phone : _phone,
                        email: _email,
                        password : _pass,
                        invitationCode : _invitationCode,
                        device_earnings : 0.0,  
                        team_earnings : 0.0,
                        wallet : 0.0,
                        finance_earnings : 0.0,
                        total_deposite : 0.0,
                        total_purchase : 0.0,
                        refUser : _ref,
                        invite_income : 0.0,
                        invite_members : 0.0,
                        invite_stage : 0
                    });
    
                    const createUser = await user.save();
            
                    res.status(200).json({message : "Register Successfully", user_data : createUser});
                }
            
            }
        }

    } catch (e) {
        res.status(500).json({message: e});
    }
});

//Sinup OTP
router.post("/auth/singupOtp", async(req,res) => {
    
    var _email = req.body.email;

    try {
        var random = Math.floor(100000 + Math.random() * 900000).toString();
        await smtpTransport.sendMail({
            from: 'mymoneystone@gmail.com',
            to: _email,
            subject: 'Money Stone - New user registration',
            text: "To verify your email, please use the following One Time Password (OTP) :\n\n\n" + random.toString() + '\n\n\nDo not Share this OTP with anyone. Moneystone takes your account security very seriously. Moneystone Customer Service will never ask you to disclose or verify your Moneystone Password, OTP, Credit card or email with a link to update your account information, Do not click on the link - instead, report the email to MoneyStone for investigation.\n\nWe hope to see you again soon. ',
        });
        const verifyOTP = new VerifyOTP({
            otp: random.toString(),
            email: _email,
        });
        const sendOTP = await verifyOTP.save();

        res.json({message : "OTP send..!", otpDetails: sendOTP});

    } catch (e) {
        res.status(500).json({error : e});
    }
})

//verfied OTP
router.post("/auth/verifyotp", async(req,res) => {

    const _email = req.body.email;

    try {
        const userDetails = await User.findOne({'email' : _email});
        var random = Math.floor(100000 + Math.random() * 900000).toString();
        if (!userDetails) {
            return res.status(200).json({message: "User not found..!"});
        } else {
            
            await smtpTransport.sendMail({
                from: 'mymoneystone@gmail.com',
                to: _email,
                subject: 'Money Stone - Forget Password Confirmation OTP',
                text: "Verfication OTP to change your\nMoney Stone Account Password\n" + random.toString(),
            });
            const verifyOTP = new VerifyOTP({
                otp: random.toString(),
                userId: userDetails._id,
                email: userDetails.email,
            });
            const sendOTP = await verifyOTP.save();
            return res.status(200).send(sendOTP);
        }

    } catch (e) {
        res.status(500).json({error:e});
    }
})

//chnage password
router.post("/auth/changepass", async(req,res) => {

    var _email = req.body.email;
    var _validOTP = req.body.validOTP;
    var _password = req.body.password;

    try {
        const userDetails = await User.findOne({'email' : _email});
        if (!userDetails) {
            res.status(400).json({error: "User not found..!"});
        } else if(_password == null || _password == "") {
            res.status(400).json({error: "Password can't black..!"});
        } else {
            //const otpDetails = await VerifyOTP.findOne({'email': email});
            const otpDetails = await VerifyOTP.find({'email': _email}).sort({$natural: - 1}).limit(1);
            var otp = otpDetails[0]['otp'];

            if (_validOTP == otp) {
                const updatePass = await User.findOneAndUpdate({'email' : _email}, {"password" : _password}, {new:true});
                res.status(200).json({message : "New password set successfully", user_data : updatePass});
            } else {
                res.status(400).json({message : "Faild, OTP doesn't match"});
            }
        }
    } catch (e) {
        res.status(500).json({error : e});
    }
});

module.exports = router;
