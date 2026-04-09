import Loading from "@/components/loading";
import { DynamicTable as Table } from "@/components/table-dynamic";
import { useFetch } from "@/hooks/useFetch";
import { TypeActionTable, useTable } from "@/hooks/useTable";
import { BankAccount } from "@/models/bank.model";
import { DataList } from "@/models/response.model";
import { BaseTableRef } from "@/types/base-ref.type";
import { forwardRef, useImperativeHandle } from "react";
import { bankAccountColumns } from "./banking-column";
import { Button } from "@/components/ui/button";
import { DropdownHeaderTable } from "@/components/dropdown-header-table";
import { Landmark } from "lucide-react";

interface IBankingTableProps {
    onChooseBank: (type: TypeActionTable, bank?: BankAccount) => void;
}

const BankingTable = forwardRef<BaseTableRef, IBankingTableProps>(({ onChooseBank }, ref) => {
    const { data, isLoading, error, refetch } = useFetch<BankAccount[]>({
        url: "banks",
        key: ["banks"],
    });

    const tableData = useTable<BankAccount>({
        data: data?? [],
        search: { pageIndex: 1, pageSize: 100 },
        total: 10,
        columns: bankAccountColumns,
        setSearch: () => { },
        onChoose: (data, type) => {
            onChooseBank(type, data);
        }
    });

    const handleAddBorrow = () => {
        onChooseBank(TypeActionTable.add);
    }

    if (error instanceof Error) return <div>{error.message}</div>

    useImperativeHandle(ref, () => ({
        refresh() {
            refetch();
        }
    }));

    return (
        <div className="h-full flex flex-col">
            <div className="w-full mb-5">
                <div className="ml-auto w-fit flex gap-2">
                    <div>
                        <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddBorrow}><Landmark size={18} /> Add</Button>
                    </div>
                    <DropdownHeaderTable table={tableData.table} />
                </div>
            </div>
            {isLoading ? <Loading /> : <Table title="Quản lý danh sách tài khoản" tableData={tableData} />}
        </div>
    )
});

export default BankingTable;