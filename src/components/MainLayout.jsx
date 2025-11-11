import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function MainLayout({ children }) {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar onLogout={handleLogout} />
        <main style={{ padding: "1.5rem" }}>{children}</main>
      </div>
    </div>
  );
}
