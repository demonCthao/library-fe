import { DropdownHeaderTable } from '@/components/dropdown-header-table';
import { FieldSearch } from '@/components/field-search';
import Loading from '@/components/loading';
import { DynamicTable as Table } from "@/components/table-dynamic";
import { Button } from '@/components/ui/button';
import { PAGE_SIZE_10 } from '@/enum/search.enum';
import { useDebounce } from '@/hooks/useDebounce';
import { useFetch } from '@/hooks/useFetch';
import { useMutationRequest } from '@/hooks/useMutation';
import { TypeActionTable, useTable } from '@/hooks/useTable';
import { convertObjectToParam } from '@/lib/utils';
import { Fine } from '@/models/fine.model';
import { DataList } from '@/models/response.model';
import { BaseTableRef } from '@/types/base-ref.type';
import { PaginationState } from '@tanstack/react-table';
import { ArrowBigDownDash, Blinds } from 'lucide-react';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { fineColumns } from './fine-column';

interface IFineTableProps {
    onChooseFine: (type: TypeActionTable, fine?: Fine) => void;
}

const FineTable = forwardRef<BaseTableRef, IFineTableProps>(({ onChooseFine }, ref) => {
    const [search, setSearch] = useState<PaginationState & { name: string; phone: string }>({
        name: "",
        phone: "",
        pageIndex: 1,
        pageSize: PAGE_SIZE_10,
    });
    const nameDebounce = useDebounce(search.name);
    const phoneDebounce = useDebounce(search.phone);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const key = e.target.name;
        const value = e.target.value;

        setSearch({ ...search, [key]: value })
    }

    const { data, isLoading, error, refetch } = useFetch<DataList<Fine>>({
        url: `fines?${convertObjectToParam(search)}`,
        key: ["fines", nameDebounce, phoneDebounce],
    });

    const { mutateAsync } = useMutationRequest<Blob>({
        url: "categories/excel",
        method: "post",
        responseType: "blob",
        key: ["export_category"]
    });

    const tableData = useTable<Fine>({
        data: data?.list ?? [],
        search: search,
        total: data?.total,
        columns: fineColumns,
        setSearch: setSearch,
        onChoose: (data, type) => {
            onChooseFine(type, data);
        }
    });

    const handleAddFine = () => {
        onChooseFine(TypeActionTable.add)
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
            <div className="flex mt-[20px] justify-between w-full mb-5">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <FieldSearch
                            label="Tên độc giả"
                            placeholder="Nhập tên độc giả..."
                            onChange={handleChangeInput}
                            name="name"
                        />
                    </div>
                    <div>
                        <FieldSearch
                            label="Số điện thoại"
                            placeholder="Nhập số điện thoại..."
                            onChange={handleChangeInput}
                            name="phone"
                        />
                    </div>
                </div>
                <div className="ml-auto w-fit flex gap-2 mt-7">
                    <div>
                        <Button className="bg-sky-700 hover:bg-sky-600" onClick={handleExport}><ArrowBigDownDash size={18} /> Xuất dữ liệu</Button>
                    </div>
                    <div>
                        <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddFine}><Blinds size={18} /> Add</Button>
                    </div>
                    <DropdownHeaderTable table={tableData.table} />
                </div>
            </div>
            {isLoading ? <Loading /> : <Table tableData={tableData} />}
        </div>
    )
});

export default FineTable;