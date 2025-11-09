import { useEffect, useState } from "react";
import { getMitraActivity } from "../services/analytics";
import AnalyticsChart from "../components/AnalyticsChart";

export default function Dashboard() {
  const [mitraInfo, setMitraInfo] = useState({ active: 0, total: 0 });

  useEffect(() => {
    (async () => {
      const result = await getMitraActivity();
      setMitraInfo(result);
    })();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-2">Dashboard Core</h1>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Mitra Aktif</h2>
          <p className="text-2xl font-bold text-blue-600">
            {mitraInfo.active}/{mitraInfo.total}
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Customer Aktif</h2>
          <p className="text-2xl font-bold text-green-600">Realtime via Firebase</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold">Total Pendapatan</h2>
          <p className="text-2xl font-bold text-yellow-700">Grafik Harian ↓</p>
        </div>
      </div>

      <AnalyticsChart />
    </div>
  );
}
