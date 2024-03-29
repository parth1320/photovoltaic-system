const mongoose = require("mongoose");

const productSchema = require("./product").schema;

const projectSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  products: [productSchema],
});

module.exports = mongoose.model("Project", projectSchema);
