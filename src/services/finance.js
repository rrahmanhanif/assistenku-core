// src/services/finance.js
import { db } from "./firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { sendEmail, pushPopup } from "./notify";

// === 🔹 TRANSFER OTOMATIS: PEMBAGIAN HASIL ===
export async function processPayment(orderId, total, mitraId, customerId) {
  try {
    const coreFee = total * 0.25; // 25% untuk core
    const mitraFee = total * 0.75; // 75% untuk mitra
    const gatewayFee = total * 0.02; // biaya gateway 2%

    const customerRef = doc(db, "customers", customerId);
    const mitraRef = doc(db, "mitra", mitraId);
    const coreRef = doc(db, "core", "saldo");

    const [customerSnap, mitraSnap, coreSnap] = await Promise.all([
      getDoc(customerRef),
      getDoc(mitraRef),
      getDoc(coreRef),
    ]);

    const customerSaldo = customerSnap.data().saldo - total;
    const mitraSaldo = mitraSnap.data().saldo + mitraFee;
    const coreSaldo = coreSnap.data().saldo + (coreFee - gatewayFee);

    await Promise.all([
      updateDoc(customerRef, { saldo: customerSaldo }),
      updateDoc(mitraRef, { saldo: mitraSaldo }),
      updateDoc(coreRef, { saldo: coreSaldo }),
    ]);

    // 🔔 Notifikasi realtime
    await Promise.all([
      sendEmail(
        "customer@email.com",
        "Pembayaran Berhasil",
        `Transaksi #${orderId} sebesar Rp${total.toLocaleString()} telah diproses.`
      ),
      sendEmail(
        "mitra@email.com",
        "Order Selesai",
        `Anda menerima Rp${mitraFee.toLocaleString()} dari order #${orderId}.`
      ),
      pushPopup(customerId, "customer", "Transaksi", "Pembayaran berhasil!"),
      pushPopup(mitraId, "mitra", "Pendapatan", "Saldo anda bertambah!"),
      pushPopup("admin", "core", "Notifikasi", `Order #${orderId} sukses.`),
    ]);

    return { success: true };
  } catch (error) {
    console.error("❌ Gagal memproses pembayaran:", error);
    return { success: false, error: error.message };
  }
}

// === 🔹 PENARIKAN DANA MITRA ===
export async function withdrawMitra(mitraId, amount) {
  try {
    const mitraRef = doc(db, "mitra", mitraId);
    const mitraSnap = await getDoc(mitraRef);
    const saldoSekarang = mitraSnap.data().saldo;

    if (saldoSekarang < amount) {
      throw new Error("Saldo tidak cukup");
    }

    const saldoBaru = saldoSekarang - amount;
    await updateDoc(mitraRef, { saldo: saldoBaru });

    // 🔔 Notifikasi realtime dan log penarikan
    await Promise.all([
      pushPopup(
        mitraId,
        "mitra",
        "Penarikan",
        `Penarikan Rp${amount.toLocaleString()} disetujui otomatis.`
      ),
      sendEmail(
        "mitra@email.com",
        "Penarikan Disetujui",
        `Dana Rp${amount.toLocaleString()} telah dikirim.`
      ),
      pushPopup(
        "admin",
        "core",
        "Penarikan",
        `Mitra ${mitraId} menarik Rp${amount.toLocaleString()}`
      ),
      updateDoc(doc(db, "withdrawLogs", mitraId), {
        lastWithdraw: new Date().toISOString(),
        amount,
        status: "approved",
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("❌ Gagal penarikan:", error);
    return { success: false, error: error.message };
  }
        }
