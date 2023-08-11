const express = require('express');
const router = express.Router();
const { Topupinfo, Sequelize } = require('../models');
const yup = require("yup");


router.post("/", async (req, res) => {
    let data = req.body;
    let validationSchema = yup.object().shape({
        cardNo: yup.string().trim().min(16).max(16).required().matches(/^\S*$/, 'Whitespace is not allowed')
        .test('unique-cardNo', 'This card already exists', async function (num) {
            const cardExists = await Topupinfo.findOne({ where: { cardNo: num } });
            return !cardExists; 
          }),
        balance: yup.number().positive().required(),
        cvv: yup.string().required().min(3).max(3).matches(/^\d+$/, 'Integers only'),
    });

    try {
        await validationSchema.validate(data,
            { abortEarly: false, strict: true });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }
    data.cardNo = data.cardNo.trim();
    data.balance = data.balance;
    data.cvv = data.cvv.trim();
    data.cardType = data.cardType
    let result = await Topupinfo.create(data);
    
    res.json(result);
});
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    let cardno = req.query.cardNo;
    
    if (search || cardno) {
        if (search) {
        condition[Sequelize.Op.or] = [
            { cardNo: { [Sequelize.Op.like]: `%${search}%` } }
        ];
    }
    if (cardno) {
        condition[Sequelize.Op.or].push({
            cardNo: { [Sequelize.Op.like]: `%${cardno}%` }
        });
    }
    }

    let list = await Topupinfo.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});


router.get("/:cardNo", async (req, res) => {
    let cardNo = req.params.cardNo;
    let topup = await Topupinfo.findByPk(cardNo);
    if (!topup) {
        res.sendStatus(404);
        return;}
    res.json(topup);
    });

module.exports = router;

router.put('/:cardNo', async (req,res)=>{

    let cardNo = req.params.cardNo;
    let topup = await Topupinfo.findByPk(cardNo);
    if (!topup) {
        res.sendStatus(404);
        return;}

    let newbalance = parseFloat(req.body.newbalance)
    let num = await Topupinfo.update(
        { balance: newbalance },
        {
          where: { cardNo: cardNo },
          returning: true, 
        }
      );
    if (num == 1) {
        res.json({
            message: "creditcard was updated successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot update creditcard with card number ${cardNo}.`
        });
    }

});