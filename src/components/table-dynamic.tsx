import { flexRender, type Table as TanStackTTable } from "@tanstack/react-table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { PaginationTable } from "./pagination-table";

interface IDynamicTableProps<TData> {
    table: TanStackTTable<TData>
}

export const DynamicTable = <TData,>({ table }: IDynamicTableProps<TData>) => {

    return (
        <div className="w-full">
            <div className="grid w-full [&>div]:max-h-[calc(100vh-260px)] [&>div]:border [&>div]:rounded">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="*:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
                                <TableHead>
                                    No
                                </TableHead>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={
                                                        header.column.getCanSort()
                                                            ? 'cursor-pointer select-none flex items-center gap-1'
                                                            : ''
                                                    }
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    title={
                                                        header.column.getCanSort()
                                                            ? header.column.getNextSortingOrder() === 'asc'
                                                                ? 'Sort ascending'
                                                                : header.column.getNextSortingOrder() === 'desc'
                                                                    ? 'Sort descending'
                                                                    : 'Clear sort'
                                                            : undefined
                                                    }
                                                >
                                                    {header.column.getIsVisible() && flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                                    {{
                                                        asc: <ArrowDown size={16} />,
                                                        desc: <ArrowUp size={16} />,
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="overflow-hidden">
                        {table.getRowModel().rows.map((row) => {
                            const pageIndex = table.getState().pagination?.pageIndex ?? 0;
                            const pageSize = table.getState().pagination?.pageSize ?? row.index + 1;

                            return <TableRow key={row.id} className="odd:bg-muted/50 *:whitespace-nowrap">
                                <TableCell >
                                    {pageIndex * pageSize + row.index + 1}
                                </TableCell>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        })}
                    </TableBody>
                </Table>
            </div>
            <div className="mt-[25px] ml-auto">
                <PaginationTable table={table} />
            </div>
        </div>

    )
}