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
<<<<<<< Updated upstream

    if (search || can) {
=======
    let cardno = req.query.cardNo;

    if (search || can || cardno) {
>>>>>>> Stashed changes
        condition[Sequelize.Op.or] = [];

        if (search) {
            condition[Sequelize.Op.or].push({
                id: { [Sequelize.Op.like]: `%${search}%` }
            });

            condition[Sequelize.Op.or].push({
                CAN: { [Sequelize.Op.like]: `%${search}%` }
            });
<<<<<<< Updated upstream
=======
            condition[Sequelize.Op.or].push({
                userId: { [Sequelize.Op.like]: `%${search}%` }
            });
>>>>>>> Stashed changes
        }

        if (can) {
            condition[Sequelize.Op.or].push({
                CAN: { [Sequelize.Op.like]: `%${can}%` }
            });
        }
<<<<<<< Updated upstream
    }

    let list = await Ezlink.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
=======
        if (cardno) {
            condition[Sequelize.Op.or].push({
                cardNo: { [Sequelize.Op.like]: `%${cardno}%` }
            });
        }
    }

    // Add the order condition for 'updatedAt' in descending order
    let list = await Ezlink.findAll({
        where: condition,
        order: [['updatedAt', 'DESC'], ['createdAt', 'DESC']] // First sort by 'updatedAt' and then by 'createdAt'
>>>>>>> Stashed changes
    });

    res.json(list);
});



<<<<<<< Updated upstream
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let ezlink = await Topupinfo.findByPk(id);
=======

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let ezlink = await Ezlink.findByPk(id);
>>>>>>> Stashed changes
    if (!ezlink) {
        res.sendStatus(404);
        return;}
    res.json(ezlink);
    });

<<<<<<< Updated upstream
=======

    router.delete("/:id", validateToken, async (req, res) => {
        let id = req.params.id;
        // Check id not found
        let ezlink = await Ezlink.findByPk(id);
        if (!ezlink) {
            res.sendStatus(404);
            return;
        }
    
        // Check request user id
        let num = await Ezlink.destroy({
            where: { id: id }
        })
        if (num == 1) {
            res.json({
                message: "Ezlink was deleted successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot delete Ezlink with id ${id}.`
            });
        }
    });
    

    router.put('/:id', async (req,res)=>{
        let id = req.params.id
        let newbalance = req.body.newbalance
        let ezlink = await Ezlink.findByPk(id);
        if(!ezlink){
        res.sendStatus(404);
        return;
        }
        let num = await Ezlink.update(
            { balance: newbalance },
            {
              where: { id: id },
              returning: true, 
            }
          );
          if (num == 1) {
            res.json({
                message: "ezlink was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update ezlink with id ${id}.`
            });
        }







    });


>>>>>>> Stashed changes
module.exports = router;