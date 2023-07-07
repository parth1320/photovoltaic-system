const axios = require("axios");
const cron = require("node-cron");

const Project = require("../models/project");
const Product = require("../models/product");
const Report = require("../models/report");
const product = require("../models/product");
const { calculatePowerOutput } = require("./electricity");

const apiUrl = "https://history.openweathermap.org/data/2.5/history/city";
const apiKey = "5a032b93152809eb63bb7c23f246adef";

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

        const peakPower = calculatePowerpeak(latitude, longitude);
      }
    }
  } catch (error) {
    console.error(error);
  }
});

const calculatePowerpeak = async (lat, lon) => {
  let powerPeak = 0;
  try {
    const response = await axios.get(apiUrl, {
      params: {
        lat: "50.828287931512705",
        lon: "12.918790193543675",
        appid: apiKey,
      },
    });
    const weatherData = response.data.list;
    for (let i = 0; i < weatherData.length; i++) {
      let date = new Date(weatherData[i].dt * 1000);
      const timeofday = date.getHours();
      const temperature = weatherData[i].main.temp;

      powerPeak = calculatePowerOutput(temperature, timeofday);
    }
  } catch (error) {
    console.error(error);
  }
  return powerPeak;
};

module.exports = { job, calculatePowerpeak };
