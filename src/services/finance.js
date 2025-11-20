// ==========================================================
// finance.js — Sistem Keuangan Assistenku (Mitra • Core • Customer)
// FINAL ENTERPRISE VERSION
// ==========================================================

import {
  doc,
  updateDoc,
  increment,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

// ==========================================================
// Format tanggal untuk daily / monthly / yearly analytics
// ==========================================================
function getDateKeys() {
  const now = new Date();
  const daily = now.toISOString().split("T")[0]; // YYYY-MM-DD
  const monthly = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}`; // YYYY-MM
  const yearly = `${now.getFullYear()}`;
  return { daily, monthly, yearly };
}

// ==========================================================
// Catat transaksi global  (Super penting untuk audit & dashboard)
// ==========================================================
async function logTransaction(data) {
  await addDoc(collection(db, "transactions"), {
    ...data,
    timestamp: serverTimestamp(),
  });
}

// ==========================================================
// PROSES PEMBAYARAN ORDER
// - Tambah saldo mitra
// - Tambah saldo keuangan core
// - Catat customer spending
// - Buat transaksi global
// ==========================================================

export async function processOrderPayment(orderId, customerId, mitraId, detail) {
  // detail = data dari orderFlow.js:
  // {
  //   customerPay,
  //   mitraReceive,
  //   coreReceive,
  //   gatewayFee
  // }

  const { daily, monthly, yearly } = getDateKeys();

  // --------------------------
  // 1. Tambah saldo MITRA
  // --------------------------
  const mitraRef = doc(db, "mitra_finance", mitraId);
  await updateDoc(mitraRef, {
    saldo: increment(detail.mitraReceive),
    totalIn: increment(detail.mitraReceive),
    [`daily.${daily}`]: increment(detail.mitraReceive),
    [`monthly.${monthly}`]: increment(detail.mitraReceive),
    [`yearly.${yearly}`]: increment(detail.mitraReceive),
  });

  // --------------------------
  // 2. Tambah saldo CORE
  // --------------------------
  const coreRef = doc(db, "core_finance", "main-core");
  await updateDoc(coreRef, {
    saldo: increment(detail.coreReceive),
    totalIn: increment(detail.coreReceive),
    gateway: increment(detail.gatewayFee),          // catat total gateway
    [`daily.${daily}`]: increment(detail.coreReceive),
    [`monthly.${monthly}`]: increment(detail.coreReceive),
    [`yearly.${yearly}`]: increment(detail.coreReceive),
  });

  // --------------------------
  // 3. Catat belanja CUSTOMER
  // --------------------------
  const custRef = doc(db, "customer_finance", customerId);
  await updateDoc(custRef, {
    totalOut: increment(detail.customerPay),
    [`daily.${daily}`]: increment(detail.customerPay),
    [`monthly.${monthly}`]: increment(detail.customerPay),
    [`yearly.${yearly}`]: increment(detail.customerPay),
  });

  // --------------------------
  // 4. Transaksi Global (untuk admin finance)
  // --------------------------
  await logTransaction({
    orderId,
    customerId,
    mitraId,
    customerPay: detail.customerPay,
    mitraReceive: detail.mitraReceive,
    coreReceive: detail.coreReceive,
    gatewayFee: detail.gatewayFee,
    type: "order_payment",
    description: `Pembayaran order ${orderId}`,
  });

  return true;
}

// ==========================================================
// WITHDRAW SYSTEM (Penarikan Saldo Mitra)
// Biaya gateway saat pencairan ditanggung Mitra (SOP Indonesia)
// ==========================================================

export async function withdrawMitra(mitraId, amount) {
  const { daily, monthly, yearly } = getDateKeys();

  if (amount <= 0) throw new Error("Nominal penarikan tidak valid.");

  const gatewayFee = Math.round(amount * 0.015); // biaya payout ±1.5%
  const totalPotong = amount + gatewayFee;

  const mitraRef = doc(db, "mitra_finance", mitraId);
  await updateDoc(mitraRef, {
    saldo: increment(-totalPotong),
    totalOut: increment(amount),
    payoutGateway: increment(gatewayFee),

    [`daily.${daily}`]: increment(-totalPotong),
    [`monthly.${monthly}`]: increment(-totalPotong),
    [`yearly.${yearly}`]: increment(-totalPotong),
  });

  // Log transaksi
  await logTransaction({
    mitraId,
    amount,
    gatewayFee,
    totalPotong,
    type: "withdraw",
    description: `Penarikan saldo mitra (${mitraId})`,
  });

  return {
    success: true,
    amount,
    gatewayFee,
    totalPotong,
  };
}

// ==========================================================
// Admin Finance Menyetujui Payout (manual approval)
// ==========================================================

export async function approvePayout(payoutId, mitraId, amount) {
  await logTransaction({
    payoutId,
    mitraId,
    amount,
    type: "payout_approved",
    description: `Payout untuk mitra ${mitraId} telah disetujui`,
  });

  return true;
    }
