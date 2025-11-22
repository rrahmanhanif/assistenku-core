// src/pages/DashboardAdmin.jsx
import React from "react";
import Navbar from "../components/Navbar";
import useRealtimeData from "../hooks/useRealtimeData";
import { buatPesanan } from "../core/orderFlow";

export default function DashboardAdmin({ onLogout }) {
  const { mitra, customer, orders, transactions } = useRealtimeData();

  const handleSimulasiOrder = async () => {
    try {
      await buatPesanan("cust001", "mitra001", {
        tipe: "harian",
        durasi: 1,
        isRamai: true,
        isLembur: false,
        isCancel: false,
        baseRate: 150000,
      });
      alert("✓ Simulasi Order berhasil!");
    } catch (err) {
      alert("✗ Error: " + err.message);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar onLogout={onLogout} />

      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">
          Dashboard Realtime Assistenku-Core
        </h1>

        <button
          onClick={handleSimulasiOrder}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow mb-6"
        >
          🔹 Simulasi Pesanan Baru
        </button>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Mitra Aktif" value={mitra.length} />
          <StatCard title="Customer Aktif" value={customer.length} />
          <StatCard title="Pesanan Aktif" value={orders.length} />
          <StatCard title="Transaksi Hari Ini" value={transactions.length} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DataCard title="📍 Mitra Aktif" data={mitra} />
          <DataCard title="👤 Customer Aktif" data={customer} />
          <DataCard title="🧾 Pesanan" data={orders} />
          <DataCard title="💰 Transaksi" data={transactions} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm text-center">
      <h3 className="text-gray-500 text-sm">{title}</h3>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
    </div>
  );
}

function DataCard({ title, data }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-3 text-gray-700">{title}</h2>
      <div className="max-h-64 overflow-y-auto">
        {data.length === 0 ? (
          <p className="text-gray-400 text-sm italic">Belum ada data</p>
        ) : (
          <ul className="text-sm text-gray-600 space-y-2">
            {data.map((item, index) => (
              <li key={index} className="border-b border-gray-100 pb-1">
                {JSON.stringify(item)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
