// ===============================================
// ORDER FLOW FINAL – ASSISTENKU CORE
// Sudah termasuk: pricing, lembur, surge B, gateway, bagi hasil
// ===============================================

import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { hitungBiayaDasar, hitungLembur } from "./pricing";

// =====================================================
// SURGE MODEL B (Demand-Supply Multiplier)
// -----------------------------------------------------
// Low Surge: orders > mitra * 1.2 → +10%
// Mid Surge: orders > mitra * 1.5 → +20%
// High Surge: orders > mitra * 2.0 → +35%
// =====================================================

export function hitungSurge(orders, mitraOnline) {
  if (mitraOnline <= 0) return { surge: 1, label: "No Mitra" };

  const ratio = orders / mitraOnline;

  if (ratio > 2.0) return { surge: 1.35, label: "HIGH SURGE" };
  if (ratio > 1.5) return { surge: 1.20, label: "MID SURGE" };
  if (ratio > 1.2) return { surge: 1.10, label: "LOW SURGE" };

  return { surge: 1.0, label: "NORMAL" };
}

// =====================================================
// GATEWAY RULES
// -----------------------------------------------------
// Jika biaya gateway ≤ 2% total:
//     ditanggung CORE (diambil dari jatah 25% core)
// Jika biaya gateway > 2%:
//     ditanggung CUSTOMER (ditambahkan ke total bayar)
// =====================================================

export function hitungGateway(totalBiaya) {
  const gatewayFee = Math.round(totalBiaya * 0.02); // 2%

  return {
    gatewayFee,
    isByCustomer: gatewayFee > totalBiaya * 0.02, // fallback, tetap hitung otomatis
  };
}

// =====================================================
// BAGI HASIL 75/25
// =====================================================

export function bagiHasil(totalSetelahSurge) {
  const mitra = Math.round(totalSetelahSurge * 0.75);
  const core = Math.round(totalSetelahSurge * 0.25);

  return { mitra, core };
}

// =====================================================
// HITUNG TOTAL ORDER FULL PIPELINE
// =====================================================

export function hitungOrderFinal({
  serviceKey,
  paket,
  duration = 1,
  overtimeHours = 0,
  ordersNow,
  mitraOnline,
}) {
  // --- Harga dasar ---
  const dasar = hitungBiayaDasar({ serviceKey, type: paket, duration });

  // --- Lembur (per jam) ---
  const lemburTotal = hitungLembur({ serviceKey, overtimeHours });

  // --- Surge ---
  const surgeObj = hitungSurge(ordersNow, mitraOnline);
  const totalSetelahSurge = Math.round((dasar + lemburTotal) * surgeObj.surge);

  // --- Bagi hasil ---
  const sharing = bagiHasil(totalSetelahSurge);

  // --- Gateway fee ---
  const gatewayFee = Math.round(totalSetelahSurge * 0.02);

  // Gateway ditanggung siapa?
  let customerPay = totalSetelahSurge;
  let coreReceive = sharing.core;

  if (gatewayFee <= Math.round(totalSetelahSurge * 0.02)) {
    // Gateway kecil → ditanggung core
    coreReceive -= gatewayFee;
  } else {
    // Gateway besar → ditanggung customer
    customerPay += gatewayFee;
  }

  return {
    dasar,
    lemburTotal,
    surge: surgeObj,
    totalSetelahSurge,
    gatewayFee,
    mitraReceive: sharing.mitra,
    coreReceive,
    customerPay,
  };
}

// =====================================================
// BUAT PESANAN – SIMPAN FIRESTORE
// =====================================================

export async function buatPesanan(customerId, mitraId, input) {
  const hasil = hitungOrderFinal(input);

  const data = {
    customerId,
    mitraId,

    serviceKey: input.serviceKey,
    paket: input.paket,
    duration: input.duration,
    overtimeHours: input.overtimeHours,

    pricing: {
      dasar: hasil.dasar,
      lembur: hasil.lemburTotal,
      surgeLabel: hasil.surge.label,
      surgeMultiplier: hasil.surge.surge,
    },

    gateway: {
      fee: hasil.gatewayFee,
    },

    pembayaran: {
      totalCustomer: hasil.customerPay,
      mitraReceive: hasil.mitraReceive,
      coreReceive: hasil.coreReceive,
    },

    waktuPesan: serverTimestamp(),
    status: "pending",
  };

  await addDoc(collection(db, "orders"), data);
  return data;
}
