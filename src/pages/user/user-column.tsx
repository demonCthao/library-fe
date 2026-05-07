import { format } from "date-fns";
import { User } from '@/models/user.model'
import {
  createColumnHelper
} from '@tanstack/react-table'
import { Badge } from "@/components/ui/badge";

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
      headerClassName: "text-left"
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
      className: "text-center"
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
      headerClassName: "text-left"
    }
  }),
  columnHelper.accessor("role", {
    cell: (info) => info.getValue() === "admin" ?
      <Badge variant="purple">Admin</Badge> :
      <Badge variant="blue">Librarian</Badge>,
    header: "role",
    footer: (info) => info.column.id,
    meta: {
      label: "role",
      className: "text-center"
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
      className: "text-center"
    }
  }),
  columnHelper.accessor("status", {
    header: "status",
    cell: (info) => <Badge variant={info.getValue() === "inactive"? "red": "green"}>{info.getValue()}</Badge>,
    sortUndefined: 'last',
    sortDescFirst: false,
    footer: (info) => info.column.id,
    filterFn: "includesString",
    meta: {
      label: "status",
      className: "text-center"
    }
  }),
]