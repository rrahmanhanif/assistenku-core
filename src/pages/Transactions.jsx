import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  getDocs,
  where,
} from "firebase/firestore";
import Navbar from "../components/Navbar";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("daily");

  const getDateRange = () => {
    const now = new Date();

    switch (filter) {
      case "daily":
        return {
          start: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
          end: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        };

      case "weekly":
        const start = new Date(now);
        start.setDate(now.getDate() - 7);
        return { start, end: now };

      case "monthly":
        return {
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        };

      case "yearly":
        return {
          start: new Date(now.getFullYear(), 0, 1),
          end: new Date(now.getFullYear() + 1, 0, 1),
        };

      default:
        return null;
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);

    try {
      const { start, end } = getDateRange();

      const q = query(
        collection(db, "transactions"),
        where("timestamp", ">=", start),
        where("timestamp", "<", end),
        orderBy("timestamp", "desc")
      );

      const snap = await getDocs(q);
      setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error("Gagal load transaksi:", e);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Riwayat Transaksi (Enterprise)
        </h1>

        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          {["daily", "weekly", "monthly", "yearly"].map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-lg ${
                filter === key
                  ? "bg-blue-600 text-white"
                  : "bg-white border text-blue-600"
              }`}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Memuat transaksi...</p>
        ) : (
          <div className="bg-white shadow p-4 rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-blue-100">
                <tr>
                  <th className="p-2">Tanggal</th>
                  <th className="p-2">User</th>
                  <th className="p-2">Tipe</th>
                  <th className="p-2">Jumlah</th>
                  <th className="p-2">Keterangan</th>
                </tr>
              </thead>

              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-4 text-gray-400">
                      Tidak ada transaksi untuk periode ini
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="border-b">
                      <td className="p-2">
                        {t.timestamp?.toDate().toLocaleString()}
                      </td>
                      <td className="p-2">{t.userEmail || "-"}</td>
                      <td className="p-2 capitalize">{t.type}</td>
                      <td className="p-2 font-semibold text-green-600">
                        Rp{t.amount.toLocaleString()}
                      </td>
                      <td className="p-2">{t.description || "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
        }
