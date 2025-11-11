import React from "react";

const FinanceSummary = ({ totalMitra, totalCustomer, totalRevenue, totalWithdraw }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 bg-blue-100 rounded-xl shadow-sm">
        <p className="text-sm text-gray-600">Saldo Mitra</p>
        <h2 className="text-xl font-bold text-blue-700">Rp {totalMitra.toLocaleString()}</h2>
      </div>
      <div className="p-4 bg-green-100 rounded-xl shadow-sm">
        <p className="text-sm text-gray-600">Saldo Customer</p>
        <h2 className="text-xl font-bold text-green-700">Rp {totalCustomer.toLocaleString()}</h2>
      </div>
      <div className="p-4 bg-yellow-100 rounded-xl shadow-sm">
        <p className="text-sm text-gray-600">Total Pendapatan</p>
        <h2 className="text-xl font-bold text-yellow-700">Rp {totalRevenue.toLocaleString()}</h2>
      </div>
      <div className="p-4 bg-red-100 rounded-xl shadow-sm">
        <p className="text-sm text-gray-600">Total Withdraw</p>
        <h2 className="text-xl font-bold text-red-700">Rp {totalWithdraw.toLocaleString()}</h2>
      </div>
    </div>
  );
};

export default FinanceSummary;
