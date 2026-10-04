// services/paystackService.ts
export function calculatePaystackFee(amountNaira: number): number {
  if (amountNaira <= 2500) {
    return Math.round(amountNaira * 0.015 * 100) / 100; // flat fee waived below ₦2,500
  }

  const fee = amountNaira * 0.015 + 100;
  return Math.min(fee, 2000); // capped at ₦2,000
}
