interface DbModifierOption {
  id: string;
  name: string;
  nameLocalized: string | null;
  costingMethod: number;
  price: number;
  sku: string;
  isActive: boolean;
}

interface FoodicsModifierOptionPayload {
  name: string;
  name_localized: string | null;
  costing_method: number;
  price: number;
  sku: string;
  is_active: boolean;
}

function toSandboxModifierOptionPayload(
  option: DbModifierOption,
): FoodicsModifierOptionPayload {
  return {
    name: option.name,
    name_localized: option.nameLocalized,
    costing_method: option.costingMethod,
    price: option.price,
    sku: option.sku,
    is_active: option.isActive,
  };
}

export {
  DbModifierOption,
  FoodicsModifierOptionPayload,
  toSandboxModifierOptionPayload,
};
