import { Column } from "../shared/HeaderCell";
import { uniqueOptions } from "./utils.index";

const BR_PRD_COLUMNS: Column[] = [
  { key: "select", label: "", sortable: false, width: "40px", sticky: true },
  {
    key: "photo",
    label: "Photo",
    sortable: false,
    width: "88px",
    sticky: true,
  },
  {
    key: "on",
    label: "On/Off",
    sortable: true,
    filterable: true,
    width: "88px",
    sticky: true,
    sortAccessor: (row) => (row.isActive ? 1 : 0),
    filterAccessor: (row) => (row.isActive ? "on" : "off"),
    filterOptions: () => [
      { value: "on", label: "Enabled" },
      { value: "off", label: "Disabled" },
    ],
  },
  {
    key: "category",
    label: "Category",
    sortable: false,
    filterable: true,
    width: "140px",
    filterAccessor: (row) => row.category.name,
    filterOptions: (rows) => uniqueOptions(rows.map((r) => r.category.name)),
  },
  {
    key: "en",
    label: "English name",
    sortable: true,
    width: "190px",
    sortAccessor: (row) => row.name ?? "",
  },
  {
    key: "type",
    label: "Type",
    sortable: false,
    filterable: true,
    width: "110px",
    // Every row currently renders as "Produced" — filtering is wired for
    // when this becomes a real field, but with one constant value the
    // checkbox list only ever has one option.
    filterAccessor: () => "Produced",
    filterOptions: () => [{ value: "Produced", label: "Produced" }],
  },
  {
    key: "overrideStock",
    label: "Override Stock?",
    sortable: false,
    width: "130px",
  },
  // No live data source for stock levels yet (always renders "–") — left
  // non-sortable/non-filterable rather than wiring controls that can
  // never do anything, which would be misleading.
  { key: "stockLevel", label: "Stock level", sortable: false, width: "110px" },
  {
    key: "overridePreorderStock",
    label: "Override Preordering Stock?",
    sortable: false,
    width: "150px",
  },
  {
    key: "preorderStockLevel",
    label: "Preordering Stock Level",
    sortable: false,
    width: "150px",
  },
  {
    key: "overrideOptions",
    label: "Override Options?",
    sortable: false,
    width: "130px",
  },
  { key: "options", label: "Options", sortable: false, width: "90px" },
  {
    key: "availability",
    label: "Show not available for",
    sortable: false,
    // Same reasoning as stockLevel — no backing field yet.
    filterable: false,
    width: "190px",
  },
  { key: "limits", label: "Limits", sortable: false, width: "80px" },
  { key: "remove", label: "Remove", sortable: false, width: "80px" },
  { key: "history", label: "History", sortable: false, width: "80px" },
];

export { BR_PRD_COLUMNS };
