const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, PointRecord, Sequelize } = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
require('dotenv').config();
const dayjs = require('dayjs');



router.get("/get", async (req, res) => {
    try {
        const list = await PointRecord.findAll();
        res.json(list);
        return list;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error at code 17' });
    }
});


router.get("/search", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    let userId = req.query.userId;
    if (search) {
        condition[Sequelize.Op.or] = [
            { recipient: { [Sequelize.Op.like]: `%${search}%` } },
            { recipientName: { [Sequelize.Op.like]: `%${search}%` } }

        ];
    }
    if (userId) {
        condition.userId = userId;
    }

    let list = await PointRecord.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);

});

router.get("/adminget/:id", async (req, res) => {
    let id = req.params.id;
    let pointrecord = await PointRecord.findByPk(id);
    if (!pointrecord) {
        res.json(error);
        return;
    }
    res.json(pointrecord);
    // [], to ensure it is a array even it is a single

});


router.get("/get/:id", async (req, res) => {
    let id = req.params.id;
    let pointrecord = await PointRecord.findAll({
        where: { userId: id },
        include: { model: User, as: 'user', attributes: ['name'] }
    });
    if (!pointrecord) {
        res.json([]);
        return;
    }
    res.json(pointrecord);
    // [], to ensure it is a array even it is a single

});


router.put("/edit/:id", async (req, res) => {

    let id = req.params.id; //get the id from url
    let data = req.body;
    let pointrecord = await PointRecord.findByPk(id,
        {
            include: { model: User, as: "user", attributes: ['name'] }
        });
    if (!pointrecord) {
        res.sendStatus(404);
        return;
    }
    let senderInfo = await User.findOne(
        {
            where: { phone: pointrecord.sender }
        });

    let recipientInfo = await User.findOne(
        {
            where: { phone: pointrecord.recipient }
        });

    let validationSchema = yup.object().shape({
        transferpoint: yup.number().required().integer().min(0)
    });
    try {
        await validationSchema.validate(data,
            { abortEarly: false, strict: true });
        let updatenumber = pointrecord.transferpoint - data.transferpoint;

        if (updatenumber !== 0) {
            if ((recipientInfo.point - updatenumber) >= 0) {

                if ((senderInfo.point + updatenumber) >= 0) {

                    senderInfo.point = senderInfo.point + updatenumber;
                    recipientInfo.point = recipientInfo.point - updatenumber;
                    const transfer_date = dayjs().format('D MMM YYYY HH:mm');



                    let refundSender = await User.update({ point: senderInfo.point },
                        {
                            where: { id: senderInfo.id }
                        });
                    let deductRecipient = await User.update({ point: recipientInfo.point },
                        {
                            where: { id: recipientInfo.id }
                        });

                    if (refundSender == 1 && deductRecipient == 1) {
                        let changeStatus = await PointRecord.update({
                            transferpointdate: transfer_date,
                            transferpoint: data.transferpoint,
                        },
                            {
                                where: { id: id }
                            });
                        res.json({
                            message: "point record was updated successfully."
                        });
                    }

                }
                else {
                    res.status(500).json({ message: `${senderInfo.name} does not have enough point` });
                    return;
                }
            }


            else {
                res.status(500).json({ message: `${recipientInfo.name} does not have enough point` });
                return;
            }
        } else {
            res.status(500).json({ message: `You does not make any changes` });
            return;
        }
    }
    catch (err) {
        console.log("Error:", err);
        res.status(500).json({ message: " error", error: err });
        return;
    }



});


router.put("/refund/:id", async (req, res) => {
    let id = req.params.id; //get the id from url
    let pointrecord = await PointRecord.findByPk(id,
        {
            include: { model: User, as: "user", attributes: ['name'] }
        });

    if (!pointrecord) {
        res.sendStatus(404);
        return;
    }



    let senderInfo = await User.findOne(
        {
            where: { phone: pointrecord.sender }
        });

    let recipientInfo = await User.findOne(
        {
            where: { phone: pointrecord.recipient }
        });
    if (recipientInfo.point >= pointrecord.transferpoint && pointrecord.Status === 'yes') {
        senderInfo.point = senderInfo.point + pointrecord.transferpoint;
        recipientInfo.point = recipientInfo.point - pointrecord.transferpoint;

        let refundSender = await User.update({ point: senderInfo.point },
            {
                where: { id: senderInfo.id }
            });
        let deductRecipient = await User.update({ point: recipientInfo.point },
            {
                where: { id: recipientInfo.id }
            });

        if (refundSender == 1 && deductRecipient == 1) {
            let changeStatus = await PointRecord.update({ Status: "no" },
                {
                    where: { id: pointrecord.id }
                });
            res.json({
                message: "point record was updated successfully."
            });
        }

    }
    else {

        res.status(400).json({ message: `${recipientInfo.name} does not have enough point to refund to Sender` });
        return;
    }

});



router.delete("/remove/:id", async (req, res) => {
    let pointrecordId = req.params.id;
    console.log(pointrecordId);
    console.log("here");
    let pointrecord = await PointRecord.findByPk(pointrecordId);
    if (!pointrecord) {
        res.sendStatus(404);
        return;
    }

    let num = await PointRecord.destroy({ where: { id: pointrecordId } })
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