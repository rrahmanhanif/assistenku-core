import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";

export default function DashboardFinance() {
  const [data, setData] = useState({
    core: [],
    mitra: [],
    customer: [],
    gateway: [],
    surge: [],
  });

  const [loading, setLoading] = useState(true);

  const sum = (arr) => arr.reduce((s, d) => s + (d.amount || 0), 0);

  const totalCore = sum(data.core);
  const totalMitra = sum(data.mitra);
  const totalCustomer = sum(data.customer);
  const totalGateway = sum(data.gateway);
  const totalSurge = sum(data.surge);

  const platformNet = totalCore + totalSurge - totalGateway;
  const grandTotal = totalCustomer;

  useEffect(() => {
    const load = async () => {
      try {
        const core = await getDocs(collection(db, "core_finance"));
        const mitra = await getDocs(collection(db, "mitra_finance"));
        const customer = await getDocs(collection(db, "customer_finance"));
        const gateway = await getDocs(collection(db, "gateway_finance"));
        const surge = await getDocs(collection(db, "surge_finance"));

        setData({
          core: core.docs.map((d) => d.data()),
          mitra: mitra.docs.map((d) => d.data()),
          customer: customer.docs.map((d) => d.data()),
          gateway: gateway.docs.map((d) => d.data()),
          surge: surge.docs.map((d) => d.data()),
        });
      } catch (e) {
        console.error("Finance fetch error:", e);
      }

      setLoading(false);
    };

    load();
  }, []);

  const Card = ({ title, value, color }) => (
    <div
      className="p-4 rounded-xl shadow text-center"
      style={{ background: color || "#f7f9fc" }}
    >
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-xl font-bold mt-1">Rp {value.toLocaleString()}</p>
    </div>
  );

  if (loading) return <p>Memuat dashboard...</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Dashboard Keuangan Assistenku (Enterprise)
        </h1>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-6">
          <Card title="Customer Paid" value={totalCustomer} />
          <Card title="Mitra Dibayar" value={totalMitra} />
          <Card title="Core Revenue" value={totalCore} color="#dbeafe" />
          <Card title="Surge Income" value={totalSurge} color="#e0f2fe" />
          <Card title="Gateway Fee Cost" value={totalGateway} color="#fee2e2" />
          <Card title="Platform Net Income" value={platformNet} color="#cffafe" />
          <Card title="Grand Total Flow" value={grandTotal} color="#e0e7ff" />
        </div>
      </div>
    </div>
  );
            }            <option value="7">7 Hari Terakhir</option>
            <option value="14">14 Hari</option>
            <option value="30">30 Hari</option>
          </select>
        </div>

        {/* === DAILY CHART === */}
        <div className="bg-white p-4 rounded-xl shadow mb-8">
          <h2 className="text-lg font-bold mb-3">Grafik Pendapatan Harian</h2>

          <Line
            data={{
              labels: dailyLabels,
              datasets: [
                {
                  label: "Pendapatan Harian (Rp)",
                  data: dailyIncome,
                  borderColor: "rgba(37, 99, 235, 1)",
                  backgroundColor: "rgba(37, 99, 235, 0.3)",
                  tension: 0.3,
                },
              ],
            }}
          />
        </div>

        {/* === BAR CHART === */}
        <div className="bg-white p-4 rounded-xl shadow mb-8">
          <h2 className="text-lg font-bold mb-3">Total Pendapatan Per Hari</h2>

          <Bar
            data={{
              labels: dailyLabels,
              datasets: [
                {
                  label: "Total (Rp)",
                  data: dailyIncome,
                  backgroundColor: "rgba(59, 130, 246, 0.6)",
                },
              ],
            }}
          />
        </div>

        {/* === TABLE GROUP BY DAY === */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-4 py-2">Tanggal</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Detail Transaksi</th>
              </tr>
            </thead>

            <tbody>
              {dailyLabels.map((day) => (
                <tr key={day} className="border-b">
                  <td className="px-4 py-3 font-semibold">{day}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">
                    Rp {dailyIncome[dailyLabels.indexOf(day)].toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <details className="cursor-pointer">
                      <summary className="text-blue-600 underline">
                        Lihat {grouped[day].length} transaksi
                      </summary>

                      <ul className="mt-2 space-y-1 text-gray-700">
                        {grouped[day].map((t) => (
                          <li
                            key={t.id}
                            className="border p-2 rounded bg-gray-50"
                          >
                            <b>{t.app || "-"}</b> — Rp{" "}
                            {t.amount?.toLocaleString("id-ID")}
                            <br />
                            {t.description || "Tanpa deskripsi"}
                            <br />
                            <small className="text-gray-500">
                              {t.date.toLocaleTimeString("id-ID")}
                            </small>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <p className="text-center py-6 text-blue-600">Memuat data...</p>
        )}
      </div>
    </div>
  );
    }  background: "#f8f9fa",
  borderRadius: "10px",
  padding: "1rem",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const valueStyle = {
  fontSize: "1.4rem",
  fontWeight: "bold",
  marginTop: "0.5rem",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  borderRadius: "10px",
  overflow: "hidden",
};
