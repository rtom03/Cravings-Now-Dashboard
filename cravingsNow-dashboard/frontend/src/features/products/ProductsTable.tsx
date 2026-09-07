import { DataTable, DataTableColumn } from "../../shared/DataTable";

type ProductProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  minWidth?: string;
  selectable: boolean;
};

function ProductsTable<T>({
  columns,
  data,
  rowKey,
  emptyMessage,
  minWidth,
}: ProductProps<T>) {
  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        rowKey={rowKey}
        selectable
        minWidth={minWidth}
        emptyMessage={
          emptyMessage
            ? `No products match "${emptyMessage}".`
            : "No products found."
        }
      />
    </div>
  );
}

export default ProductsTable;
