const express = require('express');
const router = express.Router();
const { Topupinfo, Sequelize } = require('../models');
const yup = require("yup");


router.post("/", async (req, res) => {
    let data = req.body;
    let validationSchema = yup.object().shape({
        cardNo: yup.string().trim().min(16).max(16).required().matches(/^\S*$/, 'Whitespace is not allowed'),
        balance: yup.number().positive().required()
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
    let result = await Topupinfo.create(data);

    res.json(result);
});
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { cardNo: { [Sequelize.Op.like]: `%${search}%` } }
        ];
    }

    let list = await Topupinfo.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});


router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let topup = await Topupinfo.findByPk(id);
    if (!topup) {
        res.sendStatus(404);
        return;}
    res.json(topup);
    });

module.exports = router;