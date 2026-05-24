import { statusBorrowMap } from "@/constants/borrow-status";
import { formatDate } from "@/lib/utils";
import { BorrowRecord } from "@/models/borrow-record.model";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<BorrowRecord>();

export const borrowRecordColumns = [
    columnHelper.accessor("borrow_code", {
        header: "Borrow Code",
        cell: (info) => info.getValue(),
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Borrow Code",
            className: "text-center"
        },
    }),

    columnHelper.accessor("users.full_name", {
        header: "Customer Name",
        cell: (info) => info.getValue(),
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Customer Name",
            className: "text-left",
            headerClassName: "text-left"
        },
    }),

    columnHelper.accessor("users.phone", {
        header: "Phone",
        cell: (info) => info.getValue(),
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Phone",
            className: "text-center"
        },
    }),

    columnHelper.accessor("users.email", {
        header: "Email",
        cell: (info) => info.getValue(),
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Email",
            headerClassName: "text-left"
        },
    }),

    columnHelper.accessor("borrow_date", {
        header: "Borrow Date",
        cell: ({ getValue }) => formatDate(getValue()),
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Borrow Date",
            className: "text-center"
        },
    }),

    columnHelper.accessor("due_date", {
        header: "Due Date",
        cell: ({ getValue }) => formatDate(getValue()),
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Due Date",
            className: "text-center"
        },
    }),

    columnHelper.accessor("return_date", {
        header: "Return Date",
        cell: ({ getValue }) => formatDate(getValue()),
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Return Date",
            className: "text-center"
        },
    }),

    columnHelper.accessor("status", {
        header: "Status",
        cell: (info) => {
            const status = info.getValue() as keyof typeof statusBorrowMap;
            const statusInfo = statusBorrowMap[status];

            return (
                <div className={`text-center px-2 py-1 rounded w-full text-xs font-medium ${statusInfo.className}`}>
                    {statusInfo.label}
                </div>
            );
        },
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Status",
        },
    })
];