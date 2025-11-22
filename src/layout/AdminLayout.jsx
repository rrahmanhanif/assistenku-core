// src/layout/AdminLayout.jsx
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function AdminLayout({ children, onLogout, role }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar role={role} />

      <div style={{ marginLeft: "240px", width: "100%" }}>
        <Navbar onLogout={onLogout} />

        <div style={{ padding: "1.5rem" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
