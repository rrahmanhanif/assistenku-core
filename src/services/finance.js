// src/services/finance.js
import { db } from "../firebase";
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp } from "firebase/firestore";

// === Pembayaran setelah order ===
export async function processPayment(orderId, data) {
  const { mitraId, customerId, customerPay, mitraShare, coreShare, gatewayFee } = data;

  // Update saldo mitra
  const mitraRef = doc(db, "users", mitraId);
  await updateDoc(mitraRef, { saldo: increment(mitraShare) });

  // Update saldo core
  const coreRef = doc(db, "core", "finance");
  await updateDoc(coreRef, { saldo: increment(coreShare) });

  // Catat transaksi
  await addDoc(collection(db, "transactions"), {
    orderId,
    mitraId,
    customerId,
    customerPay,
    mitraShare,
    coreShare,
    gatewayFee,
    type: "order",
    status: "success",
    timestamp: serverTimestamp(),
  });
}
