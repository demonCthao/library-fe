import { DropdownHeaderTable } from "@/components/dropdown-header-table";
import { FieldSearch } from "@/components/field-search";
import Loading from "@/components/loading";
import { SelectApp } from "@/components/select-app";
import { DynamicTable as Table } from "@/components/table-dynamic";
import { Button } from "@/components/ui/button";
import { PAGE_SIZE_10 } from "@/enum/search.enum";
import { useDebounce } from "@/hooks/useDebounce";
import { useFetch } from "@/hooks/useFetch";
import { useMutationRequest } from "@/hooks/useMutation";
import { TypeActionTable, useTable } from "@/hooks/useTable";
import { convertObjectToParam } from "@/lib/utils";
import { Book } from "@/models/book.model";
import { Category } from "@/models/category.model";
import { DataList } from "@/models/response.model";
import { BaseTableRef } from "@/types/base-ref.type";
import { PaginationState } from "@tanstack/react-table";
import { ArrowBigDownDash, BookPlus } from "lucide-react";
import { ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";
import { bookColumns } from "./book-column";
import { useTranslation } from "react-i18next";
import { useCan } from "@/hooks/use-can";
import { DELETE, EXPORT, MUTATION, PERMISSIONS } from "@/types/permission.type";

interface IBookTableProps {
  onChooseBook: (type: TypeActionTable, book?: Book) => void;
}

const BookTable = forwardRef<BaseTableRef, IBookTableProps>(({ onChooseBook }, ref) => {
  const { t } = useTranslation();
  const canMutationBook = useCan([MUTATION.books, DELETE.books]);
  const canExportPBook = useCan([EXPORT.books]);
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
    key: ["books", search.category_id, titleDebounce, publishYearDebounce, descriptionDebounce, search.pageIndex.toString(),
      search.pageSize.toString()],
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
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-3 w-full mb-5 items-center">
        <div className="col-span-2 grid grid-cols-4 gap-3">
          <div>
            <FieldSearch
              type="text"
              name="title"
              onChange={handleChangeInput}
              className="w-full"
              label={t("bookName")}
            />
          </div>
          <div>
            <FieldSearch
              type="text"
              name="description"
              onChange={handleChangeInput}
              className="full"
              label={t("description")}
            />
          </div>
          <div>
            <FieldSearch
              type="text"
              name="publish_year"
              onChange={handleChangeInput}
              className="full"
              label={t("publishYear")}
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

        <div className="ml-auto w-fit flex gap-2">
          {
            canExportPBook && <div>
              <Button className="bg-sky-700 hover:bg-sky-600" onClick={handleExport}><ArrowBigDownDash size={18} /> {t("exportData")}</Button>
            </div>
          }
          {
            canMutationBook && <div>
              <Button className="bg-green-500 hover:bg-green-600" onClick={handleAddBook}><BookPlus size={18} /> {t("add")}</Button>
            </div>
          }
          <DropdownHeaderTable table={tableData.table} />
        </div>
      </div>
      {isLoading ? <Loading /> : <Table useCanMutaion={canMutationBook} title={t("bookList")} tableData={tableData} />}
    </div>
  )
});

export default BookTable;
