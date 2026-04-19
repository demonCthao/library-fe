import { format } from "date-fns";
import { User } from '@/models/user.model'
import {
  createColumnHelper
} from '@tanstack/react-table'

const columnHelper = createColumnHelper<User>()

export const userColumns = [
  columnHelper.accessor("full_name", {
    header: "fullName",
    cell: (info) => info.renderValue(),
    sortUndefined: 'last',
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "fullName",
    }
  }),
  columnHelper.accessor("phone", {
    header: "phone",
    cell: (info) => info.renderValue(),
    sortUndefined: 'last',
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "phone",
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
    header: "role",
    footer: (info) => info.column.id,
    meta: {
      label: "role",
    }
  }),
  columnHelper.accessor("updated_at", {
    header: "updatedAt",
    cell: ({ getValue }) => format(new Date(getValue() as string), "dd/MM/yyyy HH:mm"),
    sortUndefined: 'last',
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "updatedAt",
    }
  }),
  columnHelper.accessor("status", {
    header: "status",
    cell: (info) => info.renderValue(),
    sortUndefined: 'last',
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "status",
    }
  }),
]