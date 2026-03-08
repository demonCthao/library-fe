import { Publisher } from "@/models/publisher.model";
import {
    createColumnHelper
} from '@tanstack/react-table';

const columnHelper = createColumnHelper<Publisher>()

export const publisherColumns = [
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
    columnHelper.accessor("address", {
        header: "Address",
        cell: (info) => info.renderValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Address",
        }
    }),
]