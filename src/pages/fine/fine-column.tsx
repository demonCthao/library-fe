import { formatDate } from "@/lib/utils";
import { Fine } from "@/models/fine.model";
import {
    createColumnHelper
} from '@tanstack/react-table';

const columnHelper = createColumnHelper<Fine>()

export const fineColumns = [
    columnHelper.accessor("borrow_records.readers.full_name", {
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
    columnHelper.accessor("borrow_records.readers.email", {
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
    columnHelper.accessor("borrow_records.readers.phone", {
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
    columnHelper.accessor("borrow_records.readers.address", {
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
    columnHelper.accessor("amount", {
        header: "Amount",
        cell: (info) => info.renderValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Amount",
        }
    }),
    columnHelper.accessor("reason", {
        header: "Reason",
        cell: (info) => info.renderValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Reason",
        }
    }),
    columnHelper.accessor("borrow_records.return_date", {
        header: "Return date",
        cell: ({ getValue }) => formatDate(getValue()),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Return date",
        }
    }),
    columnHelper.accessor("paid", {
        header: "Paid",
        cell: (info) => {
            const value = info.getValue();

            return value? (
                <div className="text-center px-2 py-1 rounded w-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                    Đã thanh toán
                </div>
            ) : (
                <div className="text-center px-2 py-1 rounded w-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">
                    Chưa thanh toán
                </div>
            );
        },
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Paid",
        }
    }),
]