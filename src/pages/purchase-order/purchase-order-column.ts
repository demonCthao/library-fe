import { PurchaseOrder } from "@/models/purchase-order.model";
import {
    createColumnHelper
} from '@tanstack/react-table';
import { format } from "date-fns";

const columnHelper = createColumnHelper<PurchaseOrder>()

export const purchaseOrderColumns = [
    columnHelper.accessor("purchase_order_code", {
        header: "purchaseOrderCode",
        cell: ({ getValue }) => getValue(),
        sortUndefined: 'last',
        sortDescFirst: false,
        footer: (info) => info.column.id,
        filterFn: "includesString",
        meta: {
            label: "purchaseOrderCode",
            className: "text-center"
        }
    }),
    columnHelper.accessor(
        (row) => row.readers?.full_name ?? row.guest_name ?? "",
        {
            id: "buyerName",
            header: "Tên người mua",
            cell: ({ getValue }) => getValue(),
            sortUndefined: "last",
            sortDescFirst: false,
            footer: (info) => info.column.id,
            filterFn: "includesString",
            meta: {
                label: "buyerName",
                className: "text-center"
            }
        }
    ),
    columnHelper.accessor(
        (row) => row.readers?.phone ?? row.guest_phone ?? "",
        {
            id: "phone",
            header: "phone",
            cell: ({ getValue }) => getValue(),
            sortUndefined: "last",
            sortDescFirst: false,
            footer: (info) => info.column.id,
            filterFn: "includesString",
            meta: {
                label: "phone",
                className: "text-center"
            }
        }
    ),
    columnHelper.accessor("created_at", {
        cell: ({ getValue }) => format(new Date(getValue() as string), "dd/MM/yyyy"),
        header: "createdAt",
        footer: (info) => info.column.id,
        meta: {
            label: "createdAt",
            className: "text-center"
        }
    }),
]