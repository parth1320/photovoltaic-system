const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { body, param } = require("express-validator");
const rateLimit = require("express-rate-limit");

const User = require("../models/users");
const verifyToken = require("../middleware/authorization");
const { handleValidationErrors } = require("../middleware/validation");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { message: "Too many attempts from this IP, please try again after 15 minutes." },
});

//User Registration
router.post("/register", authLimiter, [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  handleValidationErrors
], async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User Already Exist" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

//User Login

router.post("/login", authLimiter, [
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors
], async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credenttial!" });
    }

    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return res.status(400).json({ message: "Invalid Credenttial!" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({ token, id: user._id });
  } catch (error) {
    console.error(error);
  }
});

//User get data

router.get("/user/:id", verifyToken, [
  param("id").isMongoId().withMessage("Invalid User ID"),
  handleValidationErrors
], async (req, res) => {
  try {
    const userId = req.params.id;

    // console.log(userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
  }
});

router.post("/userUpdate/:id", verifyToken, [
  param("id").isMongoId().withMessage("Invalid User ID"),
  body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Invalid email format").normalizeEmail(),
  handleValidationErrors
], async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true },
    );
    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
  }
});

router.delete("/delete/:id", verifyToken, [
  param("id").isMongoId().withMessage("Invalid User ID"),
  handleValidationErrors
], async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.json({ error: "User Not Found" });
    }
    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
