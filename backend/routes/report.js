const express = require("express");
const PDFDocument = require("pdfkit");

const Report = require("../models/report");
const Project = require("../models/project");
const Product = require("../models/product");

const router = express.Router();

router.get("/generate-report/:projectId/:productId", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const productId = req.params.productId;

    const projectData = await Project.findById(projectId).populate("user");

    if (!projectData) {
      return res.status(404).json({ message: "Project not found" });
    }

    const product = projectData.products.find((p) => p._id == productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // const { user } = projectData;
    const powerPeak = product.powerPeak;
    const orientation = product.orientation;
    const inclination = product.inclination;
    const area = product.area;

    // console.log(user.name, powerPeak, orientation, inclination, area);

    const reportData = await Report.find({
      project: projectId,
      product: productId,
    });

    //create a pdf document using pdfkit
    const doc = new PDFDocument();

    //set response header for the pdf file
    res.setHeader("Content-Type", "application/pdf; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=report.pdf`);

    //pipe the PDF to the responce
    doc.pipe(res);

    // Add content to the PDF
    doc.fontSize(18).text("Project Report", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Project: ${projectData.name}`);
    doc.moveDown();
    doc.fontSize(14).text(`Product: ${product.name}`);
    doc.moveDown();
    doc.fontSize(14).text(`Peak Power: ${powerPeak} watts`);
    doc.moveDown();
    doc.fontSize(14).text(`Orientation: ${orientation}`);
    doc.moveDown();
    doc.fontSize(14).text(`Inclination: ${inclination}`);
    doc.moveDown();
    doc.fontSize(14).text(`Area: ${area} m²`);
    doc.moveDown();
    doc.moveDown();
    doc.moveDown();

    //add the table with data and generated electricity data
    const tableTop = 300;
    const col1Width = 150;
    const col2Width = 200;
    const rowHeight = 20;

    doc.fontSize(12).text("Date", col1Width, tableTop, { align: "left" });
    doc.text("Generated Electricity (kW)", col1Width + col2Width, tableTop, {
      align: "left",
    });

    // Draw each row
    let yPos = tableTop + rowHeight;
    reportData.forEach((report) => {
      doc
        .fontSize(12)
        .fillColor("red")
        .text(report.date.toDateString(), col1Width, yPos, { align: "left" });
      doc.text(report.electricityGenerated, col1Width + col2Width, yPos, {
        align: "left",
      });
      yPos += rowHeight;
    });

    // Finelize the PDF and end the respomse
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).send("Error generating PDF");
  }
});

module.exports = router;
