// src/services/durationRates.js
// Konversi durasi kerja & diskon per paket

export const DURATION_OPTIONS = {
  HOURLY: { label: "Per Jam", hours: 1, multiplier: 1 },
  DAILY: { label: "Harian", hours: 8, multiplier: 0.95 },     // 5 % diskon
  WEEKLY: { label: "Mingguan", hours: 8 * 6, multiplier: 0.9 }, // 10 % diskon
  MONTHLY: { label: "Bulanan", hours: 8 * 24, multiplier: 0.85 }, // 15 % diskon
};

export function getDurationRate(type, baseRatePerHour) {
  const dur = DURATION_OPTIONS[type];
  if (!dur) throw new Error("Unknown duration type: " + type);
  return {
    type,
    estimatedHours: dur.hours,
    adjustedRate: Math.round(baseRatePerHour * dur.multiplier),
    label: dur.label,
  };
}
