const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User, PointRecord , ProductRecord} = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
require('dotenv').config();
const dayjs = require('dayjs');



router.post("/register", async (req, res) => {
    console.log("hi");
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        name: yup.string().trim().matches(/^[a-z ,.'-]+$/i)
            .min(3).max(50).required(),
        email: yup.string().trim().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required(),
        point: yup.number().required().integer().min(0),
        phone: yup.number().required().integer().test('len', 'Phone number must be exactly 8 digits', (val) => val && val.toString().length == 8),
        address: yup.string().trim().min(3).max(1000).required(),
    })
    try {
        await validationSchema.validate(data,
            { abortEarly: false, strict: true });
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ errors: err.errors });
        return;
    }

    // Trim string values
    data.name = data.name.trim();
    data.email = data.email.trim().toLowerCase();
    data.password = data.password.trim();
    data.point = parseInt(data.point);
    data.phone = parseInt(data.phone);
    data.address = data.address.trim().toLowerCase();
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
    console.log("hello");

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
    console.log('hi');
    let userInfo = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
        point: req.user.point,
        phone: req.user.phone
    };
    res.json({
        user: userInfo
    });
});


router.get("/:id", async (req, res) => {
    try {
        let id = req.params.id;
        let data = await User.findByPk(id);
        let phone = data.phone;
        if (!data) {
            res.sendStatus(403);
            return;
        }
        res.json(data);
        console.log(data.email);

    } catch (error) {
        console.error("Error occurred while fetching data:", error);
    }


});

router.delete("/:id", validateToken, async (req, res) => {
    const userId = req.params.id;
    // Check id not found
    let user = await User.findByPk(userId);
    if (!user) {
      res.sendStatus(404);
      return;
    }
    await Delete(userId);

    
    let num = await User.destroy({
      where: { id: userId },
    });
    if (num == 1) {
      res.json({
        message: "Account was deleted successfully.",
      });
    } else {
      res.status(400).json({
        message: `Cannot delete account with id ${id}.`,
      });
    }
  });


  async function Delete(userId) {
    try{
    let user = await User.findByPk(userId);
    let clear_point = await ProductRecord.destroy({ where: { userId: userId } });
    let clearsender = await PointRecord.destroy({ where: { userId: userId } });
    let clearrecipient =  await PointRecord.destroy({ where: { recipient: user.phone } });

    }
    catch (error) {
        console.log(error);
    }



}





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

router.put('/Spending/:id', async (req,res)=>{  
console.log('hi');
let id = req.params.id;
console.log(id);
let addpoint = req.body.addpoint
if(id != null){
  let consumer = await User.findOne({where:{id:id}})
  if(! consumer){        
    res.sendStatus(403);
    return;}
    let point = parseInt(consumer.point)+parseInt(addpoint);
    let num = await User.update(
      {point: point},
      {
        where: { id: id },
    }
    );

    if (num == 1) {
      res.json({
        message: "point was updated successfully."
    });
    }
    else{res.status(400).json({
      message: `Cannot update user with id ${id}.`
  });
}
}
});

router.put("/transfer/:phones", async (req, res) => {
    let phones = req.params.phones;
    let data = req.body;
    console.log(data.phone);


    // check phone not found
    let checking = await User.findOne({ where: { phone: phones } });
    if (!checking) {
        res.sendStatus(403);
        return;
    }

    let userId = checking.id;

    // check request user id
    if (checking.id != userId) {
        res.sendStatus(403);
        return;
    }

    let validationSchema = yup.object().shape({
        point: yup.number().required().integer().min(0),
        phone: yup.number().required().integer().test('len', 'Phone number must be exactly 8 digits', (val) => val && val.toString().length == 8)
    });



    let receiver;
    if (data.email && data.phone == null) {
        receiver = await User.findOne({
            where: { email: data.email }
        });
        if (!isNaN(parseInt(receiver.phone))) {
            data.phone = parseInt(receiver.phone);
        }
        else{
            data.phone = parseInt(receiver.phone);
        }

        

    }
    else if (data.phone) {
        data.phone = parseInt(data.phone);
        receiver = await User.findOne({
            where: { phone:  data.phone}
        });

        if (!receiver) {
            res.status(400).json({ message: "Phone number does not exist" });
            return;
        }

        else if (receiver.phone == checking.phone) {
            res.status(400).json({ message: "This is your number!" });
            return;
        }
    }

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
        console.log(err);
        res.status(500).json({ message: " error", error: err });
        return;
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
            userId: checking.id,
            Redeemed:'no'
        });


        return result;
    }
    catch (error) {
        console.error(error);
        return error;
    }
}

// Retrieve all users
router.get('/', async (req, res) => {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
  });

  router.put("/:id", validateToken, async (req, res) => {
    const userId = req.params.id;
    // Check id not found
    let user = await User.findByPk(userId);
    if (!user) {
      res.sendStatus(404);
      return;
    }
  
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
      name: yup
        .string()
        .trim()
        .matches(/^[a-z ,.'-]+$/i)
        .min(3)
        .max(50)
        .required(),
      email: yup.string().trim().email().max(50).required(),
      phone: yup.number().required().integer().test('len', 'Phone number must be exactly 8 digits', (val) => val && val.toString().length == 8),
      point: yup.number().max(99999999).required(),
      address: yup.string().trim().max(50).min(6).required(),
    });
  
    // Allow password to be optional if it's an admin editing the account
    if (req.user.email !== "admin@gmail.com") {
      validationSchema = validationSchema.concat(
        yup.object({
          password: yup.string().trim().min(8).max(50).required(),
        })
      );
    }
  
    try {
      await validationSchema.validate(data, { abortEarly: false });
    } catch (err) {
      console.error(err);
      res.status(400).json({ errors: err.errors });
      return;
    }
  
    data.name = data.name.trim();
    data.email = data.email.trim().toLowerCase();
    data.phone = data.phone;
    data.address = data.address.trim();
  
    // Check email
    let checkuser = await User.findOne({
      where: { email: data.email },
    });
    if (checkuser && data.email != user.email) {
      res.status(400).json({ message: "Email already exists." });
      return;
    }
  
    // Check phone number
    checkuser = await User.findOne({
      where: { phone: data.phone },
    });
    if (checkuser && data.phone != user.phone) {
      res.status(400).json({ message: "Phone Number already exists." });
      return;
    }
  
    if (data.password) {
      // Hash password
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      // Remove password from the data object
      delete data.password;
    }
    await update_user(data, userId);
    await update_product(data, userId);
    let num = await User.update(data, {
      where: { id: userId },
    });
    if (num == 1) {
      res.json({
        message: "Account was updated successfully.",
      });
    } else {
      res.status(400).json({
        message: `Update failed.`,
      });
    }
  }); 




// Forgot Password - Send Reset Email
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ where: { email } });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour
  
      // Store the reset token and expiry in the user record
      user.resetToken = resetToken;
      user.resetTokenExpiry = resetTokenExpiry;
      await user.save();
  
      // Send password reset email
      const transporter = nodemailer.createTransport({
        service: "sendgrid",
        auth: {
          api_key:
            "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",
        },
      });
  
      const mailOptions = {
        from: 'your_email@example.com',
        to: email,
        subject: 'Password Reset',
        html: `<p>You have requested a password reset. Click the following link to reset your password:</p>
          <a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">Reset Password</a>`,
      };
  
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ message: 'Failed to send reset email' });
        }
  
        res.json({ message: 'Reset email sent' });
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Password Reset - Update Password
  router.post('/reset-password/:resetToken', async (req, res) => {
    const { resetToken } = req.params;
    const { password } = req.body;
  
    try {
      const user = await User.findOne({
        where: {
          resetToken,
          resetTokenExpiry: { $gt: Date.now() },
        },
      });
  
      if (!user) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Update the user's password
      user.password = hashedPassword;
      user.resetToken = null;
      user.resetTokenExpiry = null;
      await user.save();
  
      res.json({ message: 'Password reset successful' });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  async function update_user(information, userid) {
    let data = await User.findByPk(userid);
    let sender_records = await PointRecord.findAll({ where: { userId: userid } });
    let recipient_records = await PointRecord.findAll({ where: { recipient: data.phone } });

    if (sender_records) {
        for (let sender_record of sender_records) {
            await sender_record.update({ sender: information.phone ,
              senderName:information.name});
        }
        for (let recipient_record of recipient_records) {
          await recipient_record.update({ recipient: information.phone ,
            recipientName:information.name});
      }

        console.log("update record succesfull");
    } else {
        console.log("User or sender records not found.");
    } 




  }
  async function update_product(information, userid) {
    let data = await User.findByPk(userid);
    let user_records = await ProductRecord.findAll({ where: { userId: userid } });


    if (user_records) {
        for (let user_record of user_records) {
            await user_record.update({ userphone: information.phone ,
              username:information.name,
              address: information.address
            });
        }


        console.log("update record succesfull");
    } else {
        console.log("User or sender records not found.");
    } 




  }
module.exports = router;
