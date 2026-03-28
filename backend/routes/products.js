const express = require("express");
const { body, param } = require("express-validator");
const { handleValidationErrors } = require("../middleware/validation");

const Products = require("../models/product");
const Project = require("../models/project");

const router = express.Router();

router.post("/:projectId/products", [
  param("projectId").isMongoId().withMessage("Invalid Project ID"),
  body("name").trim().notEmpty().withMessage("Product name is required"),
  body("powerPeak").optional().isNumeric(),
  body("orientation").optional().isString().trim(),
  body("inclination").optional().isNumeric(),
  body("area").optional().isNumeric(),
  body("latitude").isFloat({ min: -90, max: 90 }).withMessage("Invalid GPS latitude"),
  body("longitude").isFloat({ min: -180, max: 180 }).withMessage("Invalid GPS longitude"),
  handleValidationErrors
], async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const {
      name,
      powerPeak,
      orientation,
      inclination,
      area,
      latitude,
      longitude,
    } = req.body;

    const newProduct = new Products({
      name,
      powerPeak,
      orientation,
      inclination,
      area,
      latitude,
      longitude,
    });

    //save product to database
    // await newProduct.save();

    //add the product to the project's products Array

    const project = await Project.findById(projectId);
    project.products.push(newProduct);
    await project.save();

    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

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

router.put("/products/:productId", [
  param("productId").isMongoId().withMessage("Invalid Product ID"),
  body("powerPeak").optional().isNumeric(),
  body("orientation").optional().isString().trim(),
  body("inclination").optional().isNumeric(),
  body("area").optional().isNumeric(),
  body("latitude").optional().isFloat({ min: -90, max: 90 }).withMessage("Invalid GPS latitude"),
  body("longitude").optional().isFloat({ min: -180, max: 180 }).withMessage("Invalid GPS longitude"),
  handleValidationErrors
], async (req, res) => {
  const { productId } = req.params;
  const { powerPeak, orientation, inclination, area, longitude, latitude } =
    req.body;
  try {
    const product = await Products.findById(productId);
    console.log(product);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    product.powerPeak = powerPeak;
    product.orientation = orientation;
    product.inclination = inclination;
    product.area = area;
    product.longitude = longitude;
    product.latitude = latitude;

    await product.save();
    res.status(200).json({ message: "Product Updated Successfully", product });
  } catch (error) {
    res.status(500).json({ message: "Server Error!" });
  }
});

module.exports = router;
