const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
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
        phone: yup.string().trim().max(50).required(),
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
    data.phone = data.phone.trim();
    data.point = 10;

    // Check email
    let user = await User.findOne({
        where: { email: data.email }
    });
    if (user) {
        res.status(400).json({ message: "Email already exists." });
        return;
    }

    // Check phone number
    user = await User.findOne({
        where: { phone: data.phone }
    });
    if (user) {
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
        password: yup.string().trim().min(8).max(50).required(),
        
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
        phone: user.phone
    };
    let accessToken = sign(userInfo, process.env.APP_SECRET);
    res.json({
        accessToken: accessToken,
        user: userInfo
    });
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

module.exports = router;

router.get("/auth", validateToken, (req, res) => {
    let userInfo = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name
    };
    res.json({
        user: userInfo
    });
});

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

router.get("/:id", validateToken, async (req, res) => {
  try {
    // Get user ID from the token
    const userId = req.params.id;

    // Retrieve the user data from the database
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Extract the desired user information
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      point: user.point
    };

    res.json({ user: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
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
    phone: yup.string().trim().max(50).required(),
    point: yup.number().max(99999999).required(),
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
  data.phone = data.phone.trim();

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


router.delete("/:id", validateToken, async (req, res) => {
  const userId = req.params.id;
  // Check id not found
  let user = await User.findByPk(userId);
  if (!user) {
    res.sendStatus(404);
    return;
  }

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
  let checking = await User.findOne({ where: { id: phones } });
  if (!checking) {
      res.sendStatus(403);
      return;
  }

  let userId = checking.id;
  console.log("User ID:", userId,data,checking.point);

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
  if (data.email) {
      receiver = await User.findOne({
          where: { email: data.email }
      });
      data.phone = receiver.phone;
  }
  else if (data.phone) {
      receiver = await User.findOne({
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
      console.log("Error:", err);
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

module.exports = router;