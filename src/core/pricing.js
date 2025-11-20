// src/core/pricing.js
import { getSurgeMultiplier } from "./surge";

export const PRICING = {
  ART: {
    hour: { min: 20600, max: 23400, default: 22000 },
    daily: { min: 149600, max: 170000, default: 160000 },
    weekly: { min: 888000, max: 1010000, default: 950000 },
    monthly: { min: 3740000, max: 4250000, default: 4000000 },
  },
  CAREGIVER: {
    hour: { min: 35000, max: 43000, default: 39000 },
    daily: { min: 250000, max: 310000, default: 275000 },
    weekly: { min: 1500000, max: 1860000, default: 1650000 },
    monthly: { min: 5600000, max: 6900000, default: 6300000 },
  },
  DRIVER: {
    hour: { min: 35000, max: 45000, default: 40000 },
    daily: { min: 250000, max: 320000, default: 280000 },
    weekly: { min: 1500000, max: 1920000, default: 1650000 },
    monthly: { min: 5600000, max: 7000000, default: 6500000 },
  },
  PENJAGA_TOKO: {
    hour: { min: 22000, max: 27000, default: 24500 },
    daily: { min: 160000, max: 190000, default: 175000 },
    weekly: { min: 960000, max: 1140000, default: 1050000 },
    monthly: { min: 4000000, max: 4900000, default: 4500000 },
  },
  LAINNYA: {
    hour: { min: 25000, max: 32000, default: 28500 },
    daily: { min: 180000, max: 220000, default: 200000 },
    weekly: { min: 1080000, max: 1320000, default: 1200000 },
    monthly: { min: 4400000, max: 5500000, default: 5000000 },
  },
};

// === HITUNG BIAYA ===
export function hitungBiaya({ serviceKey, paket, duration, lemburJam = 0 }) {
  const s = PRICING[serviceKey];
  if (!s) throw new Error("Unknown serviceKey " + serviceKey);

  const surge = getSurgeMultiplier();

  // Harga dasar
  const base = s[paket].default;

  // Total order
  const biaya = base * surge;

  // Lembur = 1.25x rate per jam + surge
  const lemburRate = s.hour.default * 1.25 * surge;
  const lemburTotal = lemburJam * lemburRate;

  // Total bayar
  const grandTotal = Math.round(biaya + lemburTotal);

  return {
    biaya: Math.round(biaya),
    lemburTotal: Math.round(lemburTotal),
    grandTotal,
    surge,
  };
}
