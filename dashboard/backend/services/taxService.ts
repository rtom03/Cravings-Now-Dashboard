import { prisma } from "../utils/db";

export interface AppliedTax {
  name: string;
  rate: number;
}

export interface ActiveTaxGroup {
  taxGroupId: string;
  taxes: AppliedTax[];
}

let cachedTaxGroup: ActiveTaxGroup | null = null;

export async function getActiveTaxGroup(): Promise<ActiveTaxGroup> {
  if (cachedTaxGroup) return cachedTaxGroup;

  const taxGroup = await prisma.taxGroup.findFirst({
    include: { taxes: true },
  });

  if (!taxGroup || taxGroup.taxes.length === 0) {
    throw new Error(
      "No tax group found — expected VAT and GST to already be populated",
    );
  }

  cachedTaxGroup = {
    taxGroupId: taxGroup.id,
    taxes: taxGroup.taxes.map((t) => ({ name: t.name, rate: t.rate })),
  };

  console.log(cachedTaxGroup);

  return cachedTaxGroup;
}

export function invalidateTaxCache() {
  cachedTaxGroup = null;
}
