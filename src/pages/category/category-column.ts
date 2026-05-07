import { Category } from "@/models/category.model";
import {
    createColumnHelper
} from '@tanstack/react-table';

const columnHelper = createColumnHelper<Category>()

export const categoryColumns = [
  columnHelper.accessor("name", {
    header: "name",
    cell: (info) => info.renderValue(),
    sortUndefined: 'last',
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "name",
      className: "text-left",
      headerClassName: "text-left"
    }
  }),
  columnHelper.accessor("other_category_names", {
    header: "otherCategory",
    cell: (info) => info.renderValue(),
    sortUndefined: 'last',
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "otherCategory",
      className: "text-left",
      headerClassName: "text-left"
    }
  }),
]