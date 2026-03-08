import { DropdownHeaderTable } from "@/components/dropdown-header-table";
import Loading from "@/components/loading";
import { DynamicTable as Table } from "@/components/table-dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PAGE_SIZE_10 } from "@/enum/search.enum";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetch } from "@/hooks/useFetch";
import { useMutationRequest } from "@/hooks/useMutation";
import { TypeActionTable, useTable } from "@/hooks/useTable";
import { convertObjectToParam } from "@/lib/utils";
import { Publisher } from "@/models/publisher.model";
import { DataList } from "@/models/response.model";
import { BaseTableRef } from "@/types/base-ref.type";
import { PaginationState } from "@tanstack/react-table";
import { ArrowBigDownDash, Blinds } from "lucide-react";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { publisherColumns } from "./publisher-column";

interface IPublisherTableProps {
    onChoosePublisher: (type: TypeActionTable, publisher?: Publisher) => void;
}

const PublisherTable = forwardRef<BaseTableRef, IPublisherTableProps>(({ onChoosePublisher }, ref) => {
    const [search, setSearch] = useState<PaginationState & { name: string }>({
        name: "",
        pageIndex: 1,
        pageSize: PAGE_SIZE_10,
    });
    const nameDebounce = useDebounce(search.name);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const key = e.target.name;
        const value = e.target.value;

        setSearch({ ...search, [key]: value })
    }

    const { data, isLoading, error, refetch } = useFetch<DataList<Publisher>>({
        url: `publishers?${convertObjectToParam(search)}`,
        key: ["publishers", nameDebounce],
    });

    const { mutateAsync } = useMutationRequest<Blob>({
        url: "publishers/excel",
        method: "post",
        responseType: "blob",
        key: ["export_publisher"]
    });

    const tableData = useTable<Publisher>({
        data: data?.list ?? [],
        search: search,
        total: data?.total,
        columns: publisherColumns,
        setSearch: setSearch,
        onChoose: (data, type) => {
            onChoosePublisher(type, data);
        }
    });

    const handleAddPublisher = () => {
        onChoosePublisher(TypeActionTable.add)
    }

    const handleExport = async () => {
        const blob = await mutateAsync({
            title: "",
            description: "",
        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "categories.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
    }

    if (error instanceof Error) return <div>{error.message}</div>

    useImperativeHandle(ref, () => ({
        refresh() {
            refetch();
        }
    }));

    return (
        <div className="h-full">
            <div className="flex mt-[20px] justify-between w-full">
                <div className="grid grid-cols-2 gap-3">
                    <div >
                        <Input type="text"
                            placeholder="Filter Name..."
                            name="name"
                            onChange={handleChangeInput}
                            className="w-80"
                        />
                    </div>
                </div>

                <div className="ml-auto w-fit mb-[20px] flex gap-2">
                    <div>
                        <Button className="bg-sky-700 hover:bg-sky-600" onClick={handleExport}><ArrowBigDownDash size={18} /> Xuất dữ liệu</Button>
                    </div>
                    <div>
                        <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddPublisher}><Blinds size={18} /> Add</Button>
                    </div>
                    <DropdownHeaderTable table={tableData.table} />
                </div>
            </div>
            {isLoading ? <Loading /> : <Table tableData={tableData} />}
        </div>
    )
});

export default PublisherTable;