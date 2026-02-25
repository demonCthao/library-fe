import { User } from '@/models/user.model'
import {
  createColumnHelper
} from '@tanstack/react-table'

const columnHelper = createColumnHelper<User>()

export const userColumns = [
  columnHelper.accessor("full_name", {
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
  columnHelper.accessor("phone", {
    header: "Phone",
    cell: (info) => info.renderValue(),
    sortUndefined: 'last',
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "Phone",
    }
  }),
  columnHelper.accessor("email", {
    header: "Email",
    cell: (info) => info.renderValue(),
    sortUndefined: 'last',
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "Email",
    }
  }),
  columnHelper.accessor("role", {
    cell: (info) => info.renderValue(),
    header: "Role",
    footer: (info) => info.column.id,
    meta: {
      label: "Role",
    }
  }),
  columnHelper.accessor("updated_at", {
    header: "Updated At",
    cell: (info) => info.renderValue(),
    sortUndefined: 'last',
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "Updated At",
    }
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => info.renderValue(),
    sortUndefined: 'last',
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "Status",
    }
  }),
]