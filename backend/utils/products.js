const Product = require("../models/product");

const createProducts = async () => {
  try {
    const existingProducts = await Product.find();
    if (existingProducts.length > 0) {
      console.log("Products already exist");
      return;
    }
    const products = [
      {
        name: "Hanwha QxCells",
        powerPeak: 300,
        orientation: "N",
        inclination: 30,
        area: 1.5,
        longitude: 123.456,
        latitude: 45.678,
      },
      {
        name: "First Solar",
        powerPeak: 280,
        orientation: "S",
        inclination: 25,
        area: 2,
        longitude: 123.456,
        latitude: 45.678,
      },
      {
        name: "Aiko",
        powerPeak: 320,
        orientation: "E",
        inclination: 20,
        area: 1.8,
        longitude: 123.456,
        latitude: 45.678,
      },
      {
        name: "JinkoSolar",
        powerPeak: 310,
        orientation: "W",
        inclination: 35,
        area: 2.2,
        longitude: 123.456,
        latitude: 45.678,
      },
    ];

    await Product.insertMany(products);
    console.log("Products are successfully saved in database!");
  } catch (error) {
    console.error(error);
  }
};

module.exports = createProducts;
