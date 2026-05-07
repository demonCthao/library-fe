import { Publisher } from "@/models/publisher.model";
import {
    createColumnHelper
} from '@tanstack/react-table';

const columnHelper = createColumnHelper<Publisher>()

export const publisherColumns = [
    columnHelper.accessor("name", {
        header: "name",
        cell: (info) => info.renderValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "name",
            headerClassName: "text-left"
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
    columnHelper.accessor("address", {
        header: "address",
        cell: (info) => info.renderValue(),
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