// src/components/Navbar.jsx
export default function Navbar({ onLogout }) {
  return (
    <nav
      style={{
        background: "#0d6efd",
        padding: "1rem",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div style={{ fontSize: "1.25rem", fontWeight: "600" }}>
        Assistenku Admin
      </div>

      <button
        onClick={onLogout}
        style={{
          background: "white",
          color: "#0d6efd",
          border: "none",
          borderRadius: "8px",
          padding: "8px 14px",
          cursor: "pointer",
          fontWeight: "600",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          transition: "0.2s",
        }}
        onMouseEnter={(e) => (e.target.style.opacity = "0.8")}
        onMouseLeave={(e) => (e.target.style.opacity = "1")}
      >
        Logout
      </button>
    </nav>
  );
}
