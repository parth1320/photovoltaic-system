const express = require("express");

const Products = require("../models/product");

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const products = await Products.find({});
    if (!products) {
      res.status(404).json({ message: "Products not found!" });
    }
    res.status(201).json(products);
  } catch (error) {
    res.status(505).json({ messagr: "Server Error!" });
  }
});

module.exports = router;
