import { type ColumnDef, type ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getSortedRowModel, PaginationState, type SortingState, useReactTable, type VisibilityState } from "@tanstack/react-table";
import { Dispatch, SetStateAction, useState } from "react";

export enum TypeActionTable {
    edit,
    delete,
    add
}

interface UseTableProps<TData> {
    data: TData[]
    total?: number
    search: PaginationState
    columns: ColumnDef<TData, any>[]
    setSearch: Dispatch<SetStateAction<PaginationState & any>>
    onChoose?: (data: TData, type: TypeActionTable) => void
    initialVisibility?: VisibilityState
}

export const useTable = <TData,>({ data, total, search, columns, setSearch, onChoose, initialVisibility = {} }: UseTableProps<TData>) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialVisibility)
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        pageCount: Math.ceil((total || 0) / search.pageSize),
        state: {
            sorting,
            columnVisibility,
            columnFilters,
            pagination: {
                pageIndex: search.pageIndex,
                pageSize: search.pageSize
            },
        },
    })

    return { table, setPagination: setSearch, onChoose: onChoose }
}