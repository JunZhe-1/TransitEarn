const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, PointRecord, Sequelize,Product } = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
require('dotenv').config();



router.post("/register", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        productName: yup.string().trim().matches(/^[a-z ,.'-]+$/i)
            .min(3).max(50).required(),
        image: yup.string().trim().min(8).max(50).required(),
        category: yup.string().trim().min(8).max(50).required(),
        quantity: yup.number().required().integer().min(1),
        prizePoint: yup.number().required().integer().min(0),

    })
    try {
        await validationSchema.validate(data,
            { abortEarly: false, strict: true });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }

    // Trim string values
    data.productName = data.productName.trim();
    data.image = data.image.trim();
    data.category = data.category.trim();
    data.quantity = parseInt(data.quantity);
    data.prizePoint = parseInt(data.prizePoint);


    // Create user
    let result = await Product.create(data);
    res.json(result);
});

module.exports = router;