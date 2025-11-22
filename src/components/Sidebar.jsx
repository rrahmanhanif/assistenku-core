// src/components/Sidebar.jsx
export default function Sidebar() {
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold text-blue-600 mb-4">Assistenku-Core</h2>

      <nav className="space-y-2">
        <a href="/dashboard" className="block p-2 rounded hover:bg-blue-100">
          Dashboard Utama
        </a>

        <a href="/finance" className="block p-2 rounded hover:bg-blue-100">
          💰 Finance Enterprise
        </a>

        <a href="/reports" className="block p-2 rounded hover:bg-blue-100">
          📊 Laporan Bulanan
        </a>

        <a href="/transactions" className="block p-2 rounded hover:bg-blue-100">
          🧾 Riwayat Transaksi
        </a>

        <a href="/wallet" className="block p-2 rounded hover:bg-blue-100">
          💼 Dompet Digital
        </a>
      </nav>
    </aside>
  );
}
