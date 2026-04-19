import { Author } from "@/models/author.model";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Author>();

export const authorColumns = [
    columnHelper.accessor("name", {
        header: "authorName",
        cell: (info) => info.getValue(),
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "authorName",
        },
    }),

    columnHelper.accessor("bio", {
        header: "biography",
        cell: (info) => info.getValue(),
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "biography",
        },
    })
];