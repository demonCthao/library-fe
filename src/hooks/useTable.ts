import { type ColumnDef, getCoreRowModel, getSortedRowModel, type SortingState, useReactTable, type VisibilityState, type ColumnFiltersState, getFilteredRowModel } from "@tanstack/react-table";
import { useState } from "react";


interface UseTableProps<TData> {
    data: TData[]
    columns: ColumnDef<TData, any>[]
    initialVisibility?: VisibilityState
}

export const useTable = <TData,>({ data, columns, initialVisibility = {} }: UseTableProps<TData>) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialVisibility)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    return useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnVisibility,
            columnFilters
        },
    })
}