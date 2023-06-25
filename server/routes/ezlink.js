const express = require('express');
const router = express.Router();
const { Ezlink, Sequelize } = require('../models');
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    let validationSchema = yup.object().shape({
        CAN: yup.string().trim().min(16).max(16).required().matches(/^\S*$/, 'Whitespace is not allowed'),
        balance: yup.number().positive().required(),
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
    data.CAN = data.CAN.trim();
    let result = await Ezlink.create(data);

    res.json(result);
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    let can = req.query.CAN;

    if (search || can) {
        condition[Sequelize.Op.or] = [];

        if (search) {
            condition[Sequelize.Op.or].push({
                id: { [Sequelize.Op.like]: `%${search}%` }
            });

            condition[Sequelize.Op.or].push({
                CAN: { [Sequelize.Op.like]: `%${search}%` }
            });
        }

        if (can) {
            condition[Sequelize.Op.or].push({
                CAN: { [Sequelize.Op.like]: `%${can}%` }
            });
        }
    }

    let list = await Ezlink.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });

    res.json(list);
});



router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let ezlink = await Topupinfo.findByPk(id);
    if (!ezlink) {
        res.sendStatus(404);
        return;}
    res.json(ezlink);
    });

module.exports = router;