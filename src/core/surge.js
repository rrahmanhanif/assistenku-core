// src/core/surge.js

export function getSurgeMultiplier() {
  const hour = new Date().getHours();

  // Jam ramai
  if (hour >= 6 && hour <= 9) return 1.25;
  if (hour >= 17 && hour <= 21) return 1.30;

  return 1.0;
}
