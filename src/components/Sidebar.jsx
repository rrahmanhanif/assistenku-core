// src/components/Sidebar.jsx
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 w-64 h-full bg-blue-600 text-white p-4 space-y-2">
      <h2 className="text-xl font-bold mb-4">Assistenku Admin</h2>

      <nav className="space-y-2">
        <Link to="/dashboard" className="block p-2 rounded hover:bg-blue-500">
          Dashboard Utama
        </Link>

        <Link to="/finance" className="block p-2 rounded hover:bg-blue-500">
          💰 Finance Enterprise
        </Link>

        <Link to="/reports" className="block p-2 rounded hover:bg-blue-500">
          📊 Laporan Bulanan
        </Link>

        <Link to="/transactions" className="block p-2 rounded hover:bg-blue-500">
          🧾 Riwayat Transaksi
        </Link>

        <Link to="/wallet" className="block p-2 rounded hover:bg-blue-500">
          💼 Dompet Digital
        </Link>
      </nav>
    </aside>
  );
}
