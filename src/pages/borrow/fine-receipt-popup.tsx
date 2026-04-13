import { Popup } from "@/components/popup"
import { SelectApp, SelectOption } from "@/components/select-app"
import { FieldLabel } from "@/components/ui/field"
import { LazyImage } from "@/components/ui/image"
import { useFetch } from "@/hooks/useFetch"
import { formatDate } from "@/lib/utils"
import { BankAccount } from "@/models/bank.model"
import { BorrowDetail } from "@/models/borrow-detail.model"
import { useState } from "react"

interface IFineReceiptPopupProps {
    open: boolean
    onClose: () => void
    borrow: BorrowDetail | undefined
    handleConfirm: (value: string | null) => void
}

export default function FineReceiptPopup({
    open,
    onClose,
    borrow,
    handleConfirm,
}: IFineReceiptPopupProps) {
    const today = new Date();
    const dueDate = new Date(borrow?.due_date ?? "");
    const diffDays = Math.max(
        0,
        Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))
    );
    const finePerDay = 5000;
    const totalFine = diffDays * finePerDay;
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    const [bank, setBank] = useState<BankAccount | null>(null)

    const onChangePaymentMethod = (value: string) => {
        setPaymentMethod(value)
    }

    const onChangeBank = (value: string) => {
        const bankOption = bankOptions?.find(b => b.value === value)

        if (bankOption) {
            setBank(bankOption.otherValue)
        }
    }

    const onConfirm = () => {
        handleConfirm(paymentMethod)

        // if (paymentMethod === "money") {

        // }
    }

    const { data: bankOptions } = useFetch<
        BankAccount[],
        SelectOption[]
    >({
        url: "banks",
        key: ["banks"],
        options: {
            select: (banks) =>
                banks.map((bank) => ({
                    label: `${bank.bank_name} - ${bank.account_number} (${bank.owner_name})`,
                    value: bank.id.toString(),
                    default: bank.is_default === 1,
                    otherValue: bank
                })),
        },
    });

    return (
        <Popup
            onConfirm={onConfirm}
            variant="2xl"
            type="confirm"
            open={open}
            onClose={onClose}
            title="Phiếu phạt"
        >
            <div className="space-y-3">
                <div className="flex items-center justify-between border-b pb-3">
                    <h2 className="text-xl font-semibold">📚 Trả sách</h2>
                    <span className="text-xs px-3 py-1 bg-gray-100 rounded-full">
                        {borrow?.borrow_code}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                        <h3 className="text-sm font-semibold mb-3 text-gray-700">
                            Thông tin khách hàng
                        </h3>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <Info label="Khách hàng" value={borrow?.reader?.full_name} />
                            <Info label="Số điện thoại" value={borrow?.reader?.phone} />
                            <Info label="Email" value={borrow?.reader?.email} />
                            <Info label="Địa chỉ" value={borrow?.reader?.address} />
                        </div>
                    </div>

                    {/* Borrow Info */}
                    <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                        <h3 className="text-sm font-semibold mb-3 text-gray-700">
                            Thông tin mượn
                        </h3>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <Info
                                label="Ngày mượn"
                                value={formatDate(borrow?.borrow_date)}
                            />
                            <Info
                                label="Hạn trả"
                                value={formatDate(borrow?.due_date)}
                            />
                        </div>
                    </div>
                </div>


                {/* Fine */}
                {diffDays > 0 && (
                    <div className="p-5 rounded-xl bg-gradient-to-r from-red-50 to-red-100 border border-red-200 shadow-sm">
                        <p className="text-sm text-red-700 mb-1">
                            ⚠️ Quá hạn <b>{diffDays}</b> ngày
                        </p>

                        <p className="text-sm text-gray-700">
                            Phí mỗi ngày: <b>5,000₫</b>
                        </p>

                        <p className="text-xl font-bold text-red-600 mt-2">
                            Tổng tiền phạt: {totalFine.toLocaleString()}₫
                        </p>
                    </div>
                )}

                {/* Payment */}
                <div>
                    <FieldLabel>Phương thức thanh toán</FieldLabel>

                    <div className="mt-2">
                        <SelectApp
                            placeholder="Chọn phương thức thanh toán"
                            options={[
                                {
                                    label: "Tiền mặt",
                                    value: "money",
                                },
                                {
                                    label: "Chuyển khoản",
                                    value: "transfer",
                                },
                            ]}
                            onValueChange={onChangePaymentMethod}
                            value={paymentMethod ?? ""}
                        />
                    </div>
                    {
                        paymentMethod === "transfer" && <div className="mt-2">
                            <SelectApp
                                placeholder="Chọn tài khoản ngân hàng"
                                options={bankOptions ?? []}
                                onValueChange={onChangeBank}
                                value={bank?.id.toString() ?? ""}
                            />
                        </div>
                    }
                    {
                        paymentMethod === "transfer" && bank &&
                        <div className="w-full mt-3">
                            <LazyImage
                                src={`https://img.vietqr.io/image/${bank.bank_code}-${bank.account_number}-compact.jpg?amount=${totalFine.toLocaleString()}&addInfo=${borrow?.borrow_code}`}
                                className="w-40 h-40 mx-auto"
                            />
                        </div>
                    }

                </div>
            </div>
        </Popup>
    );
}

function Info({ label, value }: { label: string; value?: string }) {
    return (
        <div>
            <p className="text-gray-400 text-xs">{label}</p>
            <p className="font-medium text-gray-800">{value || "-"}</p>
        </div>
    );
}
