const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  powerPeak: {
    type: Number,
  },
  orientation: {
    type: String,
  },
  inclination: {
    type: Number,
  },
  area: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  latitude: {
    type: Number,
  },
});

module.exports = mongoose.model("Products", productSchema);
