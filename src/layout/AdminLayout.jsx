import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function AdminLayout({ children, onLogout }) {
  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={{ marginLeft: "240px", width: "100%" }}>
        <Navbar onLogout={onLogout} />

        <div style={{ padding: "20px" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
