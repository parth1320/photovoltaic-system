const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  electricityGenerated: {
    type: Number,
    required: true,
  },
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
