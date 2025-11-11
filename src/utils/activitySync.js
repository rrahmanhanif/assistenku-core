// src/utils/activitySync.js
import { doc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Simpan atau perbarui aktivitas mitra ke Firestore
 */
export async function updateMitraActivity(uid, data) {
  try {
    await setDoc(doc(db, "mitra_activity", uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("❌ Gagal update mitra_activity:", err);
  }
}

/**
 * Simpan atau perbarui aktivitas customer ke Firestore
 */
export async function updateCustomerActivity(uid, data) {
  try {
    await setDoc(doc(db, "customer_activity", uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("❌ Gagal update customer_activity:", err);
  }
}

/**
 * Tambahkan transaksi baru
 */
export async function addTransaction(data) {
  try {
    await addDoc(collection(db, "transactions"), {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("❌ Gagal menulis transaksi:", err);
  }
}

/**
 * Tambahkan atau perbarui data pesanan
 */
export async function updateOrder(orderId, data) {
  try {
    await setDoc(doc(db, "orders", orderId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("❌ Gagal update orders:", err);
  }
}

/**
 * Kirim lokasi mitra secara realtime
 * (gunakan watchPosition agar update otomatis saat pindah lokasi)
 */
export function watchMitraLocation(uid) {
  if (!navigator.geolocation) {
    console.warn("❌ Browser tidak mendukung geolocation");
    return;
  }

  const watcher = navigator.geolocation.watchPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      await updateMitraActivity(uid, {
        location: { latitude, longitude },
        status: "online",
      });
    },
    (err) => console.error("❌ Gagal mendapatkan lokasi:", err),
    { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
  );

  return watcher; // bisa dipakai untuk stopTracking
}

/**
 * Hentikan tracking lokasi mitra
 */
export function stopMitraLocation(watcherId) {
  if (watcherId) navigator.geolocation.clearWatch(watcherId);
}
