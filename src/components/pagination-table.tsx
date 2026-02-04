
import { type Table as TanStackTTable } from "@tanstack/react-table";
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "./ui/pagination";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { PAGE_SIZE_10, PAGE_SIZE_100, PAGE_SIZE_20, PAGE_SIZE_50 } from "@/enum/search.enum";

interface IPaginationTableProps<TData> {
    table: TanStackTTable<TData>
}

export const PaginationTable = <TData,>({ table }: IPaginationTableProps<TData>) => {
    return (
        <div className="flex items-center">
            <div>
                Page {table.getState().pagination.pageIndex + 1} /&nbsp;
                {table.getPageCount()}
            </div>
            <Pagination className="w-auto">
                <PaginationContent>
                    <PaginationItem>
                        <div className="flex gap-2 items-center">
                            <span>Rows per page</span>
                            <div>
                                <Select defaultValue={PAGE_SIZE_100.toString()}>
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
                            </div>
                        </div>
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
                    <PaginationItem>
                        <PaginationLink href="#">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" isActive>
                            2
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink href="#" aria-label="Go to next page" size="icon">
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