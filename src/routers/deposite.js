const express = require("express");
const router = new express.Router();
const Deposite = require("../models/deposite");
const User = require("../models/user");
const DepositeEarnings = require("../models/depositeEarnings");

//add Deposite
router.post("/addDeposite", async(req,res) => {
    try {
        var _userId = req.body.userId
        var _days = req.body.days
        var _depositeAmt = req.body.depositeAmt
        var _depositePer = req.body.depositePer
        var _depositeUnit = req.body.depositeUnit
        var _depositeDate = req.body.depositeDate
        var _depositeMonth = req.body.depositeMonth
        var _depositeYear = req.body.depositeYear
        const userDetails = await User.findById(_userId);

        if (!userDetails) {
            return res.status(400).json({message: "Invalid user id..!"});
        } else if (userDetails.wallet < _depositeAmt) {
            return res.status(400).json({message: "You have insufficient wallet balance"});
        } else {
            var minusWalletAmt = userDetails.wallet - _depositeAmt;
            var addDepositeAmt = userDetails.total_deposite + _depositeAmt;
            
            var _depositeIncome = (_depositePer / 100) * _depositeAmt;

            var addFinaceAmt = userDetails.finance_earnings + _depositeIncome;
            const updateUser = await User.findByIdAndUpdate(_userId, {"wallet" : minusWalletAmt, "total_deposite" : addDepositeAmt, "finance_earnings" : addFinaceAmt}, {new:true});

            
    
            const deposite = new Deposite({
                userId: userDetails._id,
                userName: userDetails.name,
                userPhone: userDetails.phone,
                days: _days,
                percentage: _depositePer,
                depositeUnit: _depositeUnit,
                depositeAmt: _depositeAmt,
                transactionDate : _depositeDate,
                transactionMonth : _depositeMonth,
                transactionYear : _depositeYear,
                depositeIncome: _depositeIncome
            })

            const addDeposite = await deposite.save();
            res.status(200).json({message : "Deposit Successfully.", depositeDetails: addDeposite});
            
        }

    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    } 
});

//get deposite
router.get("/deposite", async(req,res) => {
    try {
        const depositeData = await Deposite.find();
        res.send(depositeData);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
});

//user deposite
router.post("/userDeposite", async(req,res) => {
    try {
        var _userId = req.body.userId

        const userDetails = await User.findById(_userId);
        
        if (!userDetails) {
            return res.status(400).json({message: "Invalid user id..!"});
        } else {
            const userDeposite = await Deposite.find({'userId' : userDetails._id});
            if (!userDeposite) {
                res.status(400).json({error: "No Deposite..!"});
            } else {
                var date = new Date();
                var currentDate = date.getDate();
                var currentMonth = date.getMonth();
                var currentYear = date.getFullYear();

                var depositeYear;
                var depositeMonth;
                var depositeDate;
                var depositeIncome;

                // for (let i = 0; i < userDeposite.length; i++) {
                //     depositeDays = userDeposite[i]['days'];
                //     depositeYear = userDeposite[i]['transactionYear'];
                //     depositeMonth = userDeposite[i]['transactionMonth'];
                //     depositeDate = userDeposite[i]['transactionDate'];
                //     depositeIncome = userDeposite[i]['depositeIncome']; 
                //     console.log(depositeYear);
                //     console.log(depositeMonth);
                //     console.log(depositeDate);
                //     console.log(depositeIncome);

                //     totalDays = currentDate - depositeDate;
                //     console.log(totalDays);

                //     // if (depositeDays <= totalDays) {
                //     //     console.log('Abhi...!');
                //     //     const updateUser = await User.findByIdAndUpdate(_userId, {"finance_earnings" : depositeIncome}, {new:true});
                //     //     console.log(updateUser);
                //     //     console.log('Abhi...!');
                //     // }
                // }
            

                // var financeEarnings;
                // if (currentYear == userDeposite.transactionYear) {
                //     //financeEarnings = userDeposite.depositeIncome;

                //     for (let i = 0; i < userDeposite.length; i++) {
                //         financeEarnings = userDeposite.depositeIncome[i];
                //         console.log(financeEarnings);
                //     }
                // }

                const depositeData = {
                    financeEarnings: "12345",
                    deposite: userDeposite
                };

                res.status(200).json(userDeposite);
            }
        }  
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
});



//delete Deposite
router.delete("/deposite/:id", async(req,res) => {
    try {
        const _id = req.params.id;
        const deleteDeposite = await Deposite.findByIdAndDelete(_id);
        if (!_id) {
            res.status(404).send(e);
        }
        res.send(deleteDeposite);
    } catch (e) {
        res.status(500).send(e);
    }
})


//get all user deposite earnings
router.get("/depositeEarnings", async(req,res) => {
    try {
        const depositeEarningsData = await DepositeEarnings.find();
        res.send(depositeEarningsData);
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"});
    }
});


module.exports = router;