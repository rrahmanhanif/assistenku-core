// src/api/payoutService.js
import axios from "axios";
import { db } from "../firebase";
import { doc, updateDoc, addDoc, collection } from "firebase/firestore";

const FLIP_SECRET = import.meta.env.VITE_FLIP_SECRET || "your-flip-secret";
const FLIP_URL = "https://bigflip.id/api/v2/disbursement";

export const payoutToMitra = async (mitraData, amount) => {
  try {
    const payload = {
      account_number: mitraData.rekening,
      bank_code: mitraData.bankCode, // misalnya "bri", "bca", "mandiri"
      amount: amount,
      remark: "Penarikan saldo Mitra Assistenku",
    };

    const res = await axios.post(FLIP_URL, payload, {
      headers: {
        Authorization: `Basic ${btoa(FLIP_SECRET + ":")}`,
      },
    });

    // Catat hasil di Firestore
    await addDoc(collection(db, "withdrawLogs"), {
      mitraId: mitraData.id,
      nama: mitraData.nama,
      amount: amount,
      rekening: mitraData.rekening,
      bank: mitraData.bankCode,
      status: "Berhasil",
      createdAt: new Date(),
    });

    // Kurangi saldo mitra
    const mitraRef = doc(db, "mitraSaldo", mitraData.id);
    await updateDoc(mitraRef, {
      saldo: mitraData.saldo - amount,
    });

    return { success: true, data: res.data };
  } catch (err) {
    console.error("Payout gagal:", err);

    await addDoc(collection(db, "withdrawLogs"), {
      mitraId: mitraData.id,
      amount,
      status: "Gagal",
      createdAt: new Date(),
    });

    return { success: false, error: err.message };
  }
};
