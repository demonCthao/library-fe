import { DropdownHeaderTable } from "@/components/dropdown-header-table";
import { FieldSearch } from "@/components/field-search";
import Loading from "@/components/loading";
import { SelectApp } from "@/components/select-app";
import { DynamicTable as Table } from "@/components/table-dynamic";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE_10 } from "@/enum/search.enum";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetch } from "@/hooks/useFetch";
import { TypeActionTable, useTable } from "@/hooks/useTable";
import { convertObjectToParam } from "@/lib/utils";
import { BorrowRecord } from "@/models/borrow-record.model";
import { DataList } from "@/models/response.model";
import { BaseTableRef } from "@/types/base-ref.type";
import { PaginationState } from "@tanstack/react-table";
import { BookmarkPlus } from "lucide-react";
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { borrowRecordColumns } from "./borrow-record-column";

interface IBorrowTableProps {
  onChooseBorrow: (type: TypeActionTable, borrow?: BorrowRecord) => void;
}

const BorrowTable = forwardRef<BaseTableRef, IBorrowTableProps>(({ onChooseBorrow }, ref) => {
  const [search, setSearch] = useState<PaginationState & { readerName: string, phone: string, borrowDate: string, dueDate: string, returnDate: string, status: string }>({
    readerName: "",
    phone: "",
    borrowDate: "",
    dueDate: "",
    returnDate: "",
    status: "",
    pageIndex: 1,
    pageSize: PAGE_SIZE_10,
  });
  const readerNameDebounce = useDebounce(search.readerName);
  const phoneDebounce = useDebounce(search.phone);

  const { data, isLoading, error, refetch } = useFetch<DataList<BorrowRecord>>({
    url: `borrow-record?${convertObjectToParam(search)}`,
    key: ["borrow-record", search.status, search.borrowDate, search.dueDate, search.returnDate, readerNameDebounce, phoneDebounce],
  });

  const tableData = useTable<BorrowRecord>({
    data: data?.list ?? [],
    search: search,
    total: data?.total,
    columns: borrowRecordColumns,
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

  const onChangeStatus = (value: string) => {
    setSearch({
      ...search,
      status: value
    })
  }

  if (error instanceof Error) return <div>{error.message}</div>

  useImperativeHandle(ref, () => ({
    refresh() {
      refetch();
    }
  }));

  return (
    <div className="h-full">
      <div className="grid grid-cols-3 mt-[20px] mb-5 justify-between w-full">
        <div className="col-span-2 grid grid-cols-5 gap-3">
          <div>
            <FieldSearch
              label="Tên độc giả"
              placeholder="Nhập tên độc giả..."
              onChange={handleChangeInput}
              name="readerName"
            />
          </div>
          <div>
            <FieldSearch
              label="Số điện thoại độc giả"
              placeholder="Nhập số điện thoại..."
              onChange={handleChangeInput}
              name="phone"
            />
          </div>
          <div >
            <FieldSearch
              label="Ngày mượn"
              onChange={handleChangeInput}
              name="borrowDate"
              type="date"
              className="w-full"
            />
          </div>
          <div >
            <FieldSearch
              label="Ngày hết hạn"
              onChange={handleChangeInput}
              name="dueDate"
              type="date"
              className="w-full"
            />
          </div>
          <div>
            <FieldSearch
              label="Trạng thái"
              isHideIcon
            >
              <SelectApp
                options={[{ label: "Tất cả", value: " " }, { label: "Đang mượn", value: "borrowing" }, { label: "Quá hạn", value: "overdue" }, { label: "Đã trả", value: "returned" }]}
                onValueChange={onChangeStatus}
                placeholder="Trạng thái"
              />
            </FieldSearch>
          </div>
        </div>

        <div className="ml-auto w-fit flex gap-2 mt-7">
          <div>
            <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddBorrow}><BookmarkPlus size={18} /> Add</Button>
          </div>
          <DropdownHeaderTable table={tableData.table} />
        </div>
      </div>
      {isLoading ? <Loading /> : <Table tableData={tableData} />}
    </div>
  )
});

export default BorrowTable;
