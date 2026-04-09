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
import { Author } from "@/models/author.model";
import { DataList } from "@/models/response.model";
import { BaseTableRef } from "@/types/base-ref.type";
import { PaginationState } from "@tanstack/react-table";
import { ArrowBigDownDash, BookUser } from "lucide-react";
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { authorColumns } from "./author-column";

interface IAuthorTableProps {
  onChooseAuthor: (type: TypeActionTable, author?: Author) => void;
}

const AuthorTable = forwardRef<BaseTableRef, IAuthorTableProps>(({ onChooseAuthor }, ref) => {
  const [search, setSearch] = useState<PaginationState & { name: string, bio: string }>({
    name: "",
    bio: "",
    pageIndex: 1,
    pageSize: PAGE_SIZE_10,
  });
  const nameDebounce = useDebounce(search.name);
  const bioYearDebounce = useDebounce(search.bio);

  const { data, isLoading, error, refetch } = useFetch<DataList<Author>>({
    url: `authors?${convertObjectToParam(search)}`,
    key: ["authors", nameDebounce, bioYearDebounce],
  });


  const { mutateAsync } = useMutationRequest<Blob>({
    url: "authors/excel",
    method: "post",
    responseType: "blob",
    key: ["export_author"]
  });

  const tableData = useTable<Author>({
    data: data?.list ?? [],
    search: search,
    total: data?.total,
    columns: authorColumns,
    setSearch: setSearch,
    onChoose: (data, type) => {
      onChooseAuthor(type, data);
    }
  });

  const handleAddAuthor = () => {
    onChooseAuthor(TypeActionTable.add);
  }

  const handleExport = async () => {
    const blob = await mutateAsync({
      title: "",
      description: "",
    });

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "authors.xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
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
      <div className="grid grid-cols-3 justify-between w-full mb-5">
        <div className="col-span-2 grid grid-cols-4 gap-3">
          <div>
            <FieldSearch
              label="Tên tác giả"
              onChange={handleChangeInput}
              name="name"
              className="w-full"
            />
          </div>
          <div>
            <FieldSearch
              label="Tiểu sử"
              onChange={handleChangeInput}
              name="bio"
              className="w-full"
            />
          </div>
        </div>

        <div className="ml-auto w-fit flex gap-2">
          <div>
            <Button className="bg-sky-700 hover:bg-sky-600" onClick={handleExport}><ArrowBigDownDash size={18} /> Xuất dữ liệu</Button>
          </div>
          <div>
            <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddAuthor}><BookUser size={18} /> Add</Button>
          </div>
          <DropdownHeaderTable table={tableData.table} />
        </div>
      </div>
      {isLoading ? <Loading /> : <Table title="Danh sách tác giả" tableData={tableData} />}
    </div>
  )
});

export default AuthorTable;
