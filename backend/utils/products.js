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
      },
      {
        name: "First Solar",
      },
      {
        name: "Aiko",
      },
      {
        name: "JinkoSolar",
      },
    ];

    await Product.insertMany(products);
    console.log("Products are successfully saved in database!");
  } catch (error) {
    console.error(error);
  }
};

module.exports = createProducts;
