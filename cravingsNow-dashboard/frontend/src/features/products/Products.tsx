import { useEffect, useMemo, useState } from "react";
import { PageToolbar } from "../../shared/PageToolBar";

import { Package, PencilSparkles, Plus } from "lucide-react";
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
import { ImageUploadBox } from "../../components/shared/ImageUploadBox";
import { useUpdateProduct } from "../../api/productMutate";
import { UpdateProductInput } from "../../services/apiServices";
import { durationToReactivateAt } from "../../lib/duration";
import { DeactivateTimeframeSelect } from "../../shared/DeactivateTimeFrameSelect";
import {
  CategoryWithProductCount,
  getCategoriesWithProductCount,
} from "../../lib/categoryTransfomation";

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

  const [prd, setPrd] = useState<ProductWithCategory[]>([]);

  const [productId, setProductId] = useState<string>("");

  const [open, setOpen] = useState<boolean>(false);

  const updateProductMutation = useUpdateProduct();

  const updateProductField = (id: string, patch: UpdateProductInput) => {
    updateProductMutation.mutate({ id, data: patch });
  };

  const deactivateProductFor = (id: string, minutes: number) => {
    updateProductField(id, {
      isActive: false,
      reactivateAt: durationToReactivateAt(minutes),
    });
  };

  const reactivateProductNow = (id: string) => {
    updateProductField(id, { isActive: true, reactivateAt: null });
  };
  const onProductClick = (id: string) => {
    if (!id) return;
    setProductId(id);
    // if (products) {
    //   // console.log(products.filter((prd) => prd.id === id));
    // }
    setOpen(true);
  };
  const removeArea = (id: string) => {
    setPrd((prev) => prev.filter((a) => a.id !== id));
  };
  // const filtered = useMemo(() => {
  //   const q = query.trim().toLowerCase();
  //   if (!q) return products;
  //   return products?.filter(
  //     (p) =>
  //       p.name.toLowerCase().includes(q) ||
  //       p.category.name.toLowerCase().includes(q),
  //   );
  // }, [products, query]);

  const filteredProducts = useMemo(() => {
    const list = products ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.name.toLowerCase().includes(q),
    );
  }, [products, query]);

  // ─── Categories, derived from the same products, then filtered ─────────
  const categories = useMemo(
    () => getCategoriesWithProductCount(products ?? []),
    [products],
  );

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, query]);

  // ─── Whichever dataset the current tab cares about ──────────────────────

  const { page, setPage, pageSize, setPageSize, totalPages, paginated } =
    subTab === "Categories"
      ? usePagination(filteredCategories, 10)
      : usePagination(filteredProducts, 10);

  // Reset to page 1 whenever the tab changes — page 4 of Products almost
  // certainly doesn't exist for a 6-item Categories list, and vice versa.
  useEffect(() => {
    setPage(1);
  }, [subTab, setPage]);

  // console.log(paginated);
  const productColumns: DataTableColumn<ProductWithCategory>[] = [
    {
      key: "image",
      label: "Image",
      width: "80px",
      sortable: false,
      skeletonVariant: "avatar",
      render: (row) => (
        <ImageUploadBox
          image={row.image}
          onUploaded={(url) => updateProductField(row.id, { image: url })}
        />
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
          <EditableNumberCell
            value={row.price}
            onChange={(price) => updateProductField(row.id, { price })}
          />
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
      render: (row) =>
        row.isActive ? (
          <DeactivateTimeframeSelect
            onSelect={(minutes) => deactivateProductFor(row.id, minutes)}
          />
        ) : (
          <div className="flex flex-col items-center">
            <span className="text-[11px] text-slate-500">
              {row.reactivateAt
                ? `Inactive until ${new Date(row.reactivateAt).toLocaleString()}`
                : "Inactive"}
            </span>
            <button
              className="cursor-pointer text-red-600"
              onClick={() => reactivateProductNow(row.id)}
            >
              Clear
            </button>
          </div>
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

  const categoryColumns: DataTableColumn<CategoryWithProductCount>[] = [
    {
      key: "image",
      label: "Image",
      width: "60px",
      sortable: false,
      align: "left",
      skeletonVariant: "avatar",
      render: (row) => (
        <ImageUploadBox
          image={row.image}
          onUploaded={(url) => updateProductField(row.id, { image: url })}
        />
      ),
    },
    {
      key: "isActive",
      label: "On/Off",
      width: "90px",
      align: "center",
      sortable: false,
      filterable: false,
      skeletonVariant: "toggle",
      render: (row) => (
        <div className="flex justify-center">
          <ToggleCell on={true} />
        </div>
      ),
    },
    {
      key: "name",
      label: "Name",
      width: "60px",
      sortable: false,
      align: "left",
      filterable: false,

      skeletonVariant: "text-wide",
      render: (row) => (
        <span className="font-medium text-slate-100">{row.name}</span>
      ),
    },
    {
      key: "seo",
      label: "Search engine opt",
      width: "60px",
      sortable: false,
      align: "left",
      filterable: false,

      skeletonVariant: "text-wide",
      render: (row) => (
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
        >
          <PencilSparkles size={14} />
        </button>
      ),
    },
    {
      key: "products",
      label: "Products",
      width: "110px",
      align: "center",
      sortable: false,
      filterable: false,
      // Every product currently renders as "Produced" — same reasoning as
      // Catalog's Type column: filter is wired for when this becomes a
      // real distinguishing field, not decorative-only.

      skeletonVariant: "badge",
      render: (row) => (
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">
          {row.productCount}
        </span>
      ),
    },

    {
      key: "availability",
      label: "Availabilty",
      width: "100px",
      align: "left",
      sortable: false,

      // No sort-order field on Product yet — same dash convention as
      // Inventory above, not wired to a real column until one exists.
      skeletonVariant: "dash",
      render: () => (
        <button className="flex items-center gap-1 bg-blue-500 rounded-sm p-1.5">
          <Plus />
          <span>Add</span>
        </button>
      ),
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
            columns={productColumns}
            data={paginated as ProductWithCategory[]}
            rowKey={(row) => row.id}
            selectable
            minWidth="1200px"
            emptyMessage={
              query ? `No products match "${query}".` : "No products found."
            }
          />
          {productId && (
            <ProductDetailsModal
              productId={productId}
              open={open}
              setOpen={setOpen}
            />
          )}
        </div>
      ) : subTab === "Categories" ? (
        <CategoryTable
          columns={categoryColumns}
          data={paginated as CategoryWithProductCount[]}
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
