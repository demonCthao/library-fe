
import { FieldSearch } from "@/components/field-search"
import { Popup } from "@/components/popup"
import SearchSelect from "@/components/search-select"
import { SelectOption } from "@/components/select-app"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LazyImage } from "@/components/ui/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useClickOutside } from "@/hooks/useClickOutside"
import { useDebounce } from "@/hooks/useDebounce"
import { useFetch } from "@/hooks/useFetch"
import { useMutationRequest } from "@/hooks/useMutation"
import { Book } from "@/models/book.model"
import { Reader } from "@/models/reader.model"
import { useNotificationStore } from "@/store/notification.store"
import _ from "lodash"
import { ChangeEvent, useCallback, useRef, useState } from "react"

interface IBorrowPopupProps {
    open: boolean
    onClose: (value?: boolean) => void
}

export function BorrowForm({ open, onClose }: IBorrowPopupProps) {
    const notification = useNotificationStore();
    const [search, setSearch] = useState<{ readerKey: string, bookKey: string, dueDate: string }>({ bookKey: "", readerKey: "", dueDate: "" });
    const readerDebounce = useDebounce(search.readerKey);
    const bookDebounce = useDebounce(search.bookKey);
    const [books, setBooks] = useState<Book[]>([]);
    const [reader, setReader] = useState<Reader | null>(null);
    const [showReaderSelect, setShowReaderSelect] = useState(false);
    const [showBookSelect, setShowBookSelect] = useState(false);
    const readerRef = useRef<HTMLDivElement>(null);
    const bookRef = useRef<HTMLDivElement>(null);

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

    const { mutate } = useMutationRequest({
        key: ["create-borrow"],
        url: "borrow-record", method: "post", options: {
            onSuccess: () => {
                notification.updateState({ message: "Cập nhật dữ liệu thành công", type: "success", open: true });
                onClose(true);
            },
            onError: (error) => {
                notification.updateState({ message: error.message, type: "error", open: true });
            }
        }
    });

    const handleConfirm = () => {
        if (_.isEmpty(search.dueDate)) {
            notification.updateState({ open: true, message: "Hạn trả được để trống", type: "warning" });
            return;
        }

        if (_.isEmpty(books)) {
            notification.updateState({ open: true, message: "Sách không được để trống", type: "warning" });
            return;
        }

        if (_.isNull(reader)) {
            notification.updateState({ open: true, message: "Người đọc không được để trống", type: "warning" });
            return;
        }

        mutate({
            due_date: search.dueDate,
            reader_id: reader.id,
            books: books.map(b => b.id)
        })
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

    const handleRemoveBook = useCallback((bookId: number) => {
        setBooks(prev => prev.filter(book => book.id !== bookId));
    }, []);

    const handleClearReader = () => {
        setReader(null);
        setSearch({
            ...search,
            readerKey: ""
        })
    }

    useClickOutside(readerRef, () => {
        setShowReaderSelect(false);
    });

    useClickOutside(bookRef, () => {
        setShowBookSelect(false);
    });

    return (
        <Popup onConfirm={handleConfirm} variant="lg" type="confirm" open={open} onClose={onClose} title="Thông tin sách">
            <div className="grid grid-cols-2 gap-2">
                <div>
                    <div className="relative">
                        <FieldSearch
                            label="Tên độc giả"
                            placeholder="Nhập tên độc giả..."
                            onChange={handleChangeInput}
                            name="readerKey"
                            value={reader ? `${reader.full_name} - ${reader.phone}` : search.readerKey}
                        />
                        {reader && (
                            <Button
                                type="button"
                                onClick={handleClearReader}
                                className="absolute bg-white right-1 top-8 text-gray-400 hover:bg-white h-7 w-6"
                            >
                                ✕
                            </Button>
                        )}
                    </div>

                    {
                        showReaderSelect &&
                        <div ref={readerRef}>
                            <SearchSelect
                                loading={readerLoading}
                                options={readers}
                                onSelect={onSelectReader}
                            />
                        </div>
                    }
                </div>
                <div>
                    <FieldSearch
                        label="Hạn trả"
                        placeholder="Nhập tên độc giả..."
                        onChange={handleChangeInput}
                        name="dueDate"
                        type="date"
                        isHideIcon
                    />
                </div>
                <div>
                    <FieldSearch
                        label="Địa chỉ"
                        name="dueDate"
                        type="text"
                        disabled
                        isHideIcon
                        value={reader?.address}
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
                        showBookSelect &&
                        <div ref={bookRef}>
                            <SearchSelect
                                loading={bookLoading}
                                options={booksOptional}
                                onSelect={onSelectBook}
                            />
                        </div>

                    }
                </div>
            </div>
            <div className="mt-3">
                <div>Danh sách</div>
                <Card className="w-[350px] w-full mt-2 py-3">
                    <CardContent className="px-3">
                        <ScrollArea className="h-[300px]">
                            <div className="space-y-1">
                                {books.map((book, index) => (
                                    <div
                                        key={`list-${book.id}-${index}`}
                                        className="rounded-md border p-3 text-sm hover:bg-muted cursor-pointer flex items-center justify-between"
                                    >
                                        {
                                            book?.avatar_path ? <LazyImage className="w-10 h-12" src={`http://127.0.0.1:3000${book?.avatar_path}`} /> :
                                                <div className="w-10 h-10 bg-gray-200 flex items-center justify-center text-sm">
                                                    {book?.title?.charAt(0)}
                                                </div>

                                        }
                                        <div>
                                            <div>{book.title}</div>
                                            <div className="text-gray-500">{book.description}</div>
                                        </div>
                                        <div><div>NXB: {book.publish_year}</div><div>Số Lượng: {book.borrowed_quantity}</div></div>
                                        <Button onClick={() => handleRemoveBook(book.id)} variant="destructive" size="sm">
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