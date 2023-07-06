const axios = require("axios");
const cron = require("node-cron");

const Project = require("../models/project");
const Product = require("../models/product");
const Report = require("../models/report");
const product = require("../models/product");

const job = cron.schedule("*/10 * * * * *", async () => {
  try {
    const projects = await Project.find().populate("user").populate("products");

    if (!projects) {
      console.error("No projects found");
      return;
    }

    for (const project of projects) {
      const { user, products } = project;
      if (!user) {
        console.error("User not found for the project");
        continue;
      }

      if (!products) {
        console.error("No associated products found for the project");
        continue;
      }

      for (const product of products) {
        const powerPeak = product.powerPeak;
        const orientation = product.orientation;
        const inclination = product.inclination;
        const area = product.area;
        const longitude = product.longitude;
        const latitude = product.latitude;
        // console.log(latitude);
      }
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = job;

// const apiUrl = "https://history.openweathermap.org/data/2.5/history/city";

// const weatherData = async() => {

// }
