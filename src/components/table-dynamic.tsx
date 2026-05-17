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
        onChoose?: (data: TData, type: TypeActionTable) => void;
    };
    useCanMutaion?: boolean;
}

export const DynamicTable = <TData,>({
    title,
    tableData,
    useCanMutaion,
}: IDynamicTableProps<TData>) => {
    const { t } = useTranslation();
    const { table, onChoose } = tableData;

    const onChooseRow = (data: TData, type: TypeActionTable) => {
        if (onChoose) {
            onChoose(data, type);
        }
    };

    return (
        <div className="relative top-6 flex flex-col rounded-xl bg-white shadow-md flex-1 min-h-0 overflow-hidden">
            {/* Header */}
            <div className="relative mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-lg -mt-6 mb-4 p-6 shrink-0">
                <h6 className="text-base font-semibold text-white">
                    {title}
                </h6>
            </div>

            {/* Table Scroll Area */}
            <div className="flex-1 min-h-0 overflow-auto px-6 pb-2">
                <Table className="min-w-[640px]">
                    <TableHeader className="sticky top-0 z-20 bg-white">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {/* STT */}
                                <TableHead className="sticky top-0 z-30 bg-white border-b py-3 px-5 text-left">
                                    <p className="text-[11px] font-bold uppercase text-blue-gray-400">
                                        {t("no")}
                                    </p>
                                </TableHead>

                                {/* Columns */}
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        className="sticky top-0 z-30 bg-white border-b py-3 text-center"
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={cn(
                                                    header.column.getCanSort()
                                                        ? "cursor-pointer select-none flex items-center justify-center gap-1"
                                                        : "",
                                                    "text-[11px] font-bold uppercase text-blue-gray-400 w-full",
                                                    header.column.columnDef.meta?.headerClassName
                                                )}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {header.column.getIsVisible() &&
                                                    (typeof header.column.columnDef.header === "string"
                                                        ? t(header.column.columnDef.header)
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        ))}

                                                {{
                                                    asc: <ArrowDown size={16} />,
                                                    desc: <ArrowUp size={16} />,
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </div>
                                        )}
                                    </TableHead>
                                ))}

                                {/* Actions */}
                                {onChoose && useCanMutaion && (
                                    <TableHead className="sticky top-0 z-30 bg-white border-b py-3 px-5 text-center">
                                        <p className="text-[11px] font-bold uppercase text-blue-gray-400">
                                            {t("actions")}
                                        </p>
                                    </TableHead>
                                )}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => {
                                const pageIndex =
                                    table.getState().pagination?.pageIndex ?? 1;

                                const pageSize =
                                    table.getState().pagination?.pageSize ??
                                    row.index + 1;

                                return (
                                    <TableRow
                                        key={row.id}
                                        className="hover:bg-muted/50"
                                    >
                                        {/* STT */}
                                        <TableCell className="py-3 px-5 border-b">
                                            {(pageIndex - 1) * pageSize + row.index + 1}
                                        </TableCell>

                                        {/* Cells */}
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className={cn(
                                                    "border-b",
                                                    cell.column.columnDef.meta?.className
                                                )}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}

                                        {/* Actions */}
                                        {onChoose && useCanMutaion && (
                                            <TableCell className="w-[200px] border-b">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        className="bg-green-500 hover:bg-green-600"
                                                        onClick={() =>
                                                            onChooseRow(
                                                                row.original,
                                                                TypeActionTable.edit
                                                            )
                                                        }
                                                    >
                                                        <Edit size={18} />
                                                    </Button>

                                                    <Button
                                                        className="bg-red-500 hover:bg-red-600"
                                                        onClick={() =>
                                                            onChooseRow(
                                                                row.original,
                                                                TypeActionTable.delete
                                                            )
                                                        }
                                                    >
                                                        <Trash size={18} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={
                                        useCanMutaion
                                            ? table.getAllColumns().length + 2
                                            : table.getAllColumns().length + 1
                                    }
                                    className="h-40 text-center"
                                >
                                    <div className="flex items-center justify-center gap-2 text-gray-500 text-lg">
                                        <FilePlusCorner size={40} />
                                        {t("tableEmpty")}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            <div className="shrink-0 border-t bg-white py-4">
                <PaginationTable tableData={tableData} />
            </div>
        </div>
    );
};