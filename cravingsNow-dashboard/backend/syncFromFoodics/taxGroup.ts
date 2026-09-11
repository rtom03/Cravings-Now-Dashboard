import { prisma } from "../utils/db";
import { getTaxGroupFromFoodics } from "../services/foodics/taxGroup";

interface TaxGProps {
  id: string;
  name: string;
  name_localized: string | null;
  reference: string | null;
  taxes: TaxProps[];
}

interface TaxProps {
  id: string;
  name: string;
  name_localized: string | null;
  rate: number;
}

const upsertTaxGroup = async (data: TaxGProps) => {
  const taxGroup = await prisma.taxGroup.upsert({
    where: {
      foodicsId: data.id,
    },
    update: {
      name: data.name,
      nameLocalized: data.name_localized,
      reference: data.reference,
    },
    create: {
      foodicsId: data.id,
      name: data.name,
      nameLocalized: data.name_localized,
      reference: data.reference,
    },
  });

  // Now process ALL taxes
  for (const tax of data.taxes) {
    await prisma.tax.upsert({
      where: {
        foodicsId: tax.id,
      },
      update: {
        name: tax.name,
        nameLocalized: tax.name_localized,
        rate: tax.rate,
        taxGroupId: taxGroup.id,
      },
      create: {
        foodicsId: tax.id,
        name: tax.name,
        nameLocalized: tax.name_localized,
        rate: tax.rate,
        taxGroupId: taxGroup.id,
      },
    });
  }

  return taxGroup;
};

export const syncTaxGroup = async () => {
  const data = await getTaxGroupFromFoodics();
  console.log(data);
  console.log("To Upsert TaxGroups");

  await upsertTaxGroup(data);

  console.log("Done");
};
