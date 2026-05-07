import { BankAccount } from "@/models/bank.model";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<BankAccount>();

export const bankAccountColumns = [
    columnHelper.accessor("owner_name", {
        header: "ownerName",
        cell: (info) => info.getValue(),
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "ownerName",
            headerClassName: "text-left"
        },
    }),

    columnHelper.accessor("account_number", {
        header: "accountNumber",
        cell: (info) => info.getValue(),
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "accountNumber",
            className: "text-center"
        },
    }),

    columnHelper.accessor("bank_name", {
        header: "bankName",
        cell: (info) => info.getValue(),
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "bankName",
            className: "text-center"
        },
    }),

    columnHelper.accessor("is_default", {
        header: "default",
        cell: (info) => info.getValue() === 1? "True": "False",
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "default",
            className: "text-center"
        },
    }),

];