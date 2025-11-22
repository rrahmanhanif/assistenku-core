// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardFinanceEnterprise from "./pages/DashboardFinanceEnterprise";
import AdminLayout from "./layout/AdminLayout";

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        const snap = await getDoc(doc(db, "core_users", u.uid));
        setRole(snap.exists() ? snap.data().role : "viewer");
      }

      setUser(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const logoutNow = async () => {
    await signOut(auth);
    setUser(null);
    setRole(null);
  };

  if (loading) return <div style={{ padding: 30 }}>Memuat...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              <AdminLayout onLogout={logoutNow} role={role}>
                <DashboardAdmin role={role} />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/finance"
          element={
            user ? (
              <AdminLayout onLogout={logoutNow} role={role}>
                <DashboardFinanceEnterprise role={role} />
              </AdminLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
