import { Reader } from "@/models/reader.model";
import {
    createColumnHelper
} from '@tanstack/react-table';
import { format } from "date-fns";

const columnHelper = createColumnHelper<Reader>()

export const readerColumns = [
    columnHelper.accessor("reader_code", {
        header: "Name",
        cell: ({ getValue }) => getValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Reader Code",
        }
    }),
    columnHelper.accessor("full_name", {
        header: "Name",
        cell: ({ getValue }) => getValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Name",
        }
    }),
    columnHelper.accessor("gender", {
        header: "Gender",
        cell: ({ getValue }) => getValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Gender",
        }
    }),
    columnHelper.accessor("phone", {
        header: "Phone",
        cell: ({ getValue }) => getValue(),
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
        cell: ({ getValue }) => getValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Email",
        }
    }),
    columnHelper.accessor("date_of_birth", {
        cell: ({ getValue }) => format(new Date(getValue() as string), "dd/MM/yyyy"),
        header: "Date of birth",
        footer: (info) => info.column.id,
        meta: {
            label: "Date of birth",
        }
    }),
    columnHelper.accessor("address", {
        header: "Address",
        cell: ({ getValue }) => getValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Address",
        }
    }),
]