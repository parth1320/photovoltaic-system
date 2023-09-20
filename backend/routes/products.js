const express = require("express");

const Products = require("../models/product");
const Project = require("../models/project");

const router = express.Router();

router.post("/:projectId/products", async (req, res) => {
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

router.put("/products/:productId", async (req, res) => {
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
