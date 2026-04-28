import { DropdownHeaderTable } from "@/components/dropdown-header-table";
import Loading from "@/components/loading";
import { DynamicTable as Table } from "@/components/table-dynamic";
import { Button } from "@/components/ui/button";
import { useFetch } from "@/hooks/useFetch";
import { TypeActionTable, useTable } from "@/hooks/useTable";
import { BankAccount } from "@/models/bank.model";
import { BaseTableRef } from "@/types/base-ref.type";
import { Landmark } from "lucide-react";
import { forwardRef, useImperativeHandle } from "react";
import { bankAccountColumns } from "./banking-column";
import { useCan } from "@/hooks/use-can";
import { DELETE, MUTATION } from "@/types/permission.type";

interface IBankingTableProps {
    onChooseBank: (type: TypeActionTable, bank?: BankAccount) => void;
}

const BankingTable = forwardRef<BaseTableRef, IBankingTableProps>(({ onChooseBank }, ref) => {
    const canMutationBook = useCan([MUTATION.bank, DELETE.bank]);
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
            {isLoading ? <Loading /> : <Table useCanMutaion={canMutationBook} title="Quản lý danh sách tài khoản" tableData={tableData} />}
        </div>
    )
});

export default BankingTable;