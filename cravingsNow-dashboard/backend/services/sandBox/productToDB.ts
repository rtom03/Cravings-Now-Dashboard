import { prisma } from "../../utils/db";
import foodicsClientSB from "../foodics/foodicsClientSB";

export const getProductsById = async () => {
  const { data } = await foodicsClientSB.get(
    `/products?filter[category_id]=a2e27ac2-5b6b-41f8-af6b-572f791aee4a`,
  );

  return data.data;
};

interface SandboxProduct {
  id: string;
  name: string;
  // other fields exist on the response but aren't needed for matching
}

export interface ProductMatchResult {
  dbProductId: string;
  dbProductName: string;
  matched: boolean;
  sandboxProductId?: string;
  reason?: string;
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export async function syncSandboxIdsByName(): Promise<ProductMatchResult[]> {
  // 1. Every sandbox product, straight from Foodics
  const sandboxProducts: SandboxProduct[] = await getProductsById();

  // 2. Only local products that DON'T already have a sandbox id — makes
  //    this safe to re-run repeatedly without redoing work or risking an
  //    already-correct mapping being overwritten by a stale re-match.
  const dbProducts = await prisma.groupProducts.findMany({
    where: { foodicsSandBoxId: null, groupName: "Scoopd" },
    select: { id: true, name: true },
  });

  // 3. Group sandbox products by normalized name. An array per key, not a
  //    single value — duplicate names are a real possibility on either
  //    side, and silently taking "whichever came first" would be a
  //    correctness bug (wrong product gets wired to the wrong sandbox id),
  //    not just a minor edge case.
  const sandboxByName = new Map<string, SandboxProduct[]>();
  for (const sp of sandboxProducts) {
    console.log(`SANDBOX --- ${sp.name}`);
    const key = normalizeName(sp.name);
    console.log(key);
    const existing = sandboxByName.get(key);
    if (existing) {
      existing.push(sp);
    } else {
      sandboxByName.set(key, [sp]);
    }
  }

  const results: ProductMatchResult[] = [];

  for (const dbProduct of dbProducts) {
    console.log(`DB ----${dbProduct.name}`);

    const matches = sandboxByName.get(normalizeName(dbProduct.name));

    if (!matches || matches.length === 0) {
      results.push({
        dbProductId: dbProduct.id,
        dbProductName: dbProduct.name,
        matched: false,
        reason: "No sandbox product with this name",
      });
      continue;
    }

    if (matches.length > 1) {
      // Ambiguous — flag for manual review rather than guessing which one
      // is "correct" and silently wiring the wrong id.
      results.push({
        dbProductId: dbProduct.id,
        dbProductName: dbProduct.name,
        matched: false,
        reason: `Ambiguous: ${matches.length} sandbox products share this name`,
      });
      continue;
    }

    const sandboxProduct = matches[0];
    try {
      await prisma.groupProducts.update({
        where: { id: dbProduct.id },
        data: { foodicsSandBoxId: sandboxProduct.id },
      });

      results.push({
        dbProductId: dbProduct.id,
        dbProductName: dbProduct.name,
        matched: true,
        sandboxProductId: sandboxProduct.id,
      });
    } catch (error: any) {
      console.log(error);
      results.push({
        dbProductId: dbProduct.id,
        dbProductName: dbProduct.name,
        matched: false,
        reason: error?.message || "Database update failed",
      });
    }
  }
  console.log("DONE");
  return results;
}
