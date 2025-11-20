// ===============================
// PRICING FINAL ASSISTENKU-CORE
// Lengkap: Per Jam, Harian, Mingguan, Bulanan
// Sudah termasuk makan, transport & fee dasar
// ===============================

export const PRICING = {
  ART: {
    name: "Asisten Rumah Tangga",
    perHour: { min: 20600, max: 23400, base: 22000 },
    daily:   { min: 149600, max: 170000, base: 160000 }, // 8 jam
    weekly:  { min: 888000, max: 1010000, base: 950000 }, // 6 hari
    monthly: { min: 3740000, max: 4250000, base: 4000000 }, // 26 hari
  },

  CAREGIVER: {
    name: "Caregiver / Pendamping Lansia",
    perHour: { min: 35000, max: 43000, base: 39000 },
    daily:   { min: 250000, max: 310000, base: 280000 },
    weekly:  { min: 1500000, max: 1860000, base: 1700000 },
    monthly: { min: 5600000, max: 6900000, base: 6200000 },
  },

  DRIVER: {
    name: "Driver / Supir Pribadi",
    perHour: { min: 35000, max: 45000, base: 40000 },
    daily:   { min: 250000, max: 320000, base: 290000 },
    weekly:  { min: 1500000, max: 1920000, base: 1700000 },
    monthly: { min: 5600000, max: 7000000, base: 6300000 },
  },

  PENJAGA_TOKO: {
    name: "Penjaga Toko",
    perHour: { min: 22000, max: 27000, base: 24500 },
    daily:   { min: 160000, max: 190000, base: 175000 },
    weekly:  { min: 960000, max: 1140000, base: 1050000 },
    monthly: { min: 4000000, max: 4900000, base: 4500000 },
  },

  LAINNYA: {
    name: "Lainnya (Asisten, Office Helper, dll)",
    perHour: { min: 25000, max: 32000, base: 28500 },
    daily:   { min: 180000, max: 220000, base: 200000 },
    weekly:  { min: 1080000, max: 1320000, base: 1200000 },
    monthly: { min: 4400000, max: 5500000, base: 5000000 },
  },
};

// ===============================
// Hitung Biaya Dasar
// type = perHour | daily | weekly | monthly
// duration → jam / hari / minggu / bulan
// ===============================

export function hitungBiayaDasar({ serviceKey, type, duration }) {
  const svc = PRICING[serviceKey];
  if (!svc) throw new Error("Unknown service type: " + serviceKey);

  const paket = svc[type];
  if (!paket) throw new Error("Unknown pricing type: " + type);

  let jumlah = paket.base;

  // Kalau per jam → dikalikan durasi
  if (type === "perHour") jumlah = paket.base * duration;

  return jumlah;
}

// ===============================
// Hitung lembur per jam
// Lembur = base per hour
// ===============================

export function hitungLembur({ serviceKey, overtimeHours }) {
  if (!overtimeHours || overtimeHours <= 0) return 0;

  const svc = PRICING[serviceKey];
  const lemburRate = svc.perHour.base;

  return lemburRate * overtimeHours;
    }
