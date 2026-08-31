interface BranchSettings {
  branchTaxNumber: string;
  ngBusinessPlaceFirs: string;
  displayBackgroundImage: string | null;
  branchTaxRegistrationName: string;
  isWebsocketNotificationsEnabled: boolean;
  branchCommercialRegistrationNumber: string | null;
}

interface Branch {
  id: string;
  name: string;
  foodicsId: string;
  reference: string;
  name_localized: string;
  type: number;
  latitude: string;
  longitude: string;
  phone: string | null;
  openingFrom: string;
  openingTo: string;
  inventory_end_of_day_time: string;
  receipt_header: string;
  receipt_footer: string;
  settings: BranchSettings;
  receives_online_orders: boolean;
  accepts_reservations: boolean;
  reservation_duration: number;
  reservation_times: null;
  address: string | null;
  // products: ProductBranch;
}

type Category = {
  id: string;
  foodicsId: string;
  name: string;
  nameLocalized: string | null;
  reference: string | null;
  image: string | null;
  groupProducts: GroupProducts[];
};

interface BranchCategory {
  id: string;
  branchId: string;
  categoryId: string;
  category: Category;
}
[];
interface BranchDetails extends Branch {
  branchCategories: BranchCategory[];
}

type Branches = {
  branches: Branch[];
};
// ─── Raw API response type (snake_case, as Foodics sends it) ──────────────────

// ─── Internal camelCase type ────────────────────────────────────────────────

interface Product {
  id: string;
  sku: string;
  barcode: string | null;
  name: string;
  nameLocalized: string | null;
  description: string | null;
  descriptionLocalized: string | null;
  image: string | null;
  isActive: boolean;
  isStockProduct: boolean;
  isNonRevenue: boolean;
  isReady: boolean;
  pricingMethod: number;
  sellingMethod: number;
  costingMethod: number;
  preparationTime: number | null;
  price: number;
  cost: number | null;
  calories: number | null;
  walkingMinutesToBurnCalories: number | null;
  isHighSalt: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  meta: Record<string, unknown> | null;
  ingredients: unknown[];
}

interface ProductProps extends Product {
  category: Category;
}

interface BrandProducts {
  products: ProductProps[];
}

interface GroupProducts extends Product {
  pivot: { is_active: boolean };
  group_name: string;
  groupProductModifiers: GroupProductModifiers;
}

interface Options {
  modifierId: string;
  modifierOptionId: string;
  modifierOption: {
    id: string;
    foodicsId: string;
    sku: string;
    name: string;
    nameLocalized: string | null;
    isActive: boolean;
    isInStock: boolean;
    costingMethod: number;
    price: number;
    cost: number | null;
    calories: string | null;
    index: number | null;
    taxGroupId: string | null;
  };
}

interface GroupProductModifiers {
  groupProductId: string;
  modifierId: string;
  isSplittableInHalf: boolean;
  uniqueOptions: boolean;
  minimumOptions: number;
  maximumOptions: number;
  freeOptions: number;
  defaultOptionsIds: unknown[];
  excludedOptionsIds: unknown[];
  index: number;
  modifier: {
    id: string;
    foodicsId: string;
    name: string;
    nameLocalized: string | null;
    reference: string;
    isReady: boolean;
  };
  options: Options[];
}
// ─── Mapper ─────────────────────────────────────────────────────────────────

// ─── Target shape (what most UI/consumers actually want) ───────────────────
// One row per product, carrying just enough branch + category context to
// render or filter without re-walking the tree every time.
type CategorySummary = Omit<Category, "groupProducts">; // category minus the products it owns — no reason to nest products-in-category-in-product

interface ProductWithCategory extends Product {
  category: CategorySummary;
}

interface BranchWithProducts extends Branch {
  products: ProductWithCategory[];
}

interface Groups {
  id: string;
  foodicsId: string;
  name: string;
  nameLocalized: string | null;
  image: string | null;
}

// ─── The mapper ─────────────────────────────────────────────────────────────

function toBranchWithProducts(branch: BranchDetails): BranchWithProducts {
  const { branchCategories, ...branchFields } = branch;

  const products = branchCategories.flatMap((bc) => {
    const { groupProducts: categoryProducts, ...categorySummary } = bc.category;
    return categoryProducts.map((product) => ({
      ...product,
      category: categorySummary,
    }));
  });

  return {
    ...branchFields,
    products,
  };
}

// ─── All group products, deduped across every branch ───────────────────────
// Same source shape as toBranchWithProducts (GroupBranch[]), but instead of
// keeping products scoped per branch, this walks every branch's categories
// and collapses them into one flat, unique product list — useful for a
// global products page rather than a per-branch catalog view.

function getAllGroupProducts(branches: BranchDetails[]): ProductWithCategory[] {
  const productsById = new Map<string, ProductWithCategory>();

  for (const branch of branches) {
    for (const bc of branch.branchCategories) {
      const { groupProducts, ...categorySummary } = bc.category;

      for (const product of groupProducts) {
        // First occurrence wins — since the same product/category pairing
        // is identical everywhere it appears, there's no meaningful
        // "merge" to do; we just need to not add it twice.
        if (!productsById.has(product.id)) {
          productsById.set(product.id, {
            ...product,
            category: categorySummary,
          });
        }
      }
    }
  }

  return Array.from(productsById.values());
}
export {
  Branch,
  Product,
  Branches,
  Groups,
  BranchDetails,
  ProductWithCategory,
  BrandProducts,
  toBranchWithProducts,
  getAllGroupProducts,
};
