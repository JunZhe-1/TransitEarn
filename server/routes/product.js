const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, PointRecord, Sequelize, Product, ProductRecord } = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
const { use } = require('./pointrecord');
require('dotenv').config();
const dayjs = require('dayjs');



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
    let check1 = null;
    if (data.ARpic)
    {
        let testing = data.ARpic.split('.');
        if (testing[1] === "glb")
        {
            check1 = "yes";
        }
       
    
        
    }
    else if (!data.ARpic)
    {
        check1 = "no";
    }
  

    if (check[1] === "png" || check[1] === "jpg" ||check[1] === "jpeg") {
        if (check1 =="yes" || check1=="no")
        {

        

        // Trim string values
        data.productName = data.productName.trim();
        data.image = data.image.trim();
        data.category = data.category.trim();
        data.quantity = parseInt(data.quantity);
        data.prizePoint = parseInt(data.prizePoint);
        data.ARpic = data.ARpic.trim();


        // Create user
        let result = await Product.create(data);
        res.json(result);
        }
        else {
            res.status(400).json({ message: "only accept glb file" });
    
        }
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
        let check1 = null;
        if (data.ARpic)
        {
            check1 = data.ARpic.split('.');
        }
        if (check[1] === "png" || check[1] === "jpg" || check[1] ==="jpeg") {
            if (check1[1] === "glb" || check1 == null)
            {
    
            
      

            // Trim string values
            data.productName = data.productName.trim();
            data.image = data.image.trim();
            data.category = data.category.trim();
            data.quantity = parseInt(data.quantity);
            data.prizePoint = parseInt(data.prizePoint);
            data.ARpic = data.ARpic.trim();

            if (data.productName != product.productName || data.image != product.image || data.prizePoint != product.prizePoint|| data.category != product.category) {
                let result = await Product.update(data, {
                    where: { id: data.id } // Set the where condition using the primary key
                });
                res.json(result);
            }
            else {
                res.status(400).json({ message: "nothing change" });

            }
        }
        else{
            res.status(400).json({ message: "only accept glb file" });

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

router.post("/redeem/", validateToken, async (req, res) => {
    try {
        // const { id } = req.params;
        let data = req.body;
        console.log("id: ", data.productid, "Data: ", data.userid);

        const product = await Product.findByPk(data.productid);

        // Check if the product exists
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        // Check if the product is available
        if (product.quantity === 0) {
            res.status(400).json({ message: "Product is out of stock" });
            return;
        }
        const user = await User.findByPk(data.userid);

        // Perform the redeem action
        // Update the product quantity


        if (!user) {
            res.sendStatus(404);
            return;
        }
        else {
            if (user.point >= product.prizePoint) {
                console.log("enter here");
                let redeem = await Product.update(
                    { quantity: Sequelize.literal(`quantity - 1`) },
                    { where: { id: product.id } }
                );

                const points = user.point - product.prizePoint;
                user_redeemed = await User.update({ point: points },
                    {
                        where: { id: user.id }
                    });
                await redeem_record(product, user);
                if (redeem == 1 && user_redeemed == 1) {

                    res.json({ message: "Product redeemed successfully" });


                }
            }
            else {
                console.log("user does not have enough points")
                res.status(500).json({ message: `you don't have enough point` });
                return;
            }
        }

        // if (redeem == 1) {

        //     await redeem_record(data.productid, data.userid);
        // }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while redeeming the product" });
    }
});

router.get("/getuser/:id", async (req, res) => {
    let id = req.params.id;
    let pointrecord = await ProductRecord.findAll({
        where: { userId: id }
    });
    if (!pointrecord) {
        res.json(error);
        return;
    }
    res.json(pointrecord);
    // [], to ensure it is a array even it is a single

});

router.get("/usersearch/search", async (req, res) => {
    console.log("entwr");
    let userId = req.query.userId;
    let condition = {};
    let search = req.query.search;

    console.log(userId);


    if (userId == 'empty') {
        console.log("admin");

        if (search) {
            condition[Sequelize.Op.or] = [
                { userId: { [Sequelize.Op.like]: `%${search}%` } },
                { userphone: { [Sequelize.Op.like]: `%${search}%` } },
                { id: { [Sequelize.Op.like]: `%${search}%` } },
                { username: { [Sequelize.Op.like]: `%${search}%` } }


            ];
        }
        let pointrecord = await ProductRecord.findAll({
            where: condition,
            order: [['createdAt', 'DESC']]
        });
        if (!pointrecord) {
            res.json([]);
            return;
        }

        res.json(pointrecord);
    }
    else if (userId != null) {
        console.log("user");

        // let user = await PointRecord.findAll({
        //     where: {
        //         userId: userId

        //     },
        //     include: { model: User, as: 'user', attributes: ['name'] }
        // });

        // if (!user) {
        //     res.json([]);
        //     return;
        // }

        if (search) {
            condition[Sequelize.Op.or] = [
                { productname: { [Sequelize.Op.like]: `%${search}%` } },
                { usedpoint: { [Sequelize.Op.like]: `%${search}%` } }
                

            ];
        }
        condition.userId = userId;


        let usersearch = await ProductRecord.findAll({
            where: condition,
            order: [['createdAt', 'DESC']]
        });

        res.json(usersearch);

    }
});



router.get("/adminget", async (req, res) => {
    let pointrecord = await ProductRecord.findAll();
    if (!pointrecord) {
        res.json(error);
        return;
    }
    res.json(pointrecord);
    // [], to ensure it is a array even it is a single

});



// router.get("/adminget", async (req, res) => {
//     let id = req.params.id;

//     let pointrecord = await ProductRecord.findAll();
//     if (!pointrecord) {
//         res.json(error);
//         return;
//     }
//     res.json(pointrecord);
//     // [], to ensure it is a array even it is a single

// });



// router.get("/search", async (req, res) => {
//     let condition = {};
//     let search = req.query.search;
//     let userId = req.query.userId;
//     let userName = req.query.username;});



async function redeem_record(product, user) {


    // // get the name and phone but rename it to prevent crash.
    let { id: userid, name: user_name, phone: user_phone, address: user_address } = user;
    let { id: productid, productName: productname, prizePoint: points, category: cat } = product
    console.log(user_name, productname);



    const transfer_date = dayjs().format('D MMM YYYY HH:mm');



    try {
        let result = await ProductRecord.create({
            userphone: user_phone,
            username: user_name,
            productid: productid,
            productname: productname,
            productCat: cat,
            usedpoint: points,
            address: user_address,
            userId: userid,
            redeemdate: transfer_date

        });


        return result;
    }
    catch (error) {
        console.error(error);
        return error;
    }
}


module.exports = router;