const express = require("express");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const Report = require("../models/report");

const router = express.Router();

router.get("/generate-report/:projectId/:productId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const productId = req.params.productId;

    const reportData = Report.find({
      project: projectId,
      product: productId,
    }).populate("product");

    res.status(201).send(reportData);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
