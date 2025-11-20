import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";
import { Line, Bar } from "react-chartjs-2";

export default function DashboardFinanceEnterprise() {
  const [data, setData] = useState({
    core: [],
    mitra: [],
    customer: [],
    gateway: [],
    surge: [],
  });

  const [dailyLabels, setDailyLabels] = useState([]);
  const [dailyIncome, setDailyIncome] = useState([]);
  const [grouped, setGrouped] = useState({});
  const [filterDays, setFilterDays] = useState(7);
  const [loading, setLoading] = useState(true);

  const sum = (a) => a.reduce((s, d) => s + (d.amount || 0), 0);

  const totalCore = sum(data.core);
  const totalMitra = sum(data.mitra);
  const totalCustomer = sum(data.customer);
  const totalGateway = sum(data.gateway);
  const totalSurge = sum(data.surge);

  const platformNet = totalCore + totalSurge - totalGateway;
  const grandTotal = totalCustomer;

  // ===== LOAD ALL DATA =====
  useEffect(() => {
    const load = async () => {
      try {
        const core = await getDocs(collection(db, "core_finance"));
        const mitra = await getDocs(collection(db, "mitra_finance"));
        const customer = await getDocs(collection(db, "customer_finance"));
        const gateway = await getDocs(collection(db, "gateway_finance"));
        const surge = await getDocs(collection(db, "surge_finance"));

        const allTrans = [
          ...core.docs.map((d) => ({ ...d.data(), app: "Core" })),
          ...mitra.docs.map((d) => ({ ...d.data(), app: "Mitra" })),
          ...customer.docs.map((d) => ({ ...d.data(), app: "Customer" })),
          ...gateway.docs.map((d) => ({ ...d.data(), app: "Gateway" })),
          ...surge.docs.map((d) => ({ ...d.data(), app: "Surge" })),
        ];

        // Group by date
        const groupedTemp = {};
        allTrans.forEach((t) => {
          if (!t.date) return;
          const day = new Date(t.date).toLocaleDateString("id-ID");
          if (!groupedTemp[day]) groupedTemp[day] = [];
          groupedTemp[day].push(t);
        });

        const labels = Object.keys(groupedTemp).sort((a, b) => {
          return new Date(a) - new Date(b);
        });

        const incomes = labels.map((l) =>
          groupedTemp[l].reduce((s, x) => s + (x.amount || 0), 0)
        );

        setData({
          core: core.docs.map((d) => d.data()),
          mitra: mitra.docs.map((d) => d.data()),
          customer: customer.docs.map((d) => d.data()),
          gateway: gateway.docs.map((d) => d.data()),
          surge: surge.docs.map((d) => d.data()),
        });

        setGrouped(groupedTemp);
        setDailyLabels(labels);
        setDailyIncome(incomes);
      } catch (err) {
        console.error("Finance load error:", err);
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

  if (loading) return <p className="p-6">Memuat dashboard...</p>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">
          Dashboard Keuangan Assistenku (Enterprise)
        </h1>

        {/* SUMMARY CARDS */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mb-6">
          <Card title="Customer Paid" value={totalCustomer} />
          <Card title="Mitra Dibayar" value={totalMitra} />
          <Card title="Core Revenue" value={totalCore} color="#dbeafe" />
          <Card title="Surge Income" value={totalSurge} color="#e0f2fe" />
          <Card title="Gateway Fee Cost" value={totalGateway} color="#fee2e2" />
          <Card title="Platform Net Income" value={platformNet} color="#cffafe" />
          <Card title="Grand Total Flow" value={grandTotal} color="#e0e7ff" />
        </div>

        {/* FILTER RANGE */}
        <div className="mb-6">
          <label className="font-semibold text-gray-700">
            Filter berdasarkan rentang hari:
          </label>
          <select
            value={filterDays}
            onChange={(e) => setFilterDays(Number(e.target.value))}
            className="ml-2 p-2 rounded border"
          >
            <option value="1">Hari Ini</option>
            <option value="7">7 Hari Terakhir</option>
            <option value="14">14 Hari</option>
            <option value="30">30 Hari</option>
          </select>
        </div>

        {/* DAILY LINE CHART */}
        <div className="bg-white p-4 rounded-xl shadow mb-8">
          <h2 className="text-lg font-bold mb-3">Grafik Pendapatan Harian</h2>
          <Line
            data={{
              labels: dailyLabels.slice(-filterDays),
              datasets: [
                {
                  label: "Pendapatan Harian (Rp)",
                  data: dailyIncome.slice(-filterDays),
                  borderColor: "rgba(37, 99, 235, 1)",
                  backgroundColor: "rgba(37, 99, 235, 0.3)",
                  tension: 0.3,
                },
              ],
            }}
          />
        </div>

        {/* DAILY BAR CHART */}
        <div className="bg-white p-4 rounded-xl shadow mb-8">
          <h2 className="text-lg font-bold mb-3">Total Pendapatan Per Hari</h2>
          <Bar
            data={{
              labels: dailyLabels.slice(-filterDays),
              datasets: [
                {
                  label: "Total (Rp)",
                  data: dailyIncome.slice(-filterDays),
                  backgroundColor: "rgba(59,130,246,0.6)",
                },
              ],
            }}
          />
        </div>

        {/* GROUP TABLE */}
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
              {dailyLabels.slice(-filterDays).map((day) => (
                <tr key={day} className="border-b">
                  <td className="px-4 py-3 font-semibold">{day}</td>
                  <td className="px-4 py-3 text-green-600 font-bold">
                    Rp {dailyIncome[dailyLabels.indexOf(day)].toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <details>
                      <summary className="text-blue-600 underline cursor-pointer">
                        {grouped[day]?.length || 0} transaksi
                      </summary>

                      <ul className="mt-2 space-y-1 text-gray-700">
                        {grouped[day]?.map((t, i) => (
                          <li key={i} className="border p-2 rounded bg-gray-50">
                            <b>{t.app}</b> — Rp {t.amount?.toLocaleString()}
                            <br />
                            {t.description}
                            <br />
                            <small className="text-gray-500">
                              {new Date(t.date).toLocaleTimeString("id-ID")}
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
          <p className="text-center py-4 text-blue-600">Memuat data...</p>
        )}
      </div>
    </div>
  );
                                                 }
