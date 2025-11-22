// src/layout/AdminLayout.jsx
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({ children, onLogout }) {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 ml-64">
        <Navbar onLogout={onLogout} />
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
