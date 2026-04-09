import { TypeActionTable } from '@/hooks/useTable';
import { Book } from '@/models/book.model';
import { useNotificationStore } from '@/store/notification.store';
import { BaseTableRef } from '@/types/base-ref.type';
import { useCallback, useRef, useState } from 'react';
import { BookForm } from './book-form';
import BookTable from './book-table';

export default function BookPage() {
    const notification = useNotificationStore();
    const [action, setAction] = useState<TypeActionTable | null>(null);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const tableRef = useRef<BaseTableRef>(null);

    const isFormOpen =
        action === TypeActionTable.add ||
        action === TypeActionTable.edit;

    const handleChooseBook = useCallback(
        (type: TypeActionTable, book?: Book) => {
            setSelectedBook(book ?? null);
            setAction(type);
        },
        []
    );

    const resetState = () => {
        setAction(null);
        setSelectedBook(null);
    };

    const handleCloseForm = (isSuccess?: boolean) => {
        if (isSuccess) {
            tableRef.current?.refresh();
        }
        resetState();
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1">
                <BookTable
                    ref={tableRef}
                    onChooseBook={handleChooseBook}
                />
            </div>
            <BookForm key={`book-${action}-${selectedBook?.id ?? "new"}`} book={selectedBook} onClose={handleCloseForm} open={isFormOpen} />
        </div>
    )
}
