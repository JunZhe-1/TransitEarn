const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, PointRecord } = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
require('dotenv').config();
const dayjs = require('dayjs');



router.post("/register", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        name: yup.string().trim().matches(/^[a-z ,.'-]+$/i)
            .min(3).max(50).required(),
        email: yup.string().trim().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required(),
        point: yup.number().required().integer().min(0),
        phone: yup.number().required().integer().test('len', 'Phone number must be exactly 8 digits', (val) => val && val.toString().length == 8),

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
    data.name = data.name.trim();
    data.email = data.email.trim().toLowerCase();
    data.password = data.password.trim();
    data.point = parseInt(data.point);
    data.phone = parseInt(data.phone);

    // Check email
    let user = await User.findOne({
        where: { email: data.email }
    });
    let user_phone = await User.findOne({
        where: { phone: data.phone }
    });
    if (user) {
        res.status(400).json({ message: "Email already exists." });
        return;
    }
    if (user_phone) {
        res.status(400).json({ message: "Phone Number already exists." });
        return;
    }

    // Hash passowrd
    data.password = await bcrypt.hash(data.password, 10);
    // Create user
    let result = await User.create(data);
    res.json(result);
});

router.post("/login", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        email: yup.string().trim().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
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
    data.email = data.email.trim().toLowerCase();
    data.password = data.password.trim();

    // Check email and password
    let errorMsg = "Email or password is not correct.";
    let user = await User.findOne({
        where: { email: data.email }
    });
    if (!user) {
        res.status(400).json({ message: errorMsg });
        return;
    }
    let match = await bcrypt.compare(data.password, user.password);
    if (!match) {
        res.status(400).json({ message: errorMsg });
        return;
    }

    // Return user info
    let userInfo = {
        id: user.id,
        email: user.email,
        name: user.name,
        point: user.point,
        phone: user.phone
    };
    let accessToken = sign(userInfo, process.env.APP_SECRET);
    res.json({
        accessToken: accessToken,
        user: userInfo
    });
});

router.get("/auth", validateToken, (req, res) => {
    let userInfo = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        point: req.user.point
    };
    res.json({
        user: userInfo
    });
});


router.get("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await User.findByPk(id);
        if (!data) {
            res.sendStatus(403);
            return;
        }
        res.json(data);

    } catch (error) {
        console.error("Error occurred while fetching data:", error);
    }


})

router.get("/getId/:getId", async (req, res) => {
    try {
        let id = req.params.getId;
        let checking = await User.findOne({ where: { phone: id } });
        if (!checking) {
            res.status(400).json({ message: "Not user found" });
            return;
        }


        res.json(checking);


    } catch (error) {
        res.status(400).json({ message: "Undefined" });
    }


})

router.put("/transfer/:phones", async (req, res) => {
    let phones = req.params.phones;
    let data = req.body;


    // check phone not found
    let checking = await User.findOne({ where: { phone: phones } });
    if (!checking) {
        res.sendStatus(403);
        return;
    }
    let userId = checking.id;
    console.log("User ID:", userId);

    // check request user id
    if (checking.id != userId) {
        res.sendStatus(403);
        return;
    }

    let validationSchema = yup.object().shape({
        point: yup.number().required().integer().min(0),
        phone: yup.number().required().integer().test('len', 'Phone number must be exactly 8 digits', (val) => val && val.toString().length == 8)
    });

    let receiver = await User.findOne({
        where: { phone: data.phone }
    });

    if (!receiver) {
        res.status(400).json({ message: "Phone number does not exist" });
        return;
    }
    else if (receiver.phone == checking.phone) {
        res.status(400).json({ message: "This is your number!" });
        return;

    }
    else {
        try {
            await validationSchema.validate(data,
                { abortEarly: false, strict: true });
            if (checking.point >= data.point) {
                receiver.point = receiver.point + parseInt(data.point);

                let num1 = await User.update({ point: receiver.point }, {
                    where: { id: receiver.id }
                });
                checking.point = checking.point - parseInt(data.point);
                let num2 = await User.update({ point: checking.point }, {
                    where: { id: checking.id }

                });
                await update(checking, receiver, data.point);
                if (num1 == 1 && num2 == 1) {
                    res.json({
                        message: "Tutorial was updated successfully."
                    });



                }
                else {
                    res.status(400).json({ message: "Undefined" });

                }
            }
            else {
                res.status(400).json({ message: "You don't have enough point!" });
                return;

            }
        }
        catch (err) {
            console.log("Error:", err);
            res.status(500).json({ message: " error", error: err });
            return;
        }

    }

});

async function update(checking, receiver, point) {

    // get the name and phone but rename it to prevent crash.
    let { name: sender_name, phone: sender_phone } = checking;

    let { name: receiver_name, phone: receiver_phone } = receiver;

    const transfer_date = dayjs().format('D MMM YYYY HH:mm');

    // console.log(sender_name, sender_phone);
    // console.log(receiver_name, receiver_phone);

    try {
        let result = await PointRecord.create({
            senderName: sender_name,
            sender: sender_phone,
            recipientName: receiver_name,
            recipient: receiver_phone,
            transferpoint: point,
            transferpointdate: transfer_date,
            Status: "yes",
            userId: checking.id
        });


        return result;
    }
    catch (error) {
        console.error(error);
        return error;
    }

}



module.exports = router;
