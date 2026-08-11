// Мок-данные Zero Lake — охлаждение ЦОД, ИИ, экослед (прототип)

const r = (base, range) => base + (Math.random() * range * 2 - range);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export const getWaterData = (period = 'day') => {
  const multipliers = { hour: 1, day: 24, month: 24 * 30 };
  const mult = multipliers[period] || 24;
  const baseLiters = period === 'hour' ? 120 : period === 'day' ? 2800 : 84000;
  const liters = Math.round(clamp(r(baseLiters, baseLiters * 0.15), baseLiters * 0.7, baseLiters * 1.3));
  const trend = [r(80, 20), r(90, 15), r(85, 20), r(95, 10), r(100, 5), r(98, 8), r(102, 5)];
  return {
    liters,
    period: period === 'hour' ? 'час' : period === 'day' ? 'сутки' : 'месяц',
    periodKey: period,
    trend, // проценты от среднего для мини-графика
    realTimeLpm: Math.round(r(2.1, 0.5) * 10) / 10,
    lastUpdate: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  };
};

export const getEnergyData = () => {
  const pumps = Math.round(r(12.5, 2) * 10) / 10;
  const heatExchangers = Math.round(r(8.2, 1.5) * 10) / 10;
  const total = Math.round((pumps + heatExchangers) * 10) / 10;
  const traditionalKwh = total * 1.35;
  const savingsPercent = Math.round(clamp(r(28, 5), 20, 38));
  const savingsKwh = Math.round((traditionalKwh - total) * 10) / 10;
  return {
    pumpsKwh: pumps,
    heatExchangersKwh: heatExchangers,
    totalKwh: total,
    traditionalKwh: Math.round(traditionalKwh * 10) / 10,
    savingsPercent,
    savingsKwh,
    trend: [pumps * 0.9, pumps * 1.05, pumps * 0.95, pumps, pumps * 1.02, pumps * 0.98, pumps * 1.01],
    lastUpdate: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  };
};

export const getThermalEfficiency = () => {
  const percent = Math.round(clamp(r(78, 8), 55, 95));
  let status = 'optimal';
  if (percent < 65) status = 'critical';
  else if (percent < 75) status = 'warning';
  return {
    percent,
    status, // optimal | warning | critical
    heatRemovedKwh: Math.round(r(95, 15) * 10) / 10,
    energyConsumedKwh: Math.round(r(12, 2) * 10) / 10,
    lastUpdate: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  };
};

export const getCarbonData = () => {
  const co2PerRequest = Math.round(r(0.42, 0.12) * 100) / 100;
  const requestsToday = Math.round(r(12500, 2500));
  const co2Today = Math.round(co2PerRequest * requestsToday);
  const threshold = 6000;
  const exceedsThreshold = co2Today > threshold;
  const daily = [4.2, 4.8, 4.5, 5.1, 4.9, 5.3, 5.0].map(v => Math.round(v * 1000) / 1000);
  const weekly = [32, 35, 33, 36, 34];
  const monthly = [142, 148, 155];
  return {
    co2PerRequestG: co2PerRequest,
    requestsToday,
    co2TodayKg: Math.round(co2Today / 1000 * 100) / 100,
    exceedsThreshold,
    thresholdKg: threshold / 1000,
    daily,
    weekly,
    monthly,
    loadReduced: exceedsThreshold,
    lastUpdate: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  };
};

export const getFootprintSummary = () => {
  const aiRequests = Math.round(r(12500, 2000));
  const bottlesEquivalent = Math.floor(aiRequests / 50);
  const co2Kg = Math.round(r(5.2, 1) * 100) / 100;
  const carKmEquivalent = Math.round(co2Kg * 6); // ~6 km per kg CO2
  const tips = [
    'Запускайте тяжёлые модели в ночные часы — ниже углеродный след сети.',
    'Используйте кэш ответов: повторные запросы почти не потребляют энергии.',
    'Выбирайте регион дата-центра с ВИЭ — до −40% CO₂.',
  ];
  return {
    aiRequests,
    bottlesEquivalent,
    co2Kg,
    carKmEquivalent,
    tips,
    lastUpdate: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  };
};

export const getForecast = () => {
  const waterForecast = { nextDay: 2900, nextWeek: 20500, nextMonth: 88000 };
  const carbonForecast = { nextDay: 5.5, nextWeek: 38, nextMonth: 165 };
  const recommendations = [
    'При росте нагрузки на 20% переключите часть запросов на ночь — экономия воды до 15%.',
    'Текущий КПД в норме. Рекомендуется плановое ТО теплообменников через 14 дней.',
    'Для снижения CO₂: приоритет пула с ВИЭ в настройках маршрутизации.',
  ];
  return {
    waterForecast,
    carbonForecast,
    recommendations,
    scenarioOptimal: 'Ночной пик + пул ВИЭ: −25% воды, −30% CO₂.',
    lastUpdate: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
  };
};
