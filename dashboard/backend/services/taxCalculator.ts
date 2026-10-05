import { AppliedTax } from "./taxService";

export interface LineTaxResult {
  taxExclusiveUnitPrice: number;
  taxExclusiveTotalPrice: number;
  unitPrice: number;
  totalPrice: number;
  taxGroupId: string;
  combinedAmount: number; // sum of VAT + GST amounts for this line
  combinedRate: number; // sum of VAT + GST rates, e.g. 7.5 + 5 = 12.5
}

export function calculateLineTax(
  taxExclusiveUnitPrice: number,
  quantity: number,
  taxes: AppliedTax[],
  taxGroupId: string,
): LineTaxResult {
  const taxExclusiveTotalPrice = taxExclusiveUnitPrice * quantity;

  // Each tax (VAT, GST) is still computed independently against the
  // tax-exclusive base — they don't compound on each other — then
  // summed into one combined figure, since the pivot row now represents
  // the whole group rather than one specific tax.
  const combinedRate = taxes.reduce((sum, t) => sum + t.rate, 0);
  const combinedAmount = taxExclusiveTotalPrice * (combinedRate / 100);

  const totalPrice = taxExclusiveTotalPrice + combinedAmount;
  const unitPrice = totalPrice / quantity;

  return {
    taxExclusiveUnitPrice,
    taxExclusiveTotalPrice,
    unitPrice,
    totalPrice,
    taxGroupId,
    combinedAmount,
    combinedRate,
  };
}
