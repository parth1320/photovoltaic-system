const calculateElectricityGeneration = (
  peakPower,
  orientation,
  inclination,
  area,
) => {
  // Calculate the Orientation Factor based on orientation
  let orientationFactor;
  switch (orientation) {
    case "N":
      orientationFactor = 0;
      break;
    case "S":
      orientationFactor = 1;
      break;
    case "W":
      orientationFactor = Math.cos(45 * (Math.PI / 180));
      break;
    case "E":
      orientationFactor = Math.cos(45 * (Math.PI / 180));
      break;
    default:
      orientationFactor = 1;
  }

  // Calculate the Inclination Factor (assuming a fixed value for the inclination)
  const inclinationFactor = Math.cos(inclination * (Math.PI / 180));

  // Calculate the electricity generation (in kilowatt-hours)
  const electricityGeneration =
    peakPower * orientationFactor * inclinationFactor * area;
  return electricityGeneration;
};

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

const efficiencyOfProduct = (nameOfProduct) => {
  let efficiency;
  switch (nameOfProduct) {
    case "Hanwha QxCells":
      efficiency = 0.2; //Efficiency: 19.6% to 21.2%
      break;
    case "Aiko":
      efficiency = 0.23; //efficiency of over 23 %
      break;
    case "First Solar": //25% cell efficiency by 2025
      efficiency = 0.25;
      break;
    case "JinkoSolar": //JinkoSolar has once again set a new record, achieving a maximum solar conversion efficiency of 26.4%
      efficiency = 0.26;
      break;

    default:
      efficiency = 0.25;
  }
  return efficiency;
};

module.exports = {
  calculateElectricityGeneration,
  calculatePowerOutput,
  efficiencyOfProduct,
};
