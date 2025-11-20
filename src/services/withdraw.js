// src/services/withdraw.js
import { db } from "../firebase";
import { doc, updateDoc, increment, addDoc, collection, serverTimestamp } from "firebase/firestore";

export async function withdrawMitra(mitraId, amount) {
  const fee = Math.round(amount * 0.007); // biaya bank 0.7%
  const totalPotong = amount + fee;

  const mitraRef = doc(db, "users", mitraId);

  await updateDoc(mitraRef, { saldo: increment(-totalPotong) });

  await addDoc(collection(db, "transactions"), {
    mitraId,
    amount,
    fee,
    type: "withdraw",
    status: "success",
    timestamp: serverTimestamp(),
  });

  return true;
}
