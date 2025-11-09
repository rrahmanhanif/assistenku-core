import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function Reports() {
  const [reports, setReports] = useState({ core: 0, mitra: 0, total: 0 });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "transactions"), (snapshot) => {
      let coreTotal = 0;
      let mitraTotal = 0;
      let totalAll = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.timestamp?.toDate?.();
        if (date && date.getMonth() === new Date().getMonth()) {
          coreTotal += data.coreShare || 0;
          mitraTotal += data.mitraShare || 0;
          totalAll += data.total || 0;
        }
      });

      setReports({
        core: coreTotal,
        mitra: mitraTotal,
        total: totalAll,
      });
    });

    return () => unsub();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Laporan Bulanan</h1>

      <div className="bg-gray-50 p-6 rounded-lg shadow-lg max-w-lg">
        <p className="mb-3">Bulan: {new Date().toLocaleString("id-ID", { month: "long", year: "numeric" })}</p>
        <p>Total Transaksi: <b>Rp {reports.total.toLocaleString()}</b></p>
        <p>Untuk Mitra (75%): <b className="text-green-600">Rp {reports.mitra.toLocaleString()}</b></p>
        <p>Untuk Core (25%): <b className="text-blue-600">Rp {reports.core.toLocaleString()}</b></p>
      </div>
    </div>
  );
}
