export default function Sidebar() {
  return (
    <aside
      style={{
        width: "240px",
        height: "100vh",
        background: "#0d6efd",
        color: "white",
        paddingTop: "20px",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <h2 style={{ paddingLeft: "20px" }}>Assistenku Admin</h2>

      <nav style={{ marginTop: "20px" }}>
        <a
          href="/dashboard"
          style={{
            display: "block",
            padding: "12px 20px",
            color: "white",
            textDecoration: "none",
            background: "#0b5ed7",
            borderRadius: "6px",
            margin: "6px 12px",
          }}
        >
          Dashboard
        </a>
      </nav>
    </aside>
  );
}
