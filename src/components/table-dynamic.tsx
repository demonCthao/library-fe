import { flexRender, PaginationState, type Table as TanStackTTable } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Edit, FilePlusCorner, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { PaginationTable } from "./pagination-table";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { TypeActionTable } from "@/hooks/useTable";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface IDynamicTableProps<TData> {
    title: string;
    tableData: {
        table: TanStackTTable<TData>;
        setPagination: Dispatch<SetStateAction<PaginationState>>;
        onChoose?: (data: TData, type: TypeActionTable) => void
    }
    useCanMutaion?: boolean
}

export const DynamicTable = <TData,>({ title, tableData, useCanMutaion }: IDynamicTableProps<TData>) => {
    const { t } = useTranslation();
    const { table, onChoose } = tableData;

    const onChooseRow = (data: TData, type: TypeActionTable) => {
        if (onChoose) {
            onChoose(data, type)
        }
    }

    return (
        <div className="relative top-6 flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md flex-1 mb-4 flex flex-col">
            <div className="relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-gray-900/20 shadow-lg -mt-6 mb-8 p-6">
                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">{title}</h6>
            </div>
            <div className="p-6 px-0 pt-0 pb-2 flex-1">
                <Table className="w-full min-w-[640px] table-auto overflow-scroll">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                <TableHead className="border-b border-blue-gray-50 py-3 px-5 text-left">
                                    <p className="block antialiased font-sans text-[11px] font-bold uppercase text-blue-gray-400">{t("no")}</p>
                                </TableHead>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead className="border-b border-blue-gray-50 py-3 text-center" key={header.id} colSpan={header.colSpan}>
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={
                                                        cn(
                                                            header.column.getCanSort()
                                                                ? "cursor-pointer select-none flex items-center gap-1"
                                                                : "",
                                                            "block antialiased font-sans text-[11px] font-bold uppercase text-blue-gray-400 text-center w-full",
                                                            header.column.columnDef.meta?.headerClassName
                                                        )

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
                                                    {header.column.getIsVisible() &&
                                                        (typeof header.column.columnDef.header === "string"
                                                            ? t(header.column.columnDef.header)
                                                            : flexRender(
                                                                header.column.columnDef.header,
                                                                header.getContext()
                                                            )
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
                                    onChoose && useCanMutaion &&
                                    <TableHead className="border-b border-blue-gray-50 py-3 px-5 text-center">
                                        <p className="block antialiased font-sans text-[11px] font-bold uppercase text-blue-gray-400">{t("actions")}</p>
                                    </TableHead>
                                }

                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className={cn(table.getRowModel().rows.length? "": "bg-gray-200")}>
                        {table.getRowModel().rows.length ? table.getRowModel().rows.map((row) => {
                            const pageIndex = table.getState().pagination?.pageIndex ?? 1;
                            const pageSize = table.getState().pagination?.pageSize ?? row.index + 1;

                            return <TableRow key={row.id}>
                                <TableCell className="py-3 px-5 border-b border-blue-gray-50">
                                    {(pageIndex - 1) * pageSize + row.index + 1}
                                </TableCell>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className={cn("border-b", cell.column.columnDef.meta?.className)}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                                {
                                    onChoose && useCanMutaion &&
                                    <TableCell className="w-[200px] border-b">
                                        <div className="flex gap-2 flex justify-center">
                                            <Button className="bg-green-500 hover:bg-green-600 cursor-pointer" onClick={() => onChooseRow(row.original, TypeActionTable.edit)}><Edit size={18} /></Button>
                                            <Button className="bg-red-500 hover:bg-red-600 cursor-pointer" onClick={() => onChooseRow(row.original, TypeActionTable.delete)}><Trash size={18} /></Button>
                                        </div>
                                    </TableCell>
                                }

                            </TableRow>
                        }) : <TableRow className="min-h-40">
                            <TableCell
                                colSpan={useCanMutaion ? table.getAllColumns().length + 2 : table.getAllColumns().length + 1}
                                className="h-40 text-center"
                            >
                                <div className="flex h-full items-center justify-center gap-2">
                                    <div className="flex gap-2 items-center justify-center text-white text-lg">
                                        <FilePlusCorner size={40} />
                                        {
                                            t("tableEmpty")
                                        }
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </div>
            <div className="mt-[10px] mb-5">
                <PaginationTable tableData={tableData} />
            </div>
        </div>
    )
}