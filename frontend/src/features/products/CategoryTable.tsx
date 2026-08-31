import { DataTable, DataTableColumn } from "../../shared/DataTable";

type CategoryProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  minWidth?: string;
  selectable: boolean;
};

function CategoryTable<T>({
  columns,
  data,
  rowKey,
  emptyMessage,
  minWidth,
}: CategoryProps<T>) {
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

export default CategoryTable;
