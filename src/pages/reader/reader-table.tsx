import { DropdownHeaderTable } from "@/components/dropdown-header-table";
import { FieldSearch } from "@/components/field-search";
import Loading from "@/components/loading";
import { DynamicTable as Table } from "@/components/table-dynamic";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE_10 } from "@/enum/search.enum";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetch } from "@/hooks/useFetch";
import { TypeActionTable, useTable } from "@/hooks/useTable";
import { convertObjectToParam } from "@/lib/utils";
import { Reader } from "@/models/reader.model";
import { DataList } from "@/models/response.model";
import { BaseTableRef } from "@/types/base-ref.type";
import { PaginationState } from "@tanstack/react-table";
import _ from "lodash";
import { UserRoundPlus } from "lucide-react";
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { readerColumns } from "./reader-column";
import { useTranslation } from "react-i18next";
import { useCan } from "@/hooks/use-can";
import { PERMISSIONS } from "@/types/permission.type";

interface IUserTableProps {
    onChooseReader: (type: TypeActionTable, reader?: Reader) => void;
}

const ReaderTable = forwardRef<BaseTableRef, IUserTableProps>(({ onChooseReader }, ref) => {
    const { t } = useTranslation();
    const canMutationReader = useCan([PERMISSIONS.readers[1]]);
    const [search, setSearch] = useState<PaginationState & { fullName: string, phone: string, email: string }>({
        fullName: "",
        phone: "",
        email: "",
        pageIndex: 1,
        pageSize: PAGE_SIZE_10,
    });
    const fullNameDebounce = useDebounce(search.fullName);
    const phoneDebounce = useDebounce(search.phone);
    const emailDebounce = useDebounce(search.phone);
    const { data, isLoading, error, refetch } = useFetch<DataList<Reader>>({
        url: `readers?${convertObjectToParam(search)}`,
        key: ["readers", _.toString(search.pageIndex + search.pageSize), fullNameDebounce, phoneDebounce, emailDebounce]
    });

    const tableData = useTable<Reader>({
        data: data?.list ?? [],
        search: search,
        total: data?.total,
        columns: readerColumns,
        setSearch: setSearch,
        onChoose: (data, type) => {
            onChooseReader(type, data);
        }
    });

    const handleAddReader = () => {
        onChooseReader(TypeActionTable.add);
    }

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const key = e.target.name;
        const value = e.target.value;

        setSearch({ ...search, [key]: value })
    }

    if (error instanceof Error) return <div>{error.message}</div>

    useImperativeHandle(ref, () => ({
        refresh() {
            refetch();
        }
    }));

    return (
        <div className="h-full flex flex-col">
            <div className="grid grid-cols-5 w-full mb-5">
                <div className="col-span-4 grid grid-cols-4 gap-3">
                    <div >
                        <FieldSearch
                            type="text"
                            onChange={handleChangeInput}
                            className="w-full"
                            name="fullName"
                            label={t("name")}
                        />
                    </div>
                    <div >
                        <FieldSearch
                            type="text"
                            onChange={handleChangeInput}
                            name="phone"
                            className="w-full"
                            label={t("phone")}
                        />
                    </div>
                    <div >
                        <FieldSearch
                            type="text"
                            onChange={handleChangeInput}
                            name="email"
                            className="w-full"
                            label="Email"
                        />
                    </div>
                </div>

                <div className="ml-auto w-fit flex gap-2">
                    {
                        canMutationReader && <div>
                            <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddReader}><UserRoundPlus size={18} /> {t("add")}</Button>
                        </div>
                    }
                    <DropdownHeaderTable table={tableData.table} />
                </div>
            </div>
            {isLoading ? <Loading /> : <Table title={t("patronList")} tableData={tableData} />}
        </div>
    )
});

export default ReaderTable;