import { DropdownHeaderTable } from "@/components/dropdown-header-table";
import { FieldSearch } from "@/components/field-search";
import Loading from "@/components/loading";
import { DynamicTable as Table } from "@/components/table-dynamic";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE_10 } from "@/enum/search.enum";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetch } from "@/hooks/useFetch";
import { useMutationRequest } from "@/hooks/useMutation";
import { TypeActionTable, useTable } from "@/hooks/useTable";
import { convertObjectToParam } from "@/lib/utils";
import { DataList } from "@/models/response.model";
import { User } from "@/models/user.model";
import { BaseTableRef } from "@/types/base-ref.type";
import { PaginationState } from "@tanstack/react-table";
import _ from "lodash";
import { ArrowBigDownDash, UserPlus } from "lucide-react";
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { userColumns } from "./user-column";

interface IUserTableProps {
    onChooseUser: (type: TypeActionTable, user?: User) => void;
}

const UserTable = forwardRef<BaseTableRef, IUserTableProps>(({ onChooseUser }, ref) => {
    const [search, setSearch] = useState<PaginationState & { fullName: string, phone: string }>({
        fullName: "",
        phone: "",
        pageIndex: 1,
        pageSize: PAGE_SIZE_10,
    });
    const fullNameDebounce = useDebounce(search.fullName);
    const phoneDebounce = useDebounce(search.phone);
    const { data, isLoading, error, refetch } = useFetch<DataList<User>>({
        url: `users?${convertObjectToParam(search)}`,
        key: ["users", _.toString(search.pageIndex + search.pageSize), fullNameDebounce, phoneDebounce]
    });

    const { mutateAsync } = useMutationRequest<Blob>({
        url: "users/excel",
        method: "post",
        responseType: "blob",
        key: ["export_user"]
    });

    const tableData = useTable<User>({
        data: data?.list ?? [],
        search: search,
        total: data?.total,
        columns: userColumns,
        setSearch: setSearch,
        onChoose: (data, type) => {
            onChooseUser(type, data);
        }
    });

    const handleAddUser = () => {
        onChooseUser(TypeActionTable.add);
    }

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;

        setSearch({
            ...search,
            [name]: value
        })
    }

    const handleExport = async () => {
        const blob = await mutateAsync({
            title: "",
            description: "",
        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "books.xlsx";
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
        <div className="h-full flex flex-col">
            <div className="grid grid-cols-4 w-full mb-5">
                <div className="col-span-3 grid grid-cols-3 gap-3">
                    <div>
                        <FieldSearch
                            label="Tên người dùng"
                            onChange={handleChangeInput}
                            name="fullName"
                            className="w-full"
                        />
                    </div>
                    <div>
                        <FieldSearch
                            label="Số điện thoại"
                            onChange={handleChangeInput}
                            name="phone"
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="ml-auto w-fit flex gap-2">
                    <div>
                        <Button className="bg-sky-700 hover:bg-sky-600" onClick={handleExport}><ArrowBigDownDash size={18} /> Xuất dữ liệu</Button>
                    </div>
                    <div>
                        <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddUser}><UserPlus size={18} /> Add</Button>
                    </div>
                    <DropdownHeaderTable table={tableData.table} />
                </div>
            </div>
            {isLoading ? <Loading /> : <Table title="Danh sách người dùng" tableData={tableData} />}
        </div>
    )
});

export default UserTable;