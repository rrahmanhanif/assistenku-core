// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import Login from "./pages/Login";
import DashboardAdmin from "./pages/DashboardAdmin";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pantau status login Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-blue-600 font-semibold text-xl">
        Memuat Assistenku...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Kalau belum login → ke login */}
        {!user && <Route path="/login" element={<Login />} />}

        {/* Kalau sudah login → ke dashboard */}
        {user && <Route path="/dashboard" element={<DashboardAdmin />} />}

        {/* Redirect otomatis */}
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
