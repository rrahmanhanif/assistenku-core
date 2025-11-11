// src/core/pricing.js

/**
 * Hitung total biaya layanan Assistenku
 * @param {Object} params
 * @param {"jam"|"harian"|"mingguan"|"bulanan"} params.tipe
 * @param {number} params.durasi
 * @param {boolean} params.isRamai - true jika permintaan sedang tinggi
 * @param {boolean} params.isLembur - true jika melewati jam kerja normal
 * @param {boolean} params.isCancel - true jika customer membatalkan
 * @param {number} params.baseRate - tarif dasar per jam/hari/minggu/bulan
 * @returns {Object} rincian biaya
 */
export function hitungBiaya({
  tipe,
  durasi,
  isRamai,
  isLembur,
  isCancel,
  baseRate,
}) {
  let total = baseRate * durasi;

  // 🔹 Lembur (x1.5 tiap jam lembur)
  if (isLembur) total *= 1.5;

  // 🔹 Surge demand (kenaikan 20% jika ramai)
  if (isRamai) total *= 1.2;

  // 🔹 Pembatalan (2% dari total jika dibatalkan <24 jam)
  let biayaCancel = isCancel ? total * 0.02 : 0;

  // 🔹 Biaya gateway (1–2%)
  const gatewayFee = total * 0.015; // rata-rata 1.5%

  return {
    tipe,
    durasi,
    total,
    biayaCancel,
    gatewayFee,
    grandTotal: total + gatewayFee + biayaCancel,
  };
}
