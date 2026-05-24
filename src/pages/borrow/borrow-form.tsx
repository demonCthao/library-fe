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
import { User } from "@/models/user.model"
import { useNotificationStore } from "@/store/notification.store"
import _ from "lodash"
import {
    ChangeEvent,
    useCallback,
    useRef,
    useState
} from "react"
import { useTranslation } from "react-i18next"

interface IBorrowPopupProps {
    open: boolean
    onClose: (value?: boolean) => void
}

interface BorrowBookItem {
    book: Book
    qty: number
}

export function BorrowForm({
    open,
    onClose
}: IBorrowPopupProps) {

    const notification = useNotificationStore()
    const { t } = useTranslation()

    const [search, setSearch] = useState({
        readerKey: "",
        bookKey: "",
        dueDate: ""
    })

    const readerDebounce = useDebounce(search.readerKey)
    const bookDebounce = useDebounce(search.bookKey)

    const [books, setBooks] = useState<BorrowBookItem[]>([])
    const [reader, setReader] = useState<User | null>(null)

    const [showReaderSelect, setShowReaderSelect] = useState(false)
    const [showBookSelect, setShowBookSelect] = useState(false)

    const readerRef = useRef<HTMLDivElement>(null)
    const bookRef = useRef<HTMLDivElement>(null)

    // =========================
    // FETCH USERS
    // =========================

    const {
        data: users,
        isLoading: readerLoading
    } = useFetch<User[], SelectOption[]>({
        url: `users/keyword?keyword=${readerDebounce}`,
        key: ["users-keyword", readerDebounce],
        options: {
            select: (users) =>
                users.map(r => ({
                    label: `${r.full_name} - ${r.phone}`,
                    value: r.id.toString(),
                    otherValue: r
                }))
        }
    })

    // =========================
    // FETCH BOOKS
    // =========================

    const {
        data: booksOptional,
        isLoading: bookLoading
    } = useFetch<Book[], SelectOption[]>({
        url: `books/keyword?keyword=${bookDebounce}`,
        key: ["books-keyword", bookDebounce],
        options: {
            select: (books) =>
                books.map(b => ({
                    label: b.title,
                    value: b.id.toString(),
                    otherValue: b
                }))
        }
    })

    // =========================
    // CREATE BORROW
    // =========================

    const { mutate } = useMutationRequest({
        key: ["create-borrow"],
        url: "borrow-record",
        method: "post",
        options: {
            onSuccess: () => {
                notification.updateState({
                    message: t("updateSuccess"),
                    type: "success",
                    open: true
                })

                onClose(true)
            },

            onError: () => {
                notification.updateState({
                    message: t("updateFail"),
                    type: "error",
                    open: true
                })
            }
        }
    })

    // =========================
    // CONFIRM
    // =========================

    const handleConfirm = () => {

        if (_.isEmpty(search.dueDate)) {
            notification.updateState({
                open: true,
                message: "Hạn trả không được để trống",
                type: "warning"
            })

            return
        }

        if (_.isEmpty(books)) {
            notification.updateState({
                open: true,
                message: "Sách không được để trống",
                type: "warning"
            })

            return
        }

        if (_.isNull(reader)) {
            notification.updateState({
                open: true,
                message: "Người đọc không được để trống",
                type: "warning"
            })

            return
        }

        mutate({
            due_date: search.dueDate,
            reader_id: reader.id,

            books: books.map(item => ({
                book_id: item.book.id,
                qty: item.qty
            }))
        })
    }

    // =========================
    // INPUT CHANGE
    // =========================

    const handleChangeInput = (
        e: ChangeEvent<HTMLInputElement>
    ) => {

        const name = e.target.name
        const value = e.target.value

        setSearch(prev => ({
            ...prev,
            [name]: value
        }))

        if (name === "readerKey") {
            setShowReaderSelect(true)
        }

        if (name === "bookKey") {
            setShowBookSelect(true)
        }
    }

    // =========================
    // SELECT READER
    // =========================

    const onSelectReader = (opt: SelectOption) => {
        setReader(opt.otherValue)
        setShowReaderSelect(false)
    }

    // =========================
    // SELECT BOOK
    // =========================

    const onSelectBook = (opt: SelectOption) => {

        const selectedBook = opt.otherValue as Book

        if (selectedBook.stock_quantity === 0) {
            notification.updateState({
                open: true,
                message: "Số lượng sách này không đủ",
                type: "warning"
            })

            return
        }

        const exist = books.find(
            item => item.book.id === selectedBook.id
        )

        if (!exist) {
            setBooks(prev => [
                ...prev,
                {
                    book: selectedBook,
                    qty: 1
                }
            ])
        }

        setShowBookSelect(false)

        setSearch(prev => ({
            ...prev,
            bookKey: ""
        }))
    }

    // =========================
    // CHANGE QTY
    // =========================

    const handleQtyChange = (
        bookId: number,
        type: "increase" | "decrease",
        value?: number
    ) => {

        setBooks(prev =>
            prev.map(item => {

                if (item.book.id !== bookId) {
                    return item
                }

                const max = item.book.available_quantity || 1

                let qty = item.qty

                if (type === "increase") {
                    qty += 1
                }

                if (type === "decrease") {
                    qty -= 1
                }

                if (value !== undefined) {
                    qty = value
                }

                qty = Math.max(1, qty)
                qty = Math.min(max, qty)

                return {
                    ...item,
                    qty
                }
            })
        )
    }

    // =========================
    // REMOVE BOOK
    // =========================

    const handleRemoveBook = useCallback((bookId: number) => {

        setBooks(prev =>
            prev.filter(item => item.book.id !== bookId)
        )

    }, [])

    // =========================
    // CLEAR READER
    // =========================

    const handleClearReader = () => {

        setReader(null)

        setSearch(prev => ({
            ...prev,
            readerKey: ""
        }))
    }

    // =========================
    // CLICK OUTSIDE
    // =========================

    useClickOutside(readerRef, () => {
        setShowReaderSelect(false)
    })

    useClickOutside(bookRef, () => {
        setShowBookSelect(false)
    })

    // =========================
    // RENDER
    // =========================

    return (
        <Popup
            onConfirm={handleConfirm}
            variant="lg"
            type="confirm"
            open={open}
            onClose={onClose}
            title="Phiếu mượn"
        >

            <div className="grid grid-cols-2 gap-2">

                {/* Reader */}

                <div>

                    <div className="relative">

                        <FieldSearch
                            label="Tên độc giả"
                            onChange={handleChangeInput}
                            name="readerKey"
                            value={
                                reader
                                    ? `${reader.full_name} - ${reader.phone}`
                                    : search.readerKey
                            }
                        />

                        {
                            reader && (
                                <Button
                                    type="button"
                                    onClick={handleClearReader}
                                    className="absolute bg-white right-1 top-1 text-gray-400 hover:bg-white h-7 w-6"
                                >
                                    ✕
                                </Button>
                            )
                        }

                    </div>

                    {
                        showReaderSelect && (
                            <div ref={readerRef}>
                                <SearchSelect
                                    loading={readerLoading}
                                    options={users}
                                    onSelect={onSelectReader}
                                />
                            </div>
                        )
                    }

                </div>

                {/* Due Date */}

                <div>
                    <FieldSearch
                        label="Hạn trả"
                        onChange={handleChangeInput}
                        name="dueDate"
                        type="date"
                        isHideIcon
                    />
                </div>

                {/* Address */}

                <div>
                    <FieldSearch
                        label="Địa chỉ"
                        name="address"
                        type="text"
                        disabled
                        isHideIcon
                        value={reader?.address}
                    />
                </div>

                {/* Book */}

                <div>

                    <FieldSearch
                        label="Tên sách"
                        onChange={handleChangeInput}
                        name="bookKey"
                        value={search.bookKey}
                    />

                    {
                        showBookSelect && (
                            <div ref={bookRef}>
                                <SearchSelect
                                    loading={bookLoading}
                                    options={booksOptional}
                                    onSelect={onSelectBook}
                                />
                            </div>
                        )
                    }

                </div>

            </div>

            {/* LIST BOOK */}

            <div className="mt-3">

                <div>Danh sách</div>

                <Card className="w-full mt-2 py-3">

                    <CardContent className="px-3">

                        <ScrollArea className="h-[300px]">

                            <div className="space-y-2">

                                {
                                    books.map((item, index) => {

                                        const book = item.book

                                        return (

                                            <div
                                                key={`list-${book.id}-${index}`}
                                                className="rounded-md border p-3 text-sm flex items-center justify-between gap-3"
                                            >

                                                {/* IMAGE */}

                                                {
                                                    book?.avatar_path ? (
                                                        <LazyImage
                                                            className="w-10 h-12"
                                                            src={`http://127.0.0.1:3000${book.avatar_path}`}
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-12 bg-gray-200 flex items-center justify-center text-sm">
                                                            {book?.title?.charAt(0)}
                                                        </div>
                                                    )
                                                }

                                                {/* INFO */}

                                                <div className="flex-1">

                                                    <div>
                                                        {book.title}
                                                    </div>

                                                    <div className="text-gray-500 text-xs">
                                                        {book.description}
                                                    </div>

                                                </div>

                                                {/* STOCK */}

                                                <div className="text-xs">
                                                    <div>
                                                        NXB: {book.publish_year}
                                                    </div>

                                                    <div>
                                                        Tồn: {book.available_quantity}
                                                    </div>
                                                </div>

                                                {/* QTY */}

                                                <div className="flex items-center gap-2">

                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleQtyChange(
                                                                book.id,
                                                                "decrease"
                                                            )
                                                        }
                                                    >
                                                        -
                                                    </Button>

                                                    <input
                                                        type="number"
                                                        min={1}
                                                        max={book.stock_quantity}
                                                        value={item.qty}
                                                        onChange={(e) =>
                                                            handleQtyChange(
                                                                book.id,
                                                                "increase",
                                                                Number(e.target.value)
                                                            )
                                                        }
                                                        className="w-16 border rounded text-center h-8"
                                                    />

                                                    <Button
                                                        type="button"
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleQtyChange(
                                                                book.id,
                                                                "increase"
                                                            )
                                                        }
                                                    >
                                                        +
                                                    </Button>

                                                </div>

                                                {/* REMOVE */}

                                                <Button
                                                    onClick={() =>
                                                        handleRemoveBook(book.id)
                                                    }
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    Remove
                                                </Button>

                                            </div>
                                        )
                                    })
                                }

                            </div>

                        </ScrollArea>

                    </CardContent>

                </Card>

            </div>

        </Popup>
    )
}