import { Category } from "@/models/category.model";
import {
    createColumnHelper
} from '@tanstack/react-table';

const columnHelper = createColumnHelper<Category>()

export const categoryColumns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.renderValue(),
    sortUndefined: 'last',
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "Name",
    }
  }),
  columnHelper.accessor("other_category_names", {
    header: "Other Category",
    cell: (info) => info.renderValue(),
    sortUndefined: 'last',
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "Other Category",
    }
  }),
]