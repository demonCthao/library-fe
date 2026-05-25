import { FormFieldInput } from '@/components/form-field-input';
import SearchSelect from '@/components/search-select';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce'; // Hoặc hook debounce có sẵn của bạn
import { useFetch } from '@/hooks/useFetch';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

export interface IGoodsReceiptDetail {
  book_id: number | string;
  quantity: number;
  import_price: number;
}

interface GoodsReceiptItemProps {
    form: any;
    index: number;
    isEdit: boolean;
    canDelete: boolean;
    onDelete: () => void;
}

export default function GoodsReceiptItem({ form, index, isEdit, canDelete, onDelete }: GoodsReceiptItemProps) {
    const [keyword, setKeyword] = useState('');
    const [openSearch, setOpenSearch] = useState(false);
    const bookDebounce = useDebounce(keyword, 300);

    const { data: bookData, isLoading } = useFetch({
        key: [`search-books-${index}`, bookDebounce],
        url: `books/keyword?keyword=${bookDebounce}`,
        options: {
            enabled: openSearch && bookDebounce.trim().length > 0,
        },
    });

    const bookOptions = (bookData as any[])?.map((book) => ({
        value: book.id,
        label: book.title,
        image: book.image_url,
        publishYear: book.publish_year,
        price: book.price ?? 0,
    })) || [];

    return (
        <div className="flex gap-4 items-end bg-[#18181c] p-4 rounded-xl border border-gray-800 transition-all duration-200 hover:border-gray-700 relative group">
            <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="relative">
                    <label className="text-xs font-medium text-gray-400 mb-1.5 block">
                        Chọn sách ({index + 1})
                    </label>

                    <input
                        type="text"
                        className="w-full h-10 px-3 bg-[#111115] border border-gray-800 rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#00b46f] disabled:opacity-50"
                        placeholder="Gõ tên sách để tìm..."
                        disabled={isEdit}
                        value={keyword}
                        onChange={(e) => {
                            setKeyword(e.target.value);
                            setOpenSearch(true);
                        }}
                        onFocus={() => setOpenSearch(true)}
                        onBlur={() => setTimeout(() => setOpenSearch(false), 200)} // Delay để kịp ăn sự kiện click option
                    />

                    {/* Hiển thị danh sách kết quả Dark Mode khi đang tìm kiếm */}
                    {openSearch && keyword.trim().length > 0 && (
                        <div className="absolute left-0 w-full mt-1 z-50">
                            <SearchSelect
                                loading={isLoading}
                                options={bookOptions}
                                onSelect={(option) => {
                                    form.setFieldValue(`details[${index}].book_id`, option.value);
                                    setKeyword(option.label);
                                    setOpenSearch(false);
                                }}
                            />
                        </div>
                    )}
                </div>
                <FormFieldInput
                    form={form}
                    label="Số lượng nhập"
                    name={`details[${index}].quantity` as any}
                    type="number"
                    placeholder="Nhập số lượng..."
                />
                <FormFieldInput
                    form={form}
                    label="Giá nhập (VND)"
                    name={`details[${index}].import_price` as any}
                    type="number"
                    placeholder="Nhập giá nhập kho..."
                />
            </div>
            {!isEdit && canDelete && (
                <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10 shrink-0 rounded-lg bg-red-950/40 text-red-400 border border-red-900/50 hover:bg-red-600 hover:text-white transition-all duration-150 mb-[2px]"
                    onClick={onDelete}
                >
                    <Trash2 size={16} />
                </Button>
            )}
        </div>
    );
}