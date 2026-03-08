import { Popup } from '@/components/popup'
import { SelectApp } from '@/components/select-app'
import { FieldLabel } from '@/components/ui/field'
import { LazyImage } from '@/components/ui/image'
import { formatDate } from '@/lib/utils'
import { BorrowDetail } from '@/models/borrow-detail.model'

interface IFineReceiptPopupProps {
    open: boolean
    onClose: () => void
    borrow: BorrowDetail | undefined
    handleConfirm: () => void
}

export default function FineReceiptPopup({ open, onClose, borrow, handleConfirm }: IFineReceiptPopupProps) {
    const today = new Date();
    const dueDate = new Date(borrow?.due_date ?? "");
    const diffDays = Math.max(
        0,
        Math.floor(
            (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
        )
    );
    const finePerDay = 5000;
    const totalFine = diffDays * finePerDay;

    return (
        <Popup
            onConfirm={handleConfirm}
            variant="2xl"
            type="confirm"
            open={open}
            onClose={onClose}
            title="Phiếu phạt"
        >
            <div className="space-y-2">
                <h2 className="text-lg font-semibold">Trả sách</h2>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500">Borrow Code</p>
                        <p>{borrow?.borrow_code}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Khách hàng</p>
                        <p>{borrow?.reader?.full_name}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Ngày đăng ký</p>
                        <p>{formatDate(borrow?.borrow_date)}</p>
                    </div>

                    <div>
                        <p className="text-gray-500">Hạn trả hàng</p>
                        <p>{formatDate(borrow?.due_date)}</p>
                    </div>
                </div>
                {diffDays > 0 && (
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 mb-3">
                        <p className="text-sm text-red-700">
                            Thời gian quá hạn {diffDays} ngày
                        </p>

                        <p className="text-sm">
                            Phí mỗi ngày: <b>5,000₫</b>
                        </p>

                        <p className="text-lg font-semibold text-red-600">
                            Tổng: {totalFine.toLocaleString()}₫
                        </p>
                    </div>
                )}
            </div>
            <div>
                <FieldLabel>Chọn phương thức thanh toán</FieldLabel>
            </div>
            <div className="mt-1">
                <SelectApp placeholder="Chọn phương thức thanh toán"
                    options={
                        [{ label: "Thanh toán Zalo pay", value: "zalopay", icon: <LazyImage className="w-10 h-6" src="../../../src/assets/images/zalo.png" /> }]
                    }
                />
            </div>
        </Popup>
    )
}
