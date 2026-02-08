import Loading from "@/components/loading";
import { DynamicTable as Table } from "@/components/table-dynamic";
import { useFetch } from "@/hooks/useFetch";
import { useTable } from "@/hooks/useTable";
import { User } from "@/models/user.model";
import { userColumns } from "./user-column";
import { DataList } from "@/models/response.model";
import { useState } from "react";
import { PaginationState } from "@tanstack/react-table";
import { PAGE_SIZE_10 } from "@/enum/search.enum";
import { convertObjectToParam } from "@/lib/utils";
import { DropdownHeaderTable } from "@/components/dropdown-header-table";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { Button } from "@/components/ui/button";

interface IUserTableProps {
    onChooseUser: (user?: User) => void;
}

export default function UserTable({ onChooseUser }: IUserTableProps) {
    const [search, setSearch] = useState<PaginationState & { fullName: string, phone: string }>({
        fullName: "",
        phone: "",
        pageIndex: 1,
        pageSize: PAGE_SIZE_10,
    })
    const fullNameDebounce = useDebounce(search.fullName);
    const phoneDebounce = useDebounce(search.phone);
    const { data, isLoading, error } = useFetch<DataList<User>>({
        url: `users?${convertObjectToParam(search)}`,
        key: ["uers", search.pageIndex.toString(), search.pageSize.toString(), fullNameDebounce, phoneDebounce]
    });
    const tableData = useTable<User>({
        data: data?.list ?? [],
        search: search,
        total: data?.total,
        columns: userColumns,
        setSearch: setSearch,
        onChoose: (data) => {
            onChooseUser(data)
        }
    });

    if (error instanceof Error) return <div>{error.message}</div>

    return (
        <div className="h-full">
            <div className="flex mt-[20px] justify-between w-full">
                <div className="grid grid-cols-2 gap-3">
                    <div >
                        <Input type="text"
                            placeholder="Filter Full Name..."
                            onChange={e =>
                                setSearch({ ...search, fullName: e.target.value })
                            }
                            className="w-80"
                        />
                    </div>
                    <div >
                        <Input type="text"
                            placeholder="Filter Phone..."
                            onChange={e =>
                                setSearch({ ...search, phone: e.target.value })
                            }
                            className="w-80"
                        />
                    </div>
                </div>

                <div className="ml-auto w-fit mb-[20px] flex gap-2">
                    <div>
                        <Button className="bg-green-500 hover:bg-green-600" onClick={() => onChooseUser()}>Thêm mới</Button>
                    </div>
                    <DropdownHeaderTable table={tableData.table} />
                </div>
            </div>
            {isLoading ? <Loading /> : <Table tableData={tableData} />}
        </div>
    )
}
