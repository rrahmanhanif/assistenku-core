// src/core/orderFlow.js
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { hitungBiaya } from "./pricing";
import { processPayment } from "../services/finance";
import { sendEmail } from "../services/notify";

export async function buatPesanan(customerId, mitraId, payload) {
  const { serviceKey, paket, duration, lemburJam } = payload;

  // 1. HITUNG BIAYA FINAL
  const harga = hitungBiaya({ serviceKey, paket, duration, lemburJam });

  const biayaCustomer = harga.grandTotal;

  // 2. GATEWAY FEE (2%)
  const gatewayFee = Math.round(biayaCustomer * 0.02);

  let bayarCustomer = biayaCustomer + gatewayFee; // default: customer bayar 102%

  // Jika 2% < Rp 2000 → core yang bayar gateway
  const coreExtraFee = gatewayFee < 2000 ? gatewayFee : 0;
  if (coreExtraFee > 0) bayarCustomer = biayaCustomer;

  // 3. BAGI HASIL
  const mitraShare = Math.round(biayaCustomer * 0.75);
  const coreShare = Math.round(biayaCustomer * 0.25) - coreExtraFee;

  // 4. SAVE ORDER
  const orderRef = await addDoc(collection(db, "orders"), {
    customerId,
    mitraId,
    serviceKey,
    paket,
    duration,
    lemburJam,
    surge: harga.surge,
    biayaCustomer,
    gatewayFee,
    bayarCustomer,
    mitraShare,
    coreShare,
    timestamp: serverTimestamp(),
    status: "pending",
  });

  // 5. UPDATE SALDO
  await processPayment(orderRef.id, {
    mitraId,
    customerId,
    customerPay: bayarCustomer,
    mitraShare,
    coreShare,
    gatewayFee,
  });

  // 6. NOTIF EMAIL
  await sendEmail("admin@assistenku.com", "Order Baru", `Order ID: ${orderRef.id}`);

  return orderRef.id;
    }
