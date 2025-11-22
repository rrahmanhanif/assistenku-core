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

  // ==========================
  //  CEK LOGIN + ROLE FIRESTORE
  // ==========================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCurrentUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      const ref = doc(db, "core_users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setCurrentUser(user);
        setRole(snap.data().role || "viewer");
      } else {
        // Jika dokumen tidak ada → logout otomatis
        await signOut(auth);
        setCurrentUser(null);
        setRole(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{ padding: 30 }}>Memuat...</div>;

  // ==========================
  //  PROTECT ROUTE
  // ==========================
  function ProtectedRoute({ children, allow }) {
    if (!currentUser) return <Navigate to="/" replace />;
    if (!allow.includes(role)) return <Navigate to="/dashboard" replace />;
    return children;
  }

  return (
    <Router>
      <Routes>
        {/* LOGIN PAGE */}
        <Route path="/" element={<Login />} />

        {/* DASHBOARD (boleh semua role) */}
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

        {/* FINANCE (hanya superadmin) */}
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

        {/* Redirect default */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
