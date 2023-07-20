const axios = require("axios");
const cron = require("node-cron");

const Project = require("../models/project");
const Report = require("../models/report");
const {
  calculatePowerOutput,
  calculateElectricityGeneration,
  efficiencyOfProduct,
} = require("./electricity");

const apiUrl = "https://history.openweathermap.org/data/2.5/history/city";
const apiKey = "5a032b93152809eb63bb7c23f246adef";

const job = cron.schedule("0 * * * *", async () => {
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
        const name = product.name;
        // const powerPeak = product.powerPeak;
        const orientation = product.orientation;
        const inclination = product.inclination;
        const area = product.area;
        const longitude = product.longitude;
        const latitude = product.latitude;

        const startingTime = Math.floor(project.createdAt / 1000);
        const endingTime = Math.floor(Date.now() / 1000);

        const peakPower = await calculatePowerpeak(
          latitude,
          longitude,
          startingTime,
          endingTime,
        );

        const efficiency = efficiencyOfProduct(name);

        const electricityGenerated = await calculateElectricityGeneration(
          peakPower,
          orientation,
          inclination,
          area,
        );

        const genratedElectricityBasedOnEfficienncy =
          electricityGenerated * efficiency;

        console.log(
          `Generated Electricity: ${genratedElectricityBasedOnEfficienncy.toFixed(
            2,
          )} kWh`,
        );

        //Get current date
        const currentDate = new Date().setHours(0, 0, 0, 0);

        let report = await Report.findOne({
          date: currentDate,
          project: project._id,
          product: product._id,
        });

        if (!report) {
          report = new Report({
            project: project._id,
            product: product._id,
            date: currentDate,
            electricityGenerated: 0,
          });
        }

        // Update and add generated electricity to electricityGenerated field per hour

        report.electricityGenerated += genratedElectricityBasedOnEfficienncy;

        await report.save();
      }
    }
  } catch (error) {
    console.error(error);
  }
});

const calculatePowerpeak = async (lat, lon, start, end) => {
  let powerPeak = 0;
  try {
    const response = await axios.get(apiUrl, {
      params: {
        lat,
        lon,
        start,
        end,
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

  powerPeak = powerPeak / 1000; // Peak power in kilowatts
  return powerPeak;
};

module.exports = { job, calculatePowerpeak };
