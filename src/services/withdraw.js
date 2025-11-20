// ==========================================================
// withdraw.js — Service Penarikan Dana Mitra (Enterprise)
// ==========================================================

import { withdrawMitra } from "./finance";

/**
 * Permintaan penarikan dari Mitra
 * @param {string} mitraId 
 * @param {number} amount 
 */
export async function requestWithdraw(mitraId, amount) {
  if (!mitraId) throw new Error("ID Mitra wajib diisi.");
  if (!amount || amount <= 0) throw new Error("Nominal tidak valid.");

  // langsung verifikasi otomatis (sesuai kebijakan Assistenku)
  const result = await withdrawMitra(mitraId, amount);

  return {
    success: true,
    ...result,
  };
}
