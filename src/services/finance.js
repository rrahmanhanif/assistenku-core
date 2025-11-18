// src/services/finance.js
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// === Tambah saldo & catat transaksi ===
export async function processPayment(orderId, amount, mitraId, customerId) {
  try {
    // Tambahkan saldo ke mitra
    const mitraRef = doc(db, "users", mitraId);
    await updateDoc(mitraRef, { saldo: increment(amount) });

    // Catat history transaksi
    await addDoc(collection(db, "payments"), {
      orderId,
      mitraId,
      customerId,
      amount,
      type: "credit",
      createdAt: serverTimestamp(),
    });

  } catch (e) {
    console.error("Gagal memproses pembayaran:", e);
  }
}
