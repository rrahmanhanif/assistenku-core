// src/core/orderFlow.js
import { db } from "../firebase";
import { collection, addDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { hitungBiaya } from "./pricing";
import { processPayment } from "./finance";
import { sendEmail, pushPopup } from "./notify";

/**
 * Buat pesanan baru oleh customer
 */
export async function buatPesanan(customerId, mitraId, params) {
  const biaya = hitungBiaya(params);

  // Simpan order ke Firestore
  const orderRef = await addDoc(collection(db, "orders"), {
    customerId,
    mitraId,
    ...biaya,
    status: "pending",
    createdAt: new Date().toISOString(),
  });

  await sendEmail(
    "customer@email.com",
    "Pesanan Diterima",
    `Order anda berhasil dibuat. Total biaya: Rp${biaya.grandTotal.toLocaleString()}`
  );

  await pushPopup(mitraId, "mitra", "Order Baru", "Anda mendapat pesanan baru!");
  return orderRef.id;
}

/**
 * Konfirmasi pekerjaan dimulai oleh Mitra
 */
export async function mulaiKerja(orderId) {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, { status: "in_progress", startAt: new Date().toISOString() });
}

/**
 * Selesaikan pekerjaan
 */
export async function selesaikanKerja(orderId) {
  const orderRef = doc(db, "orders", orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) throw new Error("Order tidak ditemukan");

  const order = orderSnap.data();
  await processPayment(orderId, order.total, order.mitraId, order.customerId);

  await updateDoc(orderRef, {
    status: "completed",
    endAt: new Date().toISOString(),
  });

  await sendEmail(
    "customer@email.com",
    "Pekerjaan Selesai",
    `Order #${orderId} telah selesai. Terima kasih telah menggunakan Assistenku!`
  );

  await pushPopup(order.mitraId, "mitra", "Saldo Bertambah", "Kerja selesai, saldo ditambahkan!");
}

/**
 * Pembatalan pesanan
 */
export async function batalkanPesanan(orderId) {
  const orderRef = doc(db, "orders", orderId);
  const orderSnap = await getDoc(orderRef);
  if (!orderSnap.exists()) throw new Error("Order tidak ditemukan");

  const order = orderSnap.data();
  const biayaCancel = order.total * 0.02;
  await updateDoc(orderRef, { status: "cancelled", biayaCancel });

  await sendEmail(
    "customer@email.com",
    "Pembatalan Dikenakan Biaya",
    `Order #${orderId} dibatalkan, biaya pembatalan Rp${biayaCancel.toLocaleString()}`
  );

  await pushPopup(order.customerId, "customer", "Pembatalan", "Order dibatalkan, saldo dipotong biaya 2%.");
  }
