const calculateElectricityGeneration = (
  peakPower,
  orientation,
  inclination,
  area,
  longitude,
  latitude,
) => {};

const calculatePowerOutput = (temp, timeofday) => {
  let solarIrradiance = 0;
  if (timeofday >= 6 && timeofday <= 18) {
    if (temp > 298.15) {
      solarIrradiance = 1000;
    } else {
      solarIrradiance = 800;
    }
  }
  return solarIrradiance;
};

module.exports = { calculateElectricityGeneration, calculatePowerOutput };
