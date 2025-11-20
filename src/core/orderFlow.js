import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { hitungSemuaBiaya } from "./pricing";

// =============================================================
// ORDER FLOW ENTERPRISE
// =============================================================

export async function buatPesanan(customerId, mitraId, params) {
  const {
    serviceKey,
    paket, // hour | daily | weekly | monthly
    duration,
    lemburHours = 0,
    mitraCount,
    orderCount,
  } = params;

  // -----------------------------------
  // 1. HITUNG SURGE
  // -----------------------------------
  let surgeRate = 1;

  if (orderCount > mitraCount * 2.0) surgeRate = 1.35;
  else if (orderCount > mitraCount * 1.5) surgeRate = 1.20;
  else if (orderCount > mitraCount * 1.2) surgeRate = 1.10;

  // -----------------------------------
  // 2. HITUNG BIAYA DASAR + LEMBUR
  // -----------------------------------
  const pricing = hitungSemuaBiaya({
    serviceKey,
    paket,
    duration,
    lemburHours,
    surgeRate,
  });

  // pricing = { subtotal, surgeAmount, total, mitraGet, coreGet }

  // -----------------------------------
  // 3. SIMPAN ORDER
  // -----------------------------------
  const orderRef = await addDoc(collection(db, "orders"), {
    customerId,
    mitraId,
    ...params,
    pricing,
    surgeRate,
    createdAt: serverTimestamp(),
    status: "pending",
  });

  const orderId = orderRef.id;

  // -----------------------------------
  // 4. UPDATE SALDO MITRA & CORE
  // -----------------------------------
  await updateDoc(doc(db, "mitra_finance", mitraId), {
    amount: increment(pricing.mitraGet),
    lastUpdate: serverTimestamp(),
  });

  await updateDoc(doc(db, "core_finance", "main"), {
    amount: increment(pricing.coreGet),
    lastUpdate: serverTimestamp(),
  });

  // Surge masuk ke catatan core
  if (pricing.surgeAmount > 0) {
    await updateDoc(doc(db, "surge_finance", "main"), {
      amount: increment(pricing.surgeAmount),
    });
  }

  // Gateway dicatat, tidak dipotong
  await updateDoc(doc(db, "gateway_finance", "main"), {
    amount: increment(pricing.gatewayFee),
  });

  // -----------------------------------
  // 5. CATAT TRANSAKSI
  // -----------------------------------
  await addDoc(collection(db, "transactions"), {
    orderId,
    type: "income",
    amount: pricing.total,
    surgeRate,
    description: `Pembayaran order ${serviceKey}`,
    timestamp: serverTimestamp(),
    userEmail: "customer",
  });

  return {
    orderId,
    success: true,
    pricing,
  };
}
