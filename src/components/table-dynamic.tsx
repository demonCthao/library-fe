import { flexRender, PaginationState, type Table as TanStackTTable } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Edit, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { PaginationTable } from "./pagination-table";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";

interface IDynamicTableProps<TData> {
    tableData: {
        table: TanStackTTable<TData>;
        setPagination: Dispatch<SetStateAction<PaginationState>>;
        onChoose?: (data: TData) => void
    }
}

export const DynamicTable = <TData,>({ tableData }: IDynamicTableProps<TData>) => {
    const { table, onChoose } = tableData;

    const onChooseRow = (data: TData) => {
        if (onChoose) {
            onChoose(data)
        }
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="grid w-full [&>div]:border flex-1">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="*:whitespace-nowrap sticky top-0 bg-background after:content-[''] after:inset-x-0 after:h-px after:bg-border after:absolute after:bottom-0">
                                <TableHead className="text-center">
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
                                {
                                    onChoose &&
                                    <TableHead className="text-center">
                                        Actions
                                    </TableHead>
                                }
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="overflow-hidden h-full [&_tr:last-child]:border">
                        {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => {
                            const pageIndex = table.getState().pagination?.pageIndex ?? 1;
                            const pageSize = table.getState().pagination?.pageSize ?? row.index + 1;

                            return <TableRow key={row.id} className="odd:bg-muted/50 *:whitespace-nowrap">
                                <TableCell className="text-center">
                                    {(pageIndex - 1) * pageSize + row.index + 1}
                                </TableCell>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                                {
                                    onChoose &&
                                    <TableCell className="w-[200px]">
                                        <div className="flex gap-2 flex justify-center">
                                            <Button className="bg-green-500 hover:bg-green-600" onClick={() => onChooseRow(row.original)}><Edit size={18} /></Button>
                                            <Button className="bg-red-500 hover:bg-red-600" onClick={() => onChooseRow(row.original)}><Trash size={18} /></Button>
                                        </div>
                                    </TableCell>
                                }

                            </TableRow>
                        }) : <TableRow className="h-full">
                            Empty
                        </TableRow>}
                    </TableBody>
                </Table>
            </div>
            <div className="mt-[25px]">
                <PaginationTable tableData={tableData} />
            </div>
        </div>

    )
}