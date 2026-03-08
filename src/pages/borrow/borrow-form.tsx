
import { FieldSearch } from "@/components/field-search"
import { Popup } from "@/components/popup"
import SearchSelect from "@/components/search-select"
import { SelectOption } from "@/components/select-app"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDebounce } from "@/hooks/useDebounce"
import { useFetch } from "@/hooks/useFetch"
import { Book } from "@/models/book.model"
import { Reader } from "@/models/reader.model"
import _ from "lodash"
import { ChangeEvent, useState } from "react"

interface IBorrowPopupProps {
    open: boolean
    onClose: () => void
}

export function BorrowPopup({ open, onClose }: IBorrowPopupProps) {
    const [search, setSearch] = useState<{ readerKey: string, bookKey: string }>({ bookKey: "", readerKey: "" });
    const readerDebounce = useDebounce(search.readerKey);
    const bookDebounce = useDebounce(search.bookKey);
    const [books, setBooks] = useState<Book[]>([]);
    const [reader, setReader] = useState<Reader | null>(null);
    const [showReaderSelect, setShowReaderSelect] = useState(false);
    const [showBookSelect, setShowBookSelect] = useState(false);

    const { data: readers, isLoading: readerLoading } = useFetch<Reader[], SelectOption[]>({
        url: `readers/keyword?keyword=${readerDebounce}`,
        key: ["readers-keyword", readerDebounce],
        options: {
            select: (readers) => readers.map(r => ({
                label: r.full_name + " - " + r.phone,
                value: r.id.toString(),
                otherValue: r
            }))
        }
    });
    const { data: booksOptional, isLoading: bookLoading } = useFetch<Book[], SelectOption[]>({
        url: `books/keyword?keyword=${bookDebounce}`,
        key: ["books-keyword", bookDebounce],
        options: {
            select: (books) => books.map(b => ({
                label: b.title,
                value: b.id.toString(),
                otherValue: b
            }))
        }
    });
    console.log("🚀 ~ BorrowPopup ~ data:", readers)

    const handleConfirm = () => {

    }

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;

        setSearch({
            ...search,
            [name]: value
        });

        if (name === "readerKey") {
            setShowReaderSelect(true);
        }

        if (name === "bookKey") {
            setShowBookSelect(true);
        }
    }

    const onSelectReader = (opt: SelectOption) => {
        console.log("🚀 ~ onSelectReader ~ opt: SelectOption:", opt)
        setReader(opt.otherValue);
        setShowReaderSelect(false);
    }

    const onSelectBook = (opt: SelectOption) => {
        console.log("🚀 ~ onSelectReader ~ opt: SelectOption:", opt)
        const checkExist = _.includes(books, opt?.otherValue);

        if (!checkExist) {
            setBooks([...books, opt?.otherValue])
        }

        setShowBookSelect(false);
        setSearch({
            ...search,
            bookKey: ""
        })
    }

    return (
        <Popup onConfirm={handleConfirm} variant="2xl" type="information" open={open} onClose={onClose} title="Thông tin sách">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <FieldSearch
                        label="Tên độc giả"
                        placeholder="Nhập tên độc giả..."
                        onChange={handleChangeInput}
                        name="readerKey"
                        value={_.defaultTo(reader?.full_name + " - " + reader?.phone, "")}
                    />
                    {
                        showReaderSelect && <SearchSelect loading={readerLoading} options={readers} onSelect={onSelectReader} />
                    }
                </div>
                <div>
                    <FieldSearch
                        label="Hạn trả"
                        placeholder="Nhập tên độc giả..."
                        onChange={handleChangeInput}
                        name="dueDate"
                        type="date"
                    />
                </div>
                <div>
                    <FieldSearch
                        label="Tên sách"
                        placeholder="Nhập tên tên sách..."
                        onChange={handleChangeInput}
                        name="bookKey"
                    />
                    {
                        showBookSelect && <SearchSelect loading={readerLoading} options={booksOptional} onSelect={onSelectBook} />
                    }
                </div>
            </div>
            <div className="mt-3">
                <div>Reader List</div>
                <Card className="w-[350px] w-full mt-2">
                    <CardContent>
                        <ScrollArea className="h-[300px]">
                            <div className="space-y-2">
                                {books.map((book, index) => (
                                    <div
                                        key={`list-${book.id}-${index}`}
                                        className="rounded-md border p-3 text-sm hover:bg-muted cursor-pointer"
                                    >
                                        <div>{book.title}</div>
                                        <Button variant="destructive" size="sm">
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </Popup>
    )
}