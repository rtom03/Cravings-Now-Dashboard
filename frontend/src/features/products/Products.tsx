import { useEffect, useMemo, useState } from "react";
import { PageToolbar } from "../../shared/PageToolBar";

import { Package } from "lucide-react";
import { usePagination } from "../../hooks/usePagination";
import { ProductWithCategory } from "../../types/type";
import {
  DashCell,
  DataTableColumn,
  DeleteCell,
  HistoryCell,
  ToggleCell,
} from "../../shared/DataTable";
import { uniqueOptions } from "../../utils/utils.index";
import { EditableNumberCell } from "../branches/Deliveryareatab";
import ProductsTable from "./ProductsTable";
import CategoryTable from "./CategoryTable";
import { PeriodSelect } from "../../shared/PeriodSelect";
import { useProductsByGroupById } from "../../api/groupQuery";
import { useBrandStore } from "../../store/brandStore";
import MenuModal from "../branches/MenuModal";
import Options from "./Options";
import ProductDetailsModal from "./ProductDetailsModal";

const Products = () => {
  const SUB_TABS = [
    "Categories",
    "Products",
    "Modifiers",
    "Modifiers Group",
    "More",
  ] as const;
  type SubTab = (typeof SUB_TABS)[number];
  const [subTab, setSubTab] = useState<SubTab>("Products");
  const [query, setQuery] = useState("");
  const { selectedBrandId } = useBrandStore();
  const { data: products } = useProductsByGroupById(selectedBrandId!);

  // console.log(allProducts);

  const [period, setPeriod] = useState<string | null>(null);

  const [prd, setPrd] = useState<ProductWithCategory[]>([]);

  const [productId, setProductId] = useState<string>("");

  const [open, setOpen] = useState<boolean>(false);

  const onProductClick = (id: string) => {
    if (id) {
      setProductId(id);
      setOpen(!open);
    }
    return;
  };
  const removeArea = (id: string) => {
    setPrd((prev) => prev.filter((a) => a.id !== id));
  };
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products?.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q),
    );
  }, [products, query]);

  // const { page, setPage, pageSize, setPageSize, totalPages, paginated } =
  //   usePagination(filtered!, 10);
  const { page, setPage, pageSize, setPageSize, totalPages, paginated } =
    usePagination(products ?? [], 10);

  // console.log(paginated);
  const columns: DataTableColumn<ProductWithCategory>[] = [
    {
      key: "image",
      label: "Image",
      width: "80px",
      sortable: false,
      skeletonVariant: "avatar",
      render: (row) =>
        row.image ? (
          <img
            src={row.image}
            alt={row.name}
            className="h-11 w-11 rounded-md object-cover"
          />
        ) : (
          <DashCell />
        ),
    },
    {
      key: "isActive",
      label: "On/Of",
      width: "90px",
      align: "center",
      sortable: false,
      filterable: true,
      sortAccessor: (row) => (row.isActive ? 1 : 0),
      filterAccessor: (row) => (row.isActive ? "on" : "off"),
      filterOptions: () => [
        { value: "on", label: "Enabled" },
        { value: "off", label: "Disabled" },
      ],
      skeletonVariant: "toggle",
      render: (row) => (
        <div className="flex justify-center">
          <ToggleCell on={row.isActive} />
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      width: "140px",
      sortable: true,
      filterable: true,
      sortAccessor: (row) => row.category.name,
      filterAccessor: (row) => row.category.name,
      filterOptions: (rows) =>
        uniqueOptions(rows.map((r) => r?.category?.name)),
      skeletonVariant: "text",
      render: (row) => (
        <span
          className="text-slate-300 cursor-pointer"
          onClick={() => onProductClick(row.id)}
        >
          {row.category.name}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      width: "190px",
      sortable: true,
      sortAccessor: (row) => row.name,
      skeletonVariant: "text-wide",
      render: (row) => (
        <span
          className="font-medium text-slate-100 cursor-pointer"
          onClick={() => onProductClick(row.id)}
        >
          {row.name}
        </span>
      ),
    },
    {
      key: "price",
      label: "Price",
      width: "120px",
      align: "center",
      sortable: true,
      sortAccessor: (row) => row.price,
      skeletonVariant: "dropdown",
      render: (row) => (
        <div className="flex justify-center">
          {/* <EditableNumberCell
            value={row.price}
            onChange={(price) => updateProduct(row.id, { price })}
          /> */}
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      width: "110px",
      align: "center",
      sortable: false,

      filterable: true,
      // Every product currently renders as "Produced" — same reasoning as
      // Catalog's Type column: filter is wired for when this becomes a
      // real distinguishing field, not decorative-only.
      filterAccessor: () => "Produced",
      filterOptions: () => [{ value: "Produced", label: "Produced" }],
      skeletonVariant: "badge",
      render: () => (
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">
          Produced
        </span>
      ),
    },
    {
      key: "inventory",
      label: "Inventory",
      width: "100px",
      align: "center",
      sortable: false,

      // No live inventory-level field on Product yet — rendered as a dash
      // rather than fabricating a number, same convention as Catalog's
      // Stock level column.
      skeletonVariant: "dash",
      render: () => <DashCell />,
    },
    {
      key: "prepMins",
      label: "Prep. Mins",
      width: "110px",
      align: "center",
      sortable: true,
      sortAccessor: (row) => row.preparationTime ?? 0,
      skeletonVariant: "dropdown",
      render: (row) => (
        <div className="flex justify-center">
          {/* <EditableNumberCell
            value={row.preparationTime ?? 0}
            onChange={(preparationTime) =>
              updateProduct(row.id, { preparationTime })
            }
          /> */}
        </div>
      ),
    },
    {
      key: "sortOrder",
      label: "Sort order",
      width: "100px",
      align: "center",
      sortable: false,

      // No sort-order field on Product yet — same dash convention as
      // Inventory above, not wired to a real column until one exists.
      skeletonVariant: "dash",
      render: () => <DashCell />,
    },
    {
      key: "showNtAv",
      label: "Show not available for",
      width: "200px",
      align: "center",
      sortable: false,

      // No sort-order field on Product yet — same dash convention as
      // Inventory above, not wired to a real column until one exists.
      skeletonVariant: "dash",
      render: (row) => (
        <PeriodSelect key={row.id} value={period} onChange={setPeriod} />
      ),
    },
    {
      key: "hasOpt",
      label: "Has options",
      width: "130px",
      align: "center",
      sortable: false,

      // No sort-order field on Product yet — same dash convention as
      // Inventory above, not wired to a real column until one exists.
      skeletonVariant: "dash",
      render: (row) => (
        <div className="flex justify-center">
          <ToggleCell on={row.isActive} />
        </div>
      ),
    },
    {
      key: "hasVar",
      label: "Has variants",
      width: "100px",
      align: "center",
      sortable: false,

      // No sort-order field on Product yet — same dash convention as
      // Inventory above, not wired to a real column until one exists.
      skeletonVariant: "dash",
      render: () => <DashCell />,
    },
    {
      key: "prodCrt",
      label: "Product created",
      width: "150px",
      align: "center",
      sortable: false,

      // No sort-order field on Product yet — same dash convention as
      // Inventory above, not wired to a real column until one exists.
      skeletonVariant: "dash",
      render: () => <DashCell />,
    },
    {
      key: "del",
      label: "Delete",
      width: "100px",
      align: "center",
      sortable: false,

      // No sort-order field on Product yet — same dash convention as
      // Inventory above, not wired to a real column until one exists.
      skeletonVariant: "dash",
      render: (row) => <DeleteCell id={row.id} onDel={removeArea} />,
    },
    {
      key: "history",
      label: "History",
      width: "120px",
      align: "center",
      sortable: false,

      // No sort-order field on Product yet — same dash convention as
      // Inventory above, not wired to a real column until one exists.
      skeletonVariant: "dash",
      render: () => <HistoryCell />,
    },
  ];

  const catColumns: DataTableColumn<ProductWithCategory>[] = [
    {
      key: "image",
      label: "Image",
      width: "80px",
      sortable: false,
      skeletonVariant: "avatar",
      render: (row) =>
        row.image ? (
          <img
            src={row.image}
            alt={row.name}
            className="h-11 w-11 rounded-md object-cover"
          />
        ) : (
          <DashCell />
        ),
    },
    {
      key: "isActive",
      label: "On/Off",
      width: "90px",
      align: "center",
      sortable: false,
      filterable: false,
      sortAccessor: (row) => (row.isActive ? 1 : 0),
      filterAccessor: (row) => (row.isActive ? "on" : "off"),
      filterOptions: () => [
        { value: "on", label: "Enabled" },
        { value: "off", label: "Disabled" },
      ],
      skeletonVariant: "toggle",
      render: (row) => (
        <div className="flex justify-center">
          <ToggleCell on={row.isActive} />
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      width: "190px",
      sortable: true,
      sortAccessor: (row) => row.name,
      skeletonVariant: "text-wide",
      render: (row) => (
        <span className="font-medium text-slate-100">{row.name}</span>
      ),
    },
    {
      key: "type",
      label: "Type",
      width: "110px",
      align: "center",
      sortable: false,

      filterable: true,
      // Every product currently renders as "Produced" — same reasoning as
      // Catalog's Type column: filter is wired for when this becomes a
      // real distinguishing field, not decorative-only.
      filterAccessor: () => "Produced",
      filterOptions: () => [{ value: "Produced", label: "Produced" }],
      skeletonVariant: "badge",
      render: () => (
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">
          Produced
        </span>
      ),
    },
    {
      key: "sortOrder",
      label: "Sort order",
      width: "100px",
      align: "center",
      sortable: false,

      // No sort-order field on Product yet — same dash convention as
      // Inventory above, not wired to a real column until one exists.
      skeletonVariant: "dash",
      render: () => <DashCell />,
    },
  ];

  const TABS = [
    {
      key: "items",
      label: "Item",
      content: <Options />,
    },
    {
      key: "settings",
      label: "Settings",
      content: <Options />,
    },
    {
      key: "availability",
      label: "Availability",
      content: <Options />,
    },
    {
      key: "options",
      label: "Options",
      content: <Options />,
    },
    {
      key: "confirm",
      label: "Confirmations Message",
      content: <Options />,
    },
    {
      key: "seo",
      label: "Seo",
      content: <Options />,
    },
    {
      key: "product-branches",
      label: "Branches",
      content: <Options />,
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <PageToolbar
        title="Products"
        icon={Package}
        tabs={SUB_TABS.map((key) => ({ key, label: key }))}
        activeTab={subTab}
        onTabChange={setSubTab}
        searchValue={query}
        onSearchChange={setQuery}
        onFilterClick={() => {
          /* wire to a real advanced-filter panel when one exists */
        }}
        onActionsClick={() => {
          /* wire to a real actions menu when one exists */
        }}
        onPrevPage={() => setPage(Math.max(1, page - 1))}
        onNextPage={() => setPage(Math.min(totalPages, page + 1))}
        canGoPrev={page > 1}
        canGoNext={page < totalPages}
      />
      {subTab === "Products" ? (
        <div>
          <ProductsTable
            columns={columns}
            data={paginated}
            rowKey={(row) => row.id}
            selectable
            minWidth="1200px"
            emptyMessage={
              query ? `No products match "${query}".` : "No products found."
            }
          />
          <ProductDetailsModal
            productId={productId!}
            open={open}
            setOpen={setOpen}
          />
        </div>
      ) : subTab === "Categories" ? (
        <CategoryTable
          columns={catColumns}
          data={paginated}
          rowKey={(row) => row.id}
          selectable
          minWidth="1200px"
          emptyMessage={
            query ? `No products match "${query}".` : "No products found."
          }
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default Products;
