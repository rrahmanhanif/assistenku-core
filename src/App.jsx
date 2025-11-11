// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// ✅ Import halaman sesuai struktur /src/pages/
import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Wallet from "./pages/Wallet";
import Withdraw from "./pages/Withdraw";

// ✅ Import komponen global (navbar, notifikasi, dll)
import { Navbar, Notification } from "./components";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Pantau status login Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 🔵 Tampilan loading khas Assistenku
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-blue-600 font-semibold text-lg tracking-wide">
          Memuat data, mohon tunggu...
        </p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* 🔹 Navbar hanya tampil jika sudah login */}
      {user && <Navbar />}

      {/* 🔹 Area utama aplikasi */}
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* Halaman utama (hanya login) */}
        <Route
          path="/dashboard"
          element={user ? <DashboardAdmin /> : <Navigate to="/login" />}
        />
        <Route
          path="/transactions"
          element={user ? <Transactions /> : <Navigate to="/login" />}
        />
        <Route
          path="/reports"
          element={user ? <Reports /> : <Navigate to="/login" />}
        />
        <Route
          path="/wallet"
          element={user ? <Wallet /> : <Navigate to="/login" />}
        />
        <Route
          path="/withdraw"
          element={user ? <Withdraw /> : <Navigate to="/login" />}
        />

        {/* Halaman login */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />

        {/* Fallback jika URL tidak dikenal */}
        <Route
          path="*"
          element={
            user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />
      </Routes>

      {/* 🔹 Komponen notifikasi global */}
      {user && <Notification />}
    </BrowserRouter>
  );
          }
