// src/utils/validateOrder.js
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

/**
 * Validasi order untuk mencegah order fiktif / ganda
 * @param {string} orderId - ID order unik
 * @param {string} customerId - ID customer pemesan
 * @param {string} mitraId - ID mitra penerima
 * @param {string} paymentMethod - cash / cashless
 * @param {number} total - total biaya
 */
export async function validateOrder(
  orderId,
  customerId,
  mitraId,
  paymentMethod,
  total
) {
  const orderRef = doc(db, "orders", orderId);
  const orderSnap = await getDoc(orderRef);

  // 🚨 Cegah order ganda
  if (orderSnap.exists()) {
    throw new Error("Order sudah pernah dibuat atau sedang berjalan!");
  }

  // 🔍 Validasi saldo customer jika cashless
  if (paymentMethod === "cashless") {
    const custRef = doc(db, "customers", customerId);
    const custSnap = await getDoc(custRef);
    const saldo = custSnap.data()?.saldo || 0;

    if (saldo < total) {
      throw new Error("Saldo customer tidak mencukupi untuk memesan layanan ini.");
    }

    // Kurangi saldo sementara (pre-authorization)
    await updateDoc(custRef, {
      saldo: saldo - total,
      holdAmount: total,
    });
  }

  // 🔒 Simpan status awal order di Core
  await setDoc(orderRef, {
    orderId,
    customerId,
    mitraId,
    total,
    paymentMethod,
    status: "pending",
    createdAt: serverTimestamp(),
  });

  return { success: true, message: "Order valid & siap diproses" };
}
