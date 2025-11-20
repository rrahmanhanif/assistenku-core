import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { requestWithdraw } from "../services/withdraw";

export default function WithdrawRequest() {
  const [mitraList, setMitraList] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "mitra_finance"), (snap) => {
      setMitraList(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const handleWithdraw = async (mitra) => {
    if (mitra.saldo <= 0) return alert("Saldo mitra kosong.");
    if (processingId) return;

    setProcessingId(mitra.id);

    try {
      const result = await requestWithdraw(mitra.id, mitra.saldo);

      alert(
        `✔ Penarikan Berhasil
Mitra: ${mitra.id}
Nominal: Rp${mitra.saldo.toLocaleString("id-ID")}
Biaya Gateway: Rp${result.gatewayFee.toLocaleString("id-ID")}
Diterima Bersih: Rp${(mitra.saldo - result.gatewayFee).toLocaleString("id-ID")}`
      );
    } catch (e) {
      alert("Gagal memproses penarikan: " + e.message);
    }

    setProcessingId(null);
  };

  return (
    <div className="p-6 bg-white shadow rounded-2xl">
      <h2 className="text-xl font-semibold text-blue-700 mb-4">
        Penarikan Dana Mitra (Enterprise)
      </h2>

      <table className="w-full border border-gray-200 rounded-xl overflow-hidden">
        <thead className="bg-blue-100">
          <tr>
            <th className="p-3 text-left">Nama / ID</th>
            <th className="p-3">Bank</th>
            <th className="p-3">Rekening</th>
            <th className="p-3">Saldo</th>
            <th className="p-3">Aksi</th>
          </tr>
        </thead>

        <tbody>
          {mitraList.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-4 text-center text-gray-400">
                Tidak ada data mitra
              </td>
            </tr>
          ) : (
            mitraList.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-3">{m.nama || m.id}</td>
                <td className="text-center">{m.bank || "-"}</td>
                <td className="text-center">{m.rekening || "-"}</td>
                <td className="text-right pr-4 font-semibold text-green-700">
                  Rp{(m.saldo || 0).toLocaleString("id-ID")}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleWithdraw(m)}
                    disabled={processingId === m.id}
                    className={`px-4 py-2 rounded-lg text-white shadow ${
                      processingId === m.id
                        ? "bg-gray-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {processingId === m.id ? "Memproses..." : "Tarik Saldo"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
                                                             }
