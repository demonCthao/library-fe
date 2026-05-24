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
import { Category } from '@/models/category.model';
import { DataList } from '@/models/response.model';
import { BaseTableRef } from '@/types/base-ref.type';
import { PaginationState } from '@tanstack/react-table';
import { ArrowBigDownDash, Blinds } from 'lucide-react';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { categoryColumns } from './category-column';
import { useCan } from '@/hooks/use-can';
import { PERMISSIONS } from '@/types/permission.type';
import { useTranslation } from 'react-i18next';

interface ICategoryTableProps {
    onChooseCategory: (type: TypeActionTable, category?: Category) => void;
}

const CategoryTable = forwardRef<BaseTableRef, ICategoryTableProps>(({ onChooseCategory }, ref) => {
    const { t } = useTranslation();
    const canMutationCategory = useCan([PERMISSIONS.categories[1]]);
    const canExportPCategory = useCan([PERMISSIONS.categories[3]]);
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

    const { data, isLoading, error, refetch } = useFetch<DataList<Category>>({
        url: `categories?${convertObjectToParam(search)}`,
        key: [
            "categories",
            nameDebounce,
            search.pageIndex.toString(),
            search.pageSize.toString()
        ],
    });

    const { mutateAsync } = useMutationRequest<Blob>({
        url: "categories/excel",
        method: "post",
        responseType: "blob",
        key: ["export_category"]
    });

    const tableData = useTable<Category>({
        data: data?.list ?? [],
        search: search,
        total: data?.total,
        columns: categoryColumns,
        setSearch: setSearch,
        onChoose: (data, type) => {
            onChooseCategory(type, data);
        }
    });

    const handleAddCategory = () => {
        onChooseCategory(TypeActionTable.add)
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

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className="h-full flex flex-col">
            <div className="grid grid-cols-3 justify-between w-full mb-2">
                <div className="col-span-2 grid grid-cols-2 gap-3">
                    <FieldSearch
                        label={t("categoryName")}
                        onChange={handleChangeInput}
                        name="name"
                        className="w-full"
                    />
                </div>

                <div className="ml-auto w-fit flex gap-2">
                    {
                        canExportPCategory && <div>
                            <Button className="bg-sky-700 hover:bg-sky-600" onClick={handleExport}><ArrowBigDownDash size={18} /> {t("exportData")}</Button>
                        </div>
                    }
                    {
                        canMutationCategory && <div>
                            <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddCategory}><Blinds size={18} /> {t("add")}</Button>
                        </div>
                    }
                    <DropdownHeaderTable table={tableData.table} />
                </div>
            </div>
            <Table useCanMutaion={canMutationCategory} title={t("categoryList")} tableData={tableData} />
        </div>
    )
});

export default CategoryTable;