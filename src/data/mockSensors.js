// Имитация данных с датчиков умной юрты (прототип — данные не с реальных датчиков)

const randomOffset = (base, range) => base + (Math.random() * range * 2 - range);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export const getClimateData = () => {
  const temp = clamp(randomOffset(21.5, 1.5), 18, 26);
  const humidity = Math.round(clamp(randomOffset(45, 8), 30, 65));
  return {
    temperature: Math.round(temp * 10) / 10,
    humidity,
    ventilationOn: temp > 22 || humidity > 50,
    heaterOn: temp < 20,
    energySavingPercent: Math.round(clamp(randomOffset(25, 5), 18, 32)),
    lastUpdate: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
};

export const getAirData = () => {
  const co2 = Math.round(clamp(randomOffset(620, 120), 400, 1400));
  let co2Status = 'normal';
  if (co2 > 1000) co2Status = 'danger';
  else if (co2 > 800) co2Status = 'warning';
  const voc = Math.round(clamp(randomOffset(0.35, 0.15), 0.1, 0.8) * 100) / 100;
  return {
    co2,
    co2Status,
    voc,
    vocStatus: voc > 0.5 ? 'warning' : 'normal',
    lastUpdate: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
};

export const getWaterData = () => {
  const tank = clamp(randomOffset(72, 5), 20, 98);
  const consumption = Math.round(clamp(randomOffset(45, 8), 20, 80));
  return {
    flowRate: Math.round(clamp(randomOffset(2.1, 1.2), 0, 5) * 10) / 10,
    totalConsumptionToday: consumption,
    tankLevelPercent: Math.round(tank),
    pumpOn: tank < 30,
    greyWaterReusePercent: Math.round(clamp(randomOffset(40, 8), 25, 55)),
    lastUpdate: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
};
