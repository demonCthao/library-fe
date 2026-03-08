import { ChangeEvent, forwardRef, useImperativeHandle } from "react";
import Loading from "@/components/loading";
import { PAGE_SIZE_10 } from "@/enum/search.enum";
import { useFetch } from "@/hooks/useFetch";
import { TypeActionTable, useTable } from "@/hooks/useTable";
import { convertObjectToParam } from "@/lib/utils";
import { Book } from "@/models/book.model";
import { DataList } from "@/models/response.model";
import { PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import { bookColumns } from "./book-column";
import { DynamicTable as Table } from "@/components/table-dynamic";
import { Input } from "@/components/ui/input";
import { DropdownHeaderTable } from "@/components/dropdown-header-table";
import { Button } from "@/components/ui/button";
import { ArrowBigDownDash, BookPlus } from "lucide-react";
import { BaseTableRef } from "@/types/base-ref.type";
import { Category } from "@/models/category.model";
import { SelectApp } from "@/components/select-app";
import { useDebounce } from "@/hooks/useDebounce";
import { useMutationRequest } from "@/hooks/useMutation";
import { FieldSearch } from "@/components/field-search";

interface IBookTableProps {
  onChooseBook: (type: TypeActionTable, book?: Book) => void;
}

const BookTable = forwardRef<BaseTableRef, IBookTableProps>(({ onChooseBook }, ref) => {
  const [search, setSearch] = useState<PaginationState & { title: string, description: string, publish_year: string, category_id: string }>({
    title: "",
    description: "",
    publish_year: "",
    category_id: "",
    pageIndex: 1,
    pageSize: PAGE_SIZE_10,
  });
  const titleDebounce = useDebounce(search.title);
  const publishYearDebounce = useDebounce(search.publish_year);
  const descriptionDebounce = useDebounce(search.description);

  const { data, isLoading, error, refetch } = useFetch<DataList<Book>>({
    url: `books?${convertObjectToParam(search)}`,
    key: ["books", search.category_id, titleDebounce, publishYearDebounce, descriptionDebounce],
  });

  const { data: categories } = useFetch<Category[]>({
    url: "categories/all",
    key: ["categories"]
  });


  const { mutateAsync } = useMutationRequest<Blob>({
    url: "books/excel",
    method: "post",
    responseType: "blob",
    key: ["export_book"]
  });

  const tableData = useTable<Book>({
    data: data?.list ?? [],
    search: search,
    total: data?.total,
    columns: bookColumns,
    setSearch: setSearch,
    onChoose: (data, type) => {
      onChooseBook(type, data);
    }
  });

  const handleAddBook = () => {
    onChooseBook(TypeActionTable.add);
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

  const handleChangeInput = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setSearch({
      ...search,
      [name]: value
    })
  }

  const onChangeCategory = (value: string) => {
    setSearch({
      ...search,
      category_id: value
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
      <div className="grid grid-cols-3 mt-[20px] justify-between w-full mb-5 items-center">
        <div className="col-span-2 grid grid-cols-4 gap-3">
          <div>
            <FieldSearch
              type="text"
              placeholder="Filter Title..."
              name="title"
              onChange={handleChangeInput}
              className="w-full"
              label="Tên sách"
            />
          </div>
          <div>
            <FieldSearch
              type="text"
              placeholder="Filter Description..."
              name="description"
              onChange={handleChangeInput}
              className="full"
              label="Mô tả"
            />
          </div>
          <div>
            <FieldSearch
              type="text"
              placeholder="Filter Publish Year..."
              name="publish_year"
              onChange={handleChangeInput}
              className="full"
              label="Năm xuất bản"
            />
          </div>
          <div>
            <FieldSearch
              className="full"
              label="Năm xuất bản"
              isHideIcon
            >
              <SelectApp
                options={categories ? categories?.map(c => {
                  return {
                    label: c.name,
                    value: c.id.toString()
                  }
                }) : []}
                onValueChange={onChangeCategory}
              />
            </FieldSearch>
          </div>
        </div>

        <div className="ml-auto w-fit mt-7 flex gap-2">
          <div>
            <Button className="bg-sky-700 hover:bg-sky-600" onClick={handleExport}><ArrowBigDownDash size={18} /> Xuất dữ liệu</Button>
          </div>
          <div>
            <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddBook}><BookPlus size={18} /> Add</Button>
          </div>
          <DropdownHeaderTable table={tableData.table} />
        </div>
      </div>
      {isLoading ? <Loading /> : <Table tableData={tableData} />}
    </div>
  )
});

export default BookTable;
