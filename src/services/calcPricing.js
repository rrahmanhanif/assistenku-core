// src/services/calcPricing.js
import { getDurationRate } from "./durationRates.js";

function round(v) {
  return Math.round(v);
}

/**
 * Hitung total order, lembur, surge, dan pembagian hasil
 */
export function calculateOrder(params = {}) {
  let {
    serviceKey = "SERVICE",
    durationHours = 8,
    baseRatePerHour = 100000,
    durationType = "HOURLY",
    demand = 1,
    supply = 1,
    coreFeePercent = 0.25,
    gatewayFeePercent = 0.015,
    gatewayThreshold = 0.02,
    overtimeRateMultiplier = 1.5,
    normalHours = 8,
    nightMultiplierPercent = 0,
    nightShift = false,
  } = params;

  // 🔹 Konversi tipe durasi (jam/harian/mingguan/bulanan)
  try {
    const dur = getDurationRate(durationType, baseRatePerHour);
    baseRatePerHour = dur.adjustedRate;
    durationHours = dur.estimatedHours;
  } catch (_) {}

  // 🔹 Hitung lembur
  const normalWorked = Math.min(durationHours, normalHours);
  const overtimeHours = Math.max(0, durationHours - normalHours);
  const baseNormal = normalWorked * baseRatePerHour;
  const overtimePerHour = baseRatePerHour * overtimeRateMultiplier;
  const overtimeTotal = overtimeHours * overtimePerHour;

  // 🔹 Subtotal sebelum surge
  const subtotalBeforeSurge = baseNormal + overtimeTotal;

  // 🔹 Surge (permintaan > penawaran)
  const effectiveSupply = supply <= 0 ? 1 : supply;
  const ratio = demand / effectiveSupply;
  const surgeMultiplier = ratio > 1 ? 1 + Math.min((ratio - 1) * 0.1, 1) : 1;
  const afterSurge = subtotalBeforeSurge * surgeMultiplier;

  // 🔹 Tambahan shift malam
  const nightExtra = nightShift ? afterSurge * nightMultiplierPercent : 0;
  const totalOrderAllIn = round(afterSurge + nightExtra);

  // 🔹 Gateway & pembagian hasil
  const gatewayPercent = Number(gatewayFeePercent) || 0;
  const threshold = Number(gatewayThreshold) || 0.02;
  const gatewayForSplit = Math.min(gatewayPercent, threshold);
  const gatewayCostForSplit = round(totalOrderAllIn * gatewayForSplit);

  const mitraAmount = round(totalOrderAllIn * (1 - coreFeePercent - gatewayForSplit));
  const coreGross = round(totalOrderAllIn * coreFeePercent);

  let customerExtraForGateway = 0;
  if (gatewayPercent > threshold) {
    const extraPercent = gatewayPercent - threshold;
    customerExtraForGateway = round(totalOrderAllIn * extraPercent);
  }

  const totalChargedToCustomer = totalOrderAllIn + customerExtraForGateway;
  const gatewayRecorded = round(totalOrderAllIn * gatewayPercent);

  let coreNet =
    gatewayPercent <= threshold
      ? round(coreGross - gatewayCostForSplit)
      : round(coreGross);

  return {
    serviceKey,
    durationType,
    durationHours,
    baseRatePerHour: round(baseRatePerHour),
    baseNormal: round(baseNormal),
    overtimeHours,
    overtimeTotal: round(overtimeTotal),
    surgeMultiplier,
    totalOrderAllIn,
    totalChargedToCustomer,
    mitraAmount,
    coreAmount: coreNet,
    gatewayRecorded,
    gatewayPercent,
    customerExtraForGateway,
    nightExtra: round(nightExtra),
  };
}
