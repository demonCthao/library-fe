
import { PAGE_SIZE_10, PAGE_SIZE_100, PAGE_SIZE_20, PAGE_SIZE_50 } from "@/enum/search.enum";
import { PaginationState, type Table as TanStackTTable } from "@tanstack/react-table";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "./ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface IPaginationTableProps<TData> {
    tableData: {
        table: TanStackTTable<TData>;
        setPagination: Dispatch<SetStateAction<PaginationState>>;
    }
}

export const PaginationTable = <TData,>({ tableData }: IPaginationTableProps<TData>) => {
    const { table, setPagination } = tableData;
    return (
        <div className="flex items-center">
            <Pagination className="w-auto">
                <PaginationContent>
                    <PaginationItem>
                        <Select
                            value={table.getState().pagination.pageSize.toString()}
                            onValueChange={value => {
                                setPagination({ pageIndex: 1, pageSize: Number(value) })
                            }}>
                            <SelectTrigger className="w-[80px]">
                                <SelectValue defaultValue={PAGE_SIZE_10.toString()} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value={PAGE_SIZE_10.toString()}>{PAGE_SIZE_10}</SelectItem>
                                    <SelectItem value={PAGE_SIZE_20.toString()}>{PAGE_SIZE_20}</SelectItem>
                                    <SelectItem value={PAGE_SIZE_50.toString()}>{PAGE_SIZE_50}</SelectItem>
                                    <SelectItem value={PAGE_SIZE_100.toString()}>{PAGE_SIZE_100}</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" aria-label="Go to first page" size="icon">
                            <ChevronFirst className="h-4 w-4" />
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" aria-label="Go to previous page" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </PaginationLink>
                    </PaginationItem>
                    {
                        Array.from({ length: table.getPageCount() }).map((_, index) => {
                            return <PaginationItem key={`${index}`} className={index + 1 === table.getState().pagination.pageIndex ? "border rounded-[8px] bg-gray-400 text-white" : ""}>
                                <PaginationLink href="#" onClick={() => setPagination({ ...table.getState().pagination, pageIndex: index + 1 })}>{index + 1}</PaginationLink>
                            </PaginationItem>;
                        })
                    }
                    <PaginationItem>
                        <PaginationLink href="#" aria-label="Go to last page" size="icon">
                            <ChevronRight className="h-4 w-4" />
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" aria-label="Go to last page" size="icon">
                            <ChevronLast className="h-4 w-4" />
                        </PaginationLink>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>

    )
}