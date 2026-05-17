import ConfirmDialog from '@/components/confirm-dialog';
import { useMutationRequest } from '@/hooks/useMutation';
import { TypeActionTable } from '@/hooks/useTable';
import { Author } from '@/models/author.model';
import { useNotificationStore } from '@/store/notification.store';
import { BaseTableRef } from '@/types/base-ref.type';
import _ from 'lodash';
import { useCallback, useRef, useState } from 'react';
import { AuthorForm } from './author-form';
import AuthorTable from './author-table';
import { useTranslation } from 'react-i18next';

export default function AuthorPage() {
    const notification = useNotificationStore();
    const { t } = useTranslation();
    const [action, setAction] = useState<TypeActionTable | null>(null);
    const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
    const tableRef = useRef<BaseTableRef>(null);

    const isFormOpen =
        action === TypeActionTable.add ||
        action === TypeActionTable.edit;
    const isDeleteOpen = action === TypeActionTable.delete;


    const handleChooseAuthor = useCallback(
        (type: TypeActionTable, author?: Author) => {
            setSelectedAuthor(author ?? null);
            setAction(type);
        },
        []
    );

    const resetState = () => {
        setAction(null);
        setSelectedAuthor(null);
    };

    const handleCloseForm = (isSuccess?: boolean) => {
        if (isSuccess) {
            tableRef.current?.refresh();
        }
        resetState();
    };

    const handleConfirmDelete = () => {
        if (selectedAuthor) {
            mutate({});
        }
    }

    const { mutate } = useMutationRequest({
        key: ["delete-author"],
        url: `authors/${selectedAuthor?.id}`, method: "delete", options: {
            onSuccess: () => {
                notification.updateState({ message: t("updateSuccess"), type: "success", open: true });
                resetState();
                tableRef.current?.refresh();
            },
            onError: () => {
                notification.updateState({ message: t("updateFail"), type: "error", open: true });
            }
        }
    });

    return (
        <div className="h-full flex flex-col">
            <div className="flex-1">
                <AuthorTable
                    ref={tableRef}
                    onChooseAuthor={handleChooseAuthor}
                />
            </div>

            <AuthorForm
                key={`${action}-${selectedAuthor?.id ?? "new"}`}
                author={selectedAuthor}
                onClose={handleCloseForm}
                open={isFormOpen}
            />

            <ConfirmDialog
                label={_.defaultTo(selectedAuthor?.name, "")}
                onClose={handleCloseForm}
                onConfirm={handleConfirmDelete}
                open={isDeleteOpen}
            />
        </div>
    )
}
