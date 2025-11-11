import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import Navbar from "../components/Navbar";

export default function DashboardFinance({ onLogout }) {
  const [coreData, setCoreData] = useState([]);
  const [mitraData, setMitraData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalCore = coreData.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalMitra = mitraData.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalCustomer = customerData.reduce((sum, d) => sum + (d.amount || 0), 0);
  const grandTotal = totalCore + totalMitra + totalCustomer;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coreSnap = await getDocs(collection(db, "core_finance"));
        const mitraSnap = await getDocs(collection(db, "mitra_finance"));
        const customerSnap = await getDocs(collection(db, "customer_finance"));

        setCoreData(coreSnap.docs.map((doc) => doc.data()));
        setMitraData(mitraSnap.docs.map((doc) => doc.data()));
        setCustomerData(customerSnap.docs.map((doc) => doc.data()));
      } catch (error) {
        console.error("Error fetching finance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Memuat data keuangan...</p>;

  return (
    <div>
      <Navbar onLogout={onLogout} />
      <div style={{ padding: "2rem" }}>
        <h2 style={{ marginBottom: "1rem", color: "#0d6efd" }}>Dashboard Keuangan Sinkron</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <div style={cardStyle}>
            <h3>Saldo Core</h3>
            <p style={valueStyle}>Rp {totalCore.toLocaleString("id-ID")}</p>
          </div>
          <div style={cardStyle}>
            <h3>Saldo Mitra</h3>
            <p style={valueStyle}>Rp {totalMitra.toLocaleString("id-ID")}</p>
          </div>
          <div style={cardStyle}>
            <h3>Saldo Customer</h3>
            <p style={valueStyle}>Rp {totalCustomer.toLocaleString("id-ID")}</p>
          </div>
          <div style={{ ...cardStyle, background: "#0d6efd", color: "white" }}>
            <h3>Total Keseluruhan</h3>
            <p style={valueStyle}>Rp {grandTotal.toLocaleString("id-ID")}</p>
          </div>
        </div>

        <h3 style={{ marginBottom: "1rem" }}>Riwayat Transaksi</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th>Aplikasi</th>
                <th>Deskripsi</th>
                <th>Nominal</th>
                <th>Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {[
                ...coreData.map((d) => ({ ...d, app: "Core" })),
                ...mitraData.map((d) => ({ ...d, app: "Mitra" })),
                ...customerData.map((d) => ({ ...d, app: "Customer" })),
              ]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((row, i) => (
                  <tr key={i}>
                    <td>{row.app}</td>
                    <td>{row.description || "-"}</td>
                    <td>Rp {row.amount?.toLocaleString("id-ID")}</td>
                    <td>{row.date || "-"}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#f8f9fa",
  borderRadius: "10px",
  padding: "1rem",
  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
};

const valueStyle = {
  fontSize: "1.4rem",
  fontWeight: "bold",
  marginTop: "0.5rem",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  background: "white",
  borderRadius: "10px",
  overflow: "hidden",
};
