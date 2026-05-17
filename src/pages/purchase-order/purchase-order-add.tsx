import { FieldSearch } from "@/components/field-search"
import { Popup } from "@/components/popup"
import SearchSelect from "@/components/search-select"
import { SelectOption } from "@/components/select-app"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { LazyImage } from "@/components/ui/image"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDebounce } from "@/hooks/useDebounce"
import { useFetch } from "@/hooks/useFetch"
import { Book } from "@/models/book.model"
import { useNotificationStore } from "@/store/notification.store"
import _ from "lodash"
import { ChangeEvent, useCallback, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

interface IPurchaseOrderAddProps {
    onClose: () => void
    onConfirm: (books: Book[]) => void
    booksDefault: Book[]
}

export default function PurchaseOrderAdd({ onClose, onConfirm, booksDefault }: IPurchaseOrderAddProps) {
    const { t } = useTranslation();
    const notification = useNotificationStore();
    const bookRef = useRef<HTMLDivElement>(null);
    const [books, setBooks] = useState<Book[]>(booksDefault);
    const [search, setSearch] = useState<{ bookKey: string }>({ bookKey: "" });
    const bookDebounce = useDebounce(search.bookKey);
    const [showBookSelect, setShowBookSelect] = useState(false);

    const onConfirmAdd = () => {
        if (_.isEmpty(books)) {
            notification.updateState({ open: true, message: t("requireBook"), type: "warning" });
            return;
        }

        onConfirm(books)
    }

    const handleRemoveBook = useCallback((bookId: number) => {
        setBooks(prev => prev.filter(book => book.id !== bookId));
    }, []);

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        const name = e.target.name;
        const value = e.target.value;

        setSearch({
            ...search,
            [name]: value
        });

        if (name === "bookKey") {
            setShowBookSelect(true);
        }
    }

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

    const onSelectBook = (opt: SelectOption) => {
        if (opt.otherValue?.stock_quantity === 0) {
            notification.updateState({ open: true, message: t("bookEnough"), type: "warning" });
            return
        }

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
        <Popup onConfirm={onConfirmAdd} variant="lg" type="confirm" open onClose={onClose} title={t("orderInformation")}>
            <div>
                <div>
                    <FieldSearch
                        label="Tên sách"
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
                <div>{t("listBook")}</div>
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
