import { Reader } from "@/models/reader.model";
import {
    createColumnHelper
} from '@tanstack/react-table';
import { format } from "date-fns";

const columnHelper = createColumnHelper<Reader>()

export const readerColumns = [
    columnHelper.accessor("reader_code", {
        header: "readerCode",
        cell: ({ getValue }) => getValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "readerCode",
            className: "text-center"
        }
    }),
    columnHelper.accessor("full_name", {
        header: "name",
        cell: ({ getValue }) => getValue(),
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
    columnHelper.accessor("gender", {
        header: "gender",
        cell: ({ getValue }) => getValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "gender",
            className: "text-center"
        }
    }),
    columnHelper.accessor("phone", {
        header: "phone",
        cell: ({ getValue }) => getValue(),
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
        cell: ({ getValue }) => getValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Email",
            headerClassName: "text-left"
        }
    }),
    columnHelper.accessor("date_of_birth", {
        cell: ({ getValue }) => format(new Date(getValue() as string), "dd/MM/yyyy"),
        header: "dateOfBirth",
        footer: (info) => info.column.id,
        meta: {
            label: "dateOfBirth",
            className: "text-center"
        }
    }),
    columnHelper.accessor("address", {
        header: "address",
        cell: ({ getValue }) => getValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "address",
            headerClassName: "text-left"
        }
    }),
]