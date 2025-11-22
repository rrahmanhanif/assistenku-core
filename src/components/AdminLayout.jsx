// src/components/AdminLayout.jsx
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 ml-64 bg-gray-50 min-h-screen">
        <Navbar />

        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
