import ConfirmDialog from '@/components/confirm-dialog';
import { useMutationRequest } from '@/hooks/useMutation';
import { TypeActionTable } from '@/hooks/useTable';
import { Category } from '@/models/category.model';
import { useNotificationStore } from '@/store/notification.store';
import { BaseTableRef } from '@/types/base-ref.type';
import _ from 'lodash';
import { useCallback, useRef, useState } from 'react';
import { CategoryForm } from './category-form';
import CategoryTable from './category-table';

export default function CategoryPage() {
  const notification = useNotificationStore();
  const [action, setAction] = useState<TypeActionTable | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const tableRef = useRef<BaseTableRef>(null);

  const isFormOpen =
    action === TypeActionTable.add ||
    action === TypeActionTable.edit;
  const isDeleteOpen = action === TypeActionTable.delete;

  const onChooseCategory = useCallback(
    (type: TypeActionTable, category?: Category) => {
      setSelectedCategory(category ?? null);
      setAction(type);
    },
    []
  );

  const resetState = () => {
    setAction(null);
    setSelectedCategory(null);
  };

  const handleCloseForm = (isSuccess?: boolean) => {
    if (isSuccess) {
      tableRef.current?.refresh();
    }
    resetState();
  };

  const handleConfirmDelete = () => {
    if (selectedCategory) {
      mutate({});
    }
  };

  const { mutate } = useMutationRequest({
    key: ["delete-category"],
    url: `categories/${selectedCategory?.id}`, method: "delete", options: {
      onSuccess: () => {
        notification.updateState({ message: "Cập nhật dữ liệu thành công", type: "success", open: true });
        resetState();
        tableRef.current?.refresh();
      },
      onError: (error) => {
        notification.updateState({ message: error.message, type: "error", open: true });
      }
    }
  });

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <CategoryTable
          ref={tableRef}
          onChooseCategory={onChooseCategory}
        />
      </div>

      <CategoryForm key={`${action}-${selectedCategory?.id ?? "new"}`} category={selectedCategory} onClose={handleCloseForm} open={isFormOpen} />
      <ConfirmDialog label={_.defaultTo(selectedCategory?.name, "")} onClose={handleCloseForm} onConfirm={handleConfirmDelete} open={isDeleteOpen} />
    </div>
  )
}
