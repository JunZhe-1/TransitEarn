const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, PointRecord, Sequelize, Product } = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
require('dotenv').config();


//testing
router.post("/register", async (req, res) => {
    let data = req.body;
    console.log(data);
    // Validate request body
    let validationSchema = yup.object().shape({
        productName: yup.string().trim()
            .min(3).max(50).required(),
        image: yup.string().trim().required(),
        category: yup.string().trim().required(),
        quantity: yup.number().required().integer().min(1),
        prizePoint: yup.number().required().integer().min(1),

    })

    try {
        await validationSchema.validate(data,
            { abortEarly: false, strict: true });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }
    let check = data.image.split('.');
    if (check[1] === "png" || check[1] === "jpg") {

        // Trim string values
        data.productName = data.productName.trim();
        data.image = data.image.trim();
        data.category = data.category.trim();
        data.quantity = parseInt(data.quantity);
        data.prizePoint = parseInt(data.prizePoint);


        // Create user
        let result = await Product.create(data);
        res.json(result);
    }
    else {
        res.status(400).json({ message: "only accept image file" });

    }
});

router.get("/", async (req, res) => {
    try {
        const list = await Product.findAll();
        res.json(list);
        return list;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error at code 53' });
    }
});


router.get("/search", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { productName: { [Sequelize.Op.like]: `%${search}%` } },
            { category: { [Sequelize.Op.like]: `%${search}%` } }
        ];
    }

    let list = await Product.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

router.put("/updateProduct/:id", async (req, res) => {
    let id = req.params.id;
    let product = await Product.findByPk(id);
    let data = req.body;
    if (product) {
        let validationSchema = yup.object().shape({
            productName: yup.string().trim()
                .min(3).max(50).required(),
            image: yup.string().trim().required(),
            category: yup.string().trim().required(),
            quantity: yup.number().required().integer().min(1),
            prizePoint: yup.number().required().integer().min(1),
            status: yup.string().required()

        })
        try {
            await validationSchema.validate(data,
                { abortEarly: false, strict: true });
        }
        catch (err) {
            res.status(400).json({ errors: err.errors });
            return;
        }
        let check = data.image.split('.');
        if (check[1] === "png" || check[1] === "jpg") {

            // Trim string values
            data.productName = data.productName.trim();
            data.image = data.image.trim();
            data.category = data.category.trim();
            data.quantity = parseInt(data.quantity);
            data.prizePoint = parseInt(data.prizePoint);

            if (data.productName != product.productName || data.image != product.image || data.prizePoint != product.prizePoint) {
                let result = await Product.update(data, {
                    where: { id: data.id } // Set the where condition using the primary key
                });
                res.json(result);
            }
            else {
                res.status(400).json({ message: "nothing change" });

            }
        }
        else {
            res.status(400).json({ message: "only accept image file" });

        }
    }

});



router.get("/get/:id", async (req, res) => {
    let id = req.params.id;
    let tutorial = await Product.findByPk(id);
    // Check id not found
    if (!tutorial) {
        res.sendStatus(404);
        return;
    }
    res.json(tutorial);
});


router.delete("/delete/:id", validateToken, async (req, res) => {
    let pointrecordId = req.params.id;

    
    let pointrecord = await Product.findByPk(pointrecordId);
    if (!pointrecord) {
        res.sendStatus(404);
        return;
    }
    console.log(pointrecordId);

    let num = await Product.destroy({ where: { id: pointrecordId } })
    if (num == 1) {
        res.json({
            message: "point record was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete point record with id ${pointrecordId}.`
        });
    }

});


module.exports = router;