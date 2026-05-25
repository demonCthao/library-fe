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
import { useMutationRequest } from "@/hooks/useMutation";
import { TypeActionTable, useTable } from "@/hooks/useTable";
import { convertObjectToParam } from "@/lib/utils";
import { GoodsReceipt } from "@/models/good-receipt.model";
import { Publisher } from "@/models/publisher.model";
import { DataList } from "@/models/response.model";
import { BaseTableRef } from "@/types/base-ref.type";
import { DELETE, EXPORT, MUTATION } from "@/types/permission.type";
import { PaginationState } from "@tanstack/react-table";
import { ArrowBigDownDash, FilePlus } from "lucide-react";
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import { goodsReceiptColumns } from "./good-receipt-column";

interface IGoodsReceiptTableProps {
    onChooseReceipt: (type: TypeActionTable, receipt?: GoodsReceipt) => void;
}

const GoodsReceiptTable = forwardRef<BaseTableRef, IGoodsReceiptTableProps>(({ onChooseReceipt }, ref) => {
    const { t } = useTranslation();

    const canMutationReceipt = useCan([MUTATION.goods_receipts, DELETE.goods_receipts]);
    const canExportReceipt = useCan([EXPORT.goods_receipts]);

    const [search, setSearch] = useState<PaginationState & { code: string; publisher_id: string }>({
        code: "",
        publisher_id: "",
        pageIndex: 1,
        pageSize: PAGE_SIZE_10,
    });

    const codeDebounce = useDebounce(search.code);

    const { data, isLoading, error, refetch } = useFetch<DataList<GoodsReceipt>>({
        url: `goods-receipts?${convertObjectToParam(search)}`,
        key: ["goods-receipts", search.publisher_id, codeDebounce, search.pageIndex.toString(), search.pageSize.toString()],
    });

    const { data: publishers } = useFetch<Publisher[]>({
        url: "publishers/all",
        key: ["publishers"]
    });

    const { mutateAsync } = useMutationRequest<Blob>({
        url: "goods-receipts/excel",
        method: "post",
        responseType: "blob",
        key: ["export_goods_receipt"]
    });

    const tableData = useTable<GoodsReceipt>({
        data: data?.list ?? [],
        search: search,
        total: data?.total,
        columns: goodsReceiptColumns,
        setSearch: setSearch,
        onChoose: (data, type) => {
            onChooseReceipt(type, data);
        }
    });

    const handleAddReceipt = () => {
        onChooseReceipt(TypeActionTable.add);
    };

    const handleExport = async () => {
        const blob = await mutateAsync({
            code: "",
            publisher_id: "",
        });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "goods_receipts.xlsx";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    };

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;

        setSearch({
            ...search,
            [name]: value
        });
    };

    const onChangePublisher = (value: string) => {
        setSearch({
            ...search,
            publisher_id: value
        });
    };

    if (error instanceof Error) return <div>{error.message}</div>;

    useImperativeHandle(ref, () => ({
        refresh() {
            refetch();
        }
    }));

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="h-full flex flex-col">
            <div className="grid grid-cols-12 w-full mb-5 items-center">
                {/* Thanh công cụ tìm kiếm: Gom gọn thành 2 ô tìm kiếm chính */}
                <div className="col-span-8 grid grid-cols-4 gap-3">
                    <div>
                        <FieldSearch
                            type="text"
                            name="code"
                            onChange={handleChangeInput}
                            className="w-full"
                            label={t("receiptCode") || "Mã phiếu nhập"}
                        />
                    </div>
                    <div>
                        <FieldSearch
                            className="w-full"
                            label={t("publisher") || "Nhà xuất bản"}
                            isHideIcon
                        >
                            <SelectApp
                                options={publishers ? publishers.map(p => ({
                                    label: p.name,
                                    value: p.id.toString()
                                })) : []}
                                onValueChange={onChangePublisher}
                            />
                        </FieldSearch>
                    </div>
                </div>

                <div className="col-span-4 ml-auto w-fit flex gap-2">
                    {
                        canExportReceipt && <div>
                            <Button className="bg-sky-700 hover:bg-sky-600" onClick={handleExport}>
                                <ArrowBigDownDash size={18} /> {t("exportData")}
                            </Button>
                        </div>
                    }
                    {
                        canMutationReceipt && <div>
                            <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddReceipt}>
                                <FilePlus size={18} /> {t("add") || "Nhập sách"}
                            </Button>
                        </div>
                    }
                    <DropdownHeaderTable table={tableData.table} />
                </div>
            </div>

            <Table useCanMutaion={canMutationReceipt} title={t("goodsReceiptList") || "Danh sách phiếu nhập kho"} tableData={tableData} />
        </div>
    );
});

GoodsReceiptTable.displayName = "GoodsReceiptTable";

export default GoodsReceiptTable;