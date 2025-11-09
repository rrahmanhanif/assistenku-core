import { useState } from "react";
import TransactionTable from "../components/TransactionTable";
import { calculateRevenue } from "../utils/calculator";

export default function Transactions() {
  const [amount, setAmount] = useState("");
  const [gatewayFee, setGatewayFee] = useState("");
  const [results, setResults] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const handleCalculate = (e) => {
    e.preventDefault();
    const total = parseFloat(amount);
    const fee = parseFloat(gatewayFee);
    if (isNaN(total) || isNaN(fee)) return;

    const res = calculateRevenue(total, fee);
    setResults(res);

    const newTransaction = {
      id: `TRX-${Date.now()}`,
      totalAmount: total,
      gatewayFee: fee,
      mitraShare: res.mitraShare,
      coreShare: res.coreShare,
      customerCharge: res.customerCharge,
      date: new Date().toLocaleString(),
    };

    setTransactions([newTransaction, ...transactions]);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ color: "#0d6efd" }}>💰 Transaksi & Pembagian Hasil</h2>
      <form onSubmit={handleCalculate} style={{ marginTop: "1rem" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
          <input
            type="number"
            placeholder="Total Pembayaran (Rp)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={{ padding: "10px", flex: 1 }}
          />
          <input
            type="number"
            placeholder="Biaya Gateway (Rp)"
            value={gatewayFee}
            onChange={(e) => setGatewayFee(e.target.value)}
            required
            style={{ padding: "10px", flex: 1 }}
          />
          <button
            type="submit"
            style={{
              background: "#0d6efd",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            Hitung
          </button>
        </div>
      </form>

      {results && (
        <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f8f9fa", borderRadius: "8px" }}>
          <h4>📊 Hasil Pembagian:</h4>
          <p>Total Pembayaran: Rp {results.totalAmount.toLocaleString()}</p>
          <p>Mitra (75%): Rp {results.mitraShare.toLocaleString()}</p>
          <p>Core (25%): Rp {results.coreShare.toLocaleString()}</p>
          {results.customerCharge > 0 ? (
            <p>Biaya Gateway dibebankan ke Customer: Rp {results.customerCharge.toLocaleString()}</p>
          ) : (
            <p>Biaya Gateway ditanggung Core (termasuk dalam 25%)</p>
          )}
          <p>Persentase Gateway: {results.gatewayPercent.toFixed(2)}%</p>
        </div>
      )}

      <TransactionTable data={transactions} />
    </div>
  );
}
