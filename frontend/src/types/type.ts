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

interface GroupBranch {
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
  branchCategories: BranchCategory[];
}
type BranchResponse = {
  branches: GroupBranch[];
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

interface GroupProducts extends Product {
  pivot: { is_active: boolean };
  group_name: string;
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

// function toBranchWithProducts(branchData: BranchResponse): BranchWithProducts {
//   const { branchCategories, ...branchFields } = branchData.branch[''];

//   const products = branchCategories.flatMap((bc) => {
//     const { groupProducts: categoryProducts, ...categorySummary } = bc.category;
//     return categoryProducts.map((product) => ({
//       ...product,
//       category: categorySummary,
//     }));
//   });

//   return { ...branchFields, products };
// }
function toBranchWithProducts(branch: GroupBranch): BranchWithProducts {
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
export {
  Branch,
  Product,
  BranchResponse,
  Groups,
  toBranchWithProducts,
  GroupBranch,
};
