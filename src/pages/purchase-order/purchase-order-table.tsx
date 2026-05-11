import { DropdownHeaderTable } from "@/components/dropdown-header-table";
import { FieldSearch } from "@/components/field-search";
import Loading from "@/components/loading";
import { SelectApp } from "@/components/select-app";
import { DynamicTable as Table } from "@/components/table-dynamic";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE_10 } from "@/enum/search.enum";
import { useCan } from "@/hooks/use-can";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetch } from "@/hooks/useFetch";
import { TypeActionTable, useTable } from "@/hooks/useTable";
import { convertObjectToParam } from "@/lib/utils";
import { PurchaseOrder } from "@/models/purchase-order.model";
import { DataList } from "@/models/response.model";
import { BaseTableRef } from "@/types/base-ref.type";
import { PERMISSIONS } from "@/types/permission.type";
import { PaginationState } from "@tanstack/react-table";
import { ShoppingCart } from "lucide-react";
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { purchaseOrderColumns } from "./purchase-order-column";

interface IPurchaseOrderTableProps {
    onChooseBorrow: (type: TypeActionTable, purchaseOrder?: PurchaseOrder) => void;
}

const PurchaseOrderTable = forwardRef<BaseTableRef, IPurchaseOrderTableProps>(({ onChooseBorrow }, ref) => {
    const { t } = useTranslation();
    const canMutationBorrow = useCan([PERMISSIONS.borrows[1]]);
    const [search, setSearch] = useState<PaginationState & { readerName: string, phone: string, createdAt: string }>({
        readerName: "",
        phone: "",
        createdAt: "",
        pageIndex: 1,
        pageSize: PAGE_SIZE_10,
    });
    const readerNameDebounce = useDebounce(search.readerName);
    const phoneDebounce = useDebounce(search.phone);

    const { data, isLoading, error, refetch } = useFetch<DataList<PurchaseOrder>>({
        url: `purchase-orders?${convertObjectToParam(search)}`,
        key: ["purchase-orders", search.createdAt, readerNameDebounce, phoneDebounce],
    });

    const tableData = useTable<PurchaseOrder>({
        data: data?.list ?? [],
        search: search,
        total: data?.total,
        columns: purchaseOrderColumns,
        setSearch: setSearch,
        onChoose: (data, type) => {
            onChooseBorrow(type, data);
        }
    });

    const handleAddBorrow = () => {
        onChooseBorrow(TypeActionTable.add);
    }

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;

        setSearch({
            ...search,
            [name]: value
        })
    }

    if (error instanceof Error) return <div>{error.message}</div>

    useImperativeHandle(ref, () => ({
        refresh() {
            refetch();
        }
    }));

    return (
        <div className="h-full flex flex-col">
            <div className="grid grid-cols-5 mb-5 justify-between w-full">
                <div className="col-span-4 grid grid-cols-5 gap-3">
                    <div>
                        <FieldSearch
                            label={t("readerName")}
                            onChange={handleChangeInput}
                            name="readerName"
                        />
                    </div>
                    <div>
                        <FieldSearch
                            label={t("phone")}
                            onChange={handleChangeInput}
                            name="phone"
                        />
                    </div>
                    <div >
                        <FieldSearch
                            label={t("createdAt")}
                            onChange={handleChangeInput}
                            name="createdAt"
                            type="date"
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="ml-auto w-fit flex gap-2">
                    {
                        canMutationBorrow &&
                        <div>
                            <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddBorrow}><ShoppingCart size={18} /> {t("add")}</Button>
                        </div>
                    }
                    <DropdownHeaderTable table={tableData.table} />
                </div>
            </div>
            {isLoading ? <Loading /> : <Table useCanMutaion={canMutationBorrow} title={t("borrowingList")} tableData={tableData} />}
        </div>
    )
});

export default PurchaseOrderTable;
