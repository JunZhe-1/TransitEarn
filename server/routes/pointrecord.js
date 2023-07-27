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
    let userName = req.query.username;



    let Sender = await PointRecord.findAll({
        where: {
            [Sequelize.Op.or]: [{ sender: userId }, { recipient: userId }],

        },
        include: { model: User, as: 'user', attributes: ['name'] }
    });

    if (!Sender) {
        res.json([]);
        return;
    }

    if (search) {
        condition[Sequelize.Op.or] = [
            { recipient: { [Sequelize.Op.like]: `%${search}%` } },
            { recipientName: { [Sequelize.Op.like]: `%${search}%` } }

        ];
    }

    let point = await PointRecord.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });

    // point.forEach(record => {
    //     if (userId !== record.recipient || userName !== record.recipientName) {
    //         record.sender === userId;
    //         console.log(record.senderName);
    //     }
    // });

    point = point.filter(record => {
        if (userId != record.recipient && userName != record.recipientName) {

            if (record.sender == userId) {
                console.log(record.sender);
                point = record;
                return point;

            }

        }
        else if (userId == record.recipient || userName == record.recipientName) {
            console.log(record.recipient);
            point = record;
            return point;
        }
    })


    res.json(point);

});


router.get("/adminget/chart", async (req, res) => {

    let chart_data = {};
    let ranking_tmp = {};
    let data = {};
    try {
        const list = await PointRecord.findAll({
            where: {
                recipientName: "admin"
            }
        });


        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMont = currentDate.getMonth() + 1; // because java start from 0

        if (currentMont >= 1 && currentMont <= 12) {
            for (let month = 0; month <= 11; month++) {
                const monthName = new Date(0, month).toLocaleString('default', { month: 'short' });
                chart_data[monthName] = 0;
            }
        }
        console.log(chart_data);
        // else {
        //     for (let month = 0; month <= 5; month++) {
        //         const monthName = new Date(0, month).toLocaleString('default', { month: 'long' });
        //         chart_data[monthName] = 0;
        //     }
        // }

        for (const j of list) {
            if (j.transferpointdate.getFullYear() === currentYear) {
                if (currentMont >= 1 && currentMont <= 12) {

                     if (j.transferpointdate.getMonth() === 0 && j.Status === 'yes') {
                        chart_data['Jan'] += j.transferpoint;
                    }
                    else if (j.transferpointdate.getMonth() === 1 && j.Status === 'yes') {
                        chart_data['Feb'] += j.transferpoint;
                    }
                    else if (j.transferpointdate.getMonth() === 2 && j.Status === 'yes') {
                        chart_data['Mar'] += j.transferpoint;
                    }
                    else if (j.transferpointdate.getMonth() === 3 && j.Status === 'yes') {
                        chart_data['Apr'] += j.transferpoint;
                    }
                    else if (j.transferpointdate.getMonth() === 4 && j.Status === 'yes') {
                        chart_data['May'] += j.transferpoint;
                    }
                    else if (j.transferpointdate.getMonth() === 5 && j.Status === 'yes') {
                        chart_data['Jun'] += j.transferpoint;
                    }

                    else if (j.transferpointdate.getMonth() === 6 && j.Status === 'yes') {
                        chart_data['Jul'] += j.transferpoint;
                    }
                    else if (j.transferpointdate.getMonth() === 7 && j.Status === 'yes') {
                        chart_data['Aug'] += j.transferpoint;
                    }
                    else if (j.transferpointdate.getMonth() === 8 && j.Status === 'yes') {
                        chart_data['Sept'] += j.transferpoint;
                    }
                    else if (j.transferpointdate.getMonth() === 9 && j.Status === 'yes') {
                        chart_data['Oct'] += j.transferpoint;
                    }
                    else if (j.transferpointdate.getMonth() === 10 && j.Status === 'yes') {
                        chart_data['Nov'] += j.transferpoint;
                    }
                    else if (j.transferpointdate.getMonth() === 11 && j.Status === 'yes') {
                        chart_data['Dec'] += j.transferpoint;
                    }
               
                   
                }
            }
            if (j.sender in ranking_tmp && j.Status === 'yes') {
                ranking_tmp[j.sender][j.senderName] += j.transferpoint;
            }
            else if (j.Status === 'yes') {
                ranking_tmp[j.sender] = { [j.senderName]: j.transferpoint };
            }
        }

        console.log(chart_data);
        let redeem_dict = {};
        redeem_dict['redeemed'] = 0;
        redeem_dict['non_redeemed'] = 0;
        redeem_dict['total'] = 0;
        redeem_dict['refund'] = 0;
        for (const j of list) {
            if (j.transferpointdate.getFullYear() === currentYear) {

                if (j.Redeemed === 'yes') {
                    redeem_dict['redeemed'] += j.transferpoint;
                    redeem_dict['total'] += j.transferpoint;
                }
                else if (j.Redeemed === 'no') {
                    redeem_dict['non_redeemed'] += j.transferpoint;
                }
                 if(j.Status === 'no')
                {
                    redeem_dict['refund'] += j.transferpoint;
                    redeem_dict['total'] -= j.transferpoint


                }
                
            }
        } 

        const senderEntries = Object.entries(ranking_tmp);
        senderEntries.sort((a, b) => b[1][Object.keys(b[1])[0]] - a[1][Object.keys(a[1])[0]]);

        let ranking_data = [];


        for (let i = 0; i < Math.min(10, senderEntries.length); i++) { // min(10, sorted/length) it is prevent the sorted sender less than 10 person
            const [senderID, senderData] = senderEntries[i];
            ranking_data.push({ senderID, senderData });
        }

        // for (const item of ranking_data) {
        //     const senderID = item.senderID;
        //     const senderData = item.senderData;
        //     console.log("Sender ID:", senderID);
        //     console.log("Sender Data:", senderData);
        //     for (const [items,s] of Object.entries(senderData))
        //     {
        //         console.log(items,"d2uihdh2w");
        //     }
        // }

        // for (const [j, k] of ranking_data) {
        //     for (const [a, b] of Object.entries(k)) {
        //         console.log(b);
        //     }
        // }

        // console.log(ranking_data,'fisuiqwuidw')
        // console.log(chart_data); //checking
        data["month"] = chart_data;
        data["ranking"] = ranking_data;
        data['point'] = redeem_dict;
        res.json(data);
        return chart_data;
    } catch (error) {
        res.status(500).json({ error: 'error at code 115' });
    }
}
);


router.put("/redeemed/:year", async (req, res) => {
    console.log("work");
    let year = req.params.year;
    try {
        const list = await PointRecord.findAll({
            where: {
                recipientName: "admin",
                Redeemed: 'no',
                transferpointdate: {
                    [Sequelize.Op.substring]: year,
                }
            }
        });
        console.log(list.length);

        if (!list) {
            res.json(error);
            return;
        }
        else if(list.length ===0)
        {
            console.log("enterhere")
            res.status(500).json({ message: `no points to redeem` });
            return;

         
        }
let changeStatus;

        for (const j of list) {
             changeStatus = await PointRecord.update({ Redeemed: "yes" },
                {
                    where: { id: j.id }
                });

        }
        if (changeStatus == 1) {
            console.log("done");
            res.json({
                message: "Redeemed sucessfully"
            });
            return;
        }
      
        console.log(changeStatus);


    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error at code 115' });
    }

    // let num = 0;
    //         for (const j of list)
    //         {
    //             if (j.transferpointdate.getFullYear() === year) {
    //                 if(j.Redeemed === 'no')
    //                 {
    //                     num++;
    //                 }

    //             }}





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
    let Sender = await PointRecord.findAll({
        where: {
            [Sequelize.Op.or]: [{ sender: id }, { recipient: id }],

        },
        include: { model: User, as: 'user', attributes: ['name'] }
    });

    if (!Sender) {
        res.json([]);
        return;
    }

    res.json(Sender);





    // if (!pointrecord) {
    //     // let pointrecord = await PointRecord.findAll({
    //     //     where: { userId: id },
    //     //     include: { model: User, as: 'user', attributes: ['name'] }
    //     // });
    // }




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