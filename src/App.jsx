import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import DashboardFinanceEnterprise from "./pages/DashboardFinanceEnterprise";
import Reports from "./pages/Reports";
import Transactions from "./pages/Transactions";
import Wallet from "./pages/Wallet";

// Layout
import SidebarLayout from "./components/SidebarLayout";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  // CEK LOGIN + AMBIL ROLE
  // ---------------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      // Ambil role dari Firestore
      const ref = doc(db, "core_users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await signOut(auth);
        setCurrentUser(null);
        setRole(null);
      } else {
        setCurrentUser(user);
        setRole(snap.data().role || "viewer");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{ padding: 30 }}>Memuat...</div>;

  // ---------------------------
  // PROTECT ROUTE
  // ---------------------------
  function ProtectedRoute({ allow, children }) {
    if (!currentUser) return <Navigate to="/" replace />;
    if (!allow.includes(role)) return <Navigate to="/dashboard" replace />;
    return children;
  }

  // ---------------------------
  // RENDER UTAMA
  // ---------------------------
  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* DASHBOARD (SEMUA ROLE BOLEH) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allow={["superadmin", "admin", "viewer"]}>
              <SidebarLayout>
                <Dashboard />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />

        {/* FINANCE (KHUSUS SUPERADMIN) */}
        <Route
          path="/finance"
          element={
            <ProtectedRoute allow={["superadmin"]}>
              <SidebarLayout>
                <DashboardFinanceEnterprise />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />

        {/* REPORTS */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute allow={["superadmin", "admin"]}>
              <SidebarLayout>
                <Reports />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />

        {/* TRANSACTIONS */}
        <Route
          path="/transactions"
          element={
            <ProtectedRoute allow={["superadmin", "admin"]}>
              <SidebarLayout>
                <Transactions />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />

        {/* WALLET */}
        <Route
          path="/wallet"
          element={
            <ProtectedRoute allow={["superadmin", "admin"]}>
              <SidebarLayout>
                <Wallet />
              </SidebarLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
