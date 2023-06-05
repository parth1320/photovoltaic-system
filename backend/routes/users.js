const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/users");

const router = express.Router();

//User Registration
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User Already Exist" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, "4$98Ys2a#Pq1!bD3");

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "server error" });
  }
});

//User Login

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credenttial!" });
    }

    const passwordMatched = bcrypt.compare(password, user.password);

    if (!passwordMatched) {
      return res.status(400).json({ message: "Invalid Credenttial!" });
    }

    const token = jwt.sign({ userId: user._id }, "4$98Ys2a#Pq1!bD3");

    res.json({ token });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
