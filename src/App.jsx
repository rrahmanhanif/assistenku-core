// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardFinance from "./pages/DashboardFinance";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        Memuat aplikasi...
      </div>
    );
  }

  const RequireAuth = ({ children }) => {
    return user ? children : <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman Login */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        {/* Dashboard Admin */}
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardAdmin onLogout={handleLogout} />
            </RequireAuth>
          }
        />

        {/* Dashboard Finance */}
        <Route
          path="/finance"
          element={
            <RequireAuth>
              <DashboardFinance onLogout={handleLogout} />
            </RequireAuth>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
