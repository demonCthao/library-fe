import { BankAccount } from "@/models/bank.model";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<BankAccount>();

export const bankAccountColumns = [
    columnHelper.accessor("owner_name", {
        header: "Owner Name",
        cell: (info) => info.getValue(),
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Owner Name",
        },
    }),

    columnHelper.accessor("account_number", {
        header: "Account Number",
        cell: (info) => info.getValue(),
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Account Number",
        },
    }),

    columnHelper.accessor("bank_name", {
        header: "Bank Name",
        cell: (info) => info.getValue(),
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Bank Name",
        },
    }),

    columnHelper.accessor("is_default", {
        header: "Default",
        cell: (info) => info.getValue() === 1? "True": "False",
        sortUndefined: "last",
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "Default",
        },
    }),

];