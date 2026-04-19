import { formatDate } from "@/lib/utils";
import { Fine } from "@/models/fine.model";
import {
    createColumnHelper
} from '@tanstack/react-table';

const columnHelper = createColumnHelper<Fine>()

export const fineColumns = [
    columnHelper.accessor("borrow_records.readers.full_name", {
        header: "readerName",
        cell: (info) => info.renderValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "readerName",
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
    columnHelper.accessor("borrow_records.readers.address", {
        header: "address",
        cell: (info) => info.renderValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "address",
        }
    }),
    columnHelper.accessor("amount", {
        header: "amount",
        cell: (info) => info.renderValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "amount",
        }
    }),
    columnHelper.accessor("reason", {
        header: "reason",
        cell: (info) => info.renderValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "reason",
        }
    }),
    columnHelper.accessor("borrow_records.return_date", {
        header: "returnDate",
        cell: ({ getValue }) => formatDate(getValue()),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "returnDate",
        }
    }),
    columnHelper.accessor("paid", {
        header: "status",
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
            label: "status",
        }
    }),
]