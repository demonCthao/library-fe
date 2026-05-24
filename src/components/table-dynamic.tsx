import { TypeActionTable } from "@/hooks/useTable";
import { flexRender, PaginationState, type Table as TanStackTTable } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { PaginationTable } from "./pagination-table";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface IDynamicTableProps<TData> {
    title: string;
    tableData: {
        table: TanStackTTable<TData>;
        setPagination: Dispatch<SetStateAction<PaginationState>>;
        onChoose?: (data: TData, type: TypeActionTable) => void;
    };
    useCanMutaion?: boolean;
}

export const DynamicTable = <TData,>({ title, tableData, useCanMutaion }: IDynamicTableProps<TData>) => {
    const { t } = useTranslation();
    const { table, onChoose } = tableData;

    return (
        // Lớp cha ngoài cùng: w-full đảm bảo không tràn layout màn hình
        <div className="w-full flex flex-col h-full rounded-2xl bg-[#1a1a1c] border border-white/5 shadow-2xl overflow-hidden">
            <div className="shrink-0 p-6">
                <h6 className="text-xl font-bold text-white tracking-tight">{title}</h6>
            </div>

            {/* Lớp chứa bảng: 
                - min-w-0: Ngăn chặn div con giãn quá khổ màn hình
                - overflow-x-auto: Tạo thanh cuộn ngang khi bảng quá rộng
                - overflow-y-auto: Tạo thanh cuộn dọc trong nội dung nếu danh sách dài
            */}
            <div className="flex-1 min-h-0 min-w-0 overflow-x-auto overflow-y-auto custom-scrollbar px-2">
                
                {/* Thẻ Table:
                    - w-full: Giãn theo khung nếu bảng nhỏ
                    - min-w-[800px]: Độ rộng tối thiểu, nếu màn hình nhỏ hơn 800px 
                      thanh cuộn ngang sẽ tự hiện ra ở vùng div này
                */}
                <Table className="w-full min-w-[800px] border-separate border-spacing-y-2">
                    <TableHeader className="sticky top-0 z-20 bg-[#1a1a1c]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                                <TableHead className="w-16 bg-[#252529] sticky left-0 z-30 rounded-l-xl text-center">
                                    <span className="text-[10px] font-bold text-emerald-500/70 uppercase">{t("no")}</span>
                                </TableHead>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="bg-[#252529] border-none text-center whitespace-nowrap">
                                        <div className="text-[10px] font-bold uppercase text-gray-400">
                                            {header.isPlaceholder
                                                ? null
                                                : (() => {
                                                    const headerContent = flexRender(header.column.columnDef.header, header.getContext());
                                                    return typeof headerContent === "string"
                                                        ? t(headerContent)
                                                        : headerContent;
                                                })()}
                                        </div>
                                    </TableHead>
                                ))}
                                {onChoose && useCanMutaion && (
                                    <TableHead className="sticky right-0 z-30 bg-[#252529] rounded-r-xl border-none text-center min-w-[100px]">
                                        <span className="text-[10px] font-bold uppercase text-gray-400">{t("actions")}</span>
                                    </TableHead>
                                )}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="group bg-[#212124] hover:bg-emerald-500/[0.03] transition-all border-none">
                                <TableCell className="sticky left-0 z-10 bg-[#212124] text-center rounded-l-xl text-gray-400">
                                    {row.index + 1}
                                </TableCell>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="text-gray-300 text-sm whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                                {onChoose && useCanMutaion && (
                                    <TableCell className="sticky right-0 z-10 bg-[#212124] group-hover:bg-emerald-500/[0.03] rounded-r-xl text-center">
                                        <div className="flex justify-center gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-500 hover:bg-emerald-500/10" onClick={() => onChoose(row.original, TypeActionTable.edit)}>
                                                <Edit size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:bg-red-500/10" onClick={() => onChoose(row.original, TypeActionTable.delete)}>
                                                <Trash size={16} />
                                            </Button>
                                        </div>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="shrink-0 border-t border-white/5 bg-[#1a1a1c] py-4 px-6">
                <PaginationTable tableData={tableData} />
            </div>
        </div>
    );
};