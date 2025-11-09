export function calculateRevenue(totalAmount, gatewayFee) {
  const gatewayPercent = (gatewayFee / totalAmount) * 100;

  let mitraShare = totalAmount * 0.75;
  let coreShare = totalAmount * 0.25;
  let customerCharge = 0;

  // Jika gateway > 2%, bebankan ke customer
  if (gatewayPercent > 2) {
    customerCharge = gatewayFee;
  } else {
    // Jika <= 2%, biaya diambil dari jatah Core
    coreShare -= gatewayFee;
  }

  const result = {
    mitraShare,
    coreShare,
    customerCharge,
    gatewayPercent,
    totalAmount,
  };

  return result;
}
