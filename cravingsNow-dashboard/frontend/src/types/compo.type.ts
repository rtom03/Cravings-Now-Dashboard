export interface Product {
  id: string;
  name: string;
  nameLocalized?: string | null;
  image?: string | null;
  isActive: boolean;
  category: { name: string };
}

export interface FilterOption {
  value: string;
  label: string;
}

export type Column = {
  key: string;
  label: string;
  sortable?: boolean;
  width: string;
  sticky?: boolean;
  filterable?: boolean;
  /**
   * How to read a sortable value off a Product row. Sorting by header key
   * directly against the row object (e.g. `row["en"]`) only works if the
   * header key happens to match the data field name — it doesn't here
   * ("en"/"ar" vs. "name"/"nameLocalized"), so each sortable column
   * declares its own accessor instead.
   */
  sortAccessor?: (row: Product) => string | number;
  /** How to read this column's filter value off a row (for the checkbox filter). */
  filterAccessor?: (row: Product) => string;
  /** Computes the checkbox list from the full (unfiltered) row set, so options don't disappear as filters are applied. */
  filterOptions?: (allRows: Product[]) => FilterOption[];
};
