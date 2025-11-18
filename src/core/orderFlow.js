// src/core/orderFlow.js

import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getDefaultRatePerHour } from "./pricing";

// === Fungsi utama: buat pesanan ===
export async function buatPesanan({
  customerId,
  customerName,
  layanan,
  durasiJam = 1,
}) {
  try {
    // Hitung harga otomatis dari pricing.js
    const rate = getDefaultRatePerHour(layanan);
    const total = rate * durasiJam;

    const newOrder = {
      customerId,
      customerName,
      layanan,
      durasiJam,
      rate,
      total,
      status: "menunggu",
      createdAt: serverTimestamp(),
    };

    await addDoc(collection(db, "orders"), newOrder);

    return { success: true, message: "Pesanan berhasil dibuat" };
  } catch (e) {
    console.error("Gagal membuat pesanan:", e);
    return { success: false, message: e.message };
  }
}
