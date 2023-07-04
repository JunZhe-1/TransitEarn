const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models');
const yup = require("yup");
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/auth');
require('dotenv').config();

router.post("/register", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        name: yup.string().trim().matches(/^[a-z ,.'-]+$/i)
            .min(3).max(50).required(),
        email: yup.string().trim().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required(),
        phoneNumber: yup.string().trim().max(50).required(),
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
    data.phoneNumber = data.phoneNumber.trim();
    data.points = 0;

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
        where: { phoneNumber: data.phoneNumber }
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
        name: user.name
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
      phoneNumber: user.phoneNumber,
      points: user.points
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
    phoneNumber: yup.string().trim().max(50).required(),
    points: yup.number().max(99999999).required(),
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
  data.phoneNumber = data.phoneNumber.trim();

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
    where: { phoneNumber: data.phoneNumber },
  });
  if (checkuser && data.phoneNumber != user.phoneNumber) {
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

module.exports = router;