const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  powerPeak: {
    type: Number,
    required: true,
  },
  orientation: {
    type: String,
    required: true,
  },
  inclination: {
    type: Number,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
