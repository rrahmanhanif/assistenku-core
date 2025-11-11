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
 * Validasi order agar tidak fiktif atau ganda
 * ------------------------------------------
 * - Cegah order dobel
 * - Validasi saldo customer (cashless)
 * - Simpan order status awal: pending
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

  if (orderSnap.exists()) {
    throw new Error("Order sudah pernah dibuat atau sedang aktif.");
  }

  // Jika metode cashless → cek saldo customer
  if (paymentMethod === "cashless") {
    const custRef = doc(db, "customers", customerId);
    const custSnap = await getDoc(custRef);
    const saldo = custSnap.data()?.saldo || 0;

    if (saldo < total) {
      throw new Error("Saldo tidak mencukupi untuk memesan layanan ini.");
    }

    // tahan saldo sementara
    await updateDoc(custRef, {
      saldo: saldo - total,
      holdAmount: total,
    });
  }

  // Simpan status awal order
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
