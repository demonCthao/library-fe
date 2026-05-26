import { Popup } from "@/components/popup"
import { SelectApp, SelectOption } from "@/components/select-app"
import { FieldLabel } from "@/components/ui/field"
import { LazyImage } from "@/components/ui/image"
import { useFetch } from "@/hooks/useFetch"
import { formatDate } from "@/lib/utils"
import { BankAccount } from "@/models/bank.model"
import { BorrowDetail } from "@/models/borrow-detail.model"
import { useState } from "react"
import { AlertTriangle, Banknote, CreditCard, User, Info as InfoIcon } from "lucide-react"

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
    const [bank, setBank] = useState<BankAccount | null>(null);
    const [isConfirm, setIsConfirm] = useState<boolean>(false)

    const onChangePaymentMethod = (value: string) => {
        setPaymentMethod(value)
    }

    const onChangeBank = (value: string) => {
        const bankOption = bankOptions?.find(b => b.value === value)
        if (bankOption) {
            setBank(bankOption.otherValue)
        }
    }

    const onShowConfirmPopup = () => {
        setIsConfirm(true)
    }

    const onConfirm = () => {
        handleConfirm(paymentMethod)
    }

    const onCancel = () => {
        setIsConfirm(false)
    }

    const { data: bankOptions } = useFetch<BankAccount[], SelectOption[]>({
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
            onConfirm={onShowConfirmPopup}
            variant="2xl"
            type="confirm"
            open={open}
            onClose={onClose}
            title="Xử lý trả sách & Phí phạt"
            // Đảm bảo Popup component của bạn nhận class để style dark mode
            className="bg-[#1a1a1c] text-gray-200 border border-zinc-800 shadow-2xl"
        >
            <div className="space-y-6">
                {/* Header Info */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <Banknote size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-white">Xác nhận trả sách</h2>
                    </div>
                    <span className="text-[10px] font-bold px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700 tracking-widest uppercase">
                        {borrow?.borrow_code}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Customer Info */}
                    <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-4 transition-hover hover:border-zinc-700">
                        <div className="flex items-center gap-2 mb-4 text-zinc-400">
                            <User size={16} />
                            <h3 className="text-xs font-bold uppercase tracking-wider">Thông tin khách hàng</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <Info label="Khách hàng" value={borrow?.users?.full_name} />
                            <Info label="Liên hệ" value={`${borrow?.users?.phone} | ${borrow?.users?.email}`} />
                        </div>
                    </div>

                    {/* Borrow Info */}
                    <div className="bg-[#141414] border border-zinc-800 rounded-2xl p-4 transition-hover hover:border-zinc-700">
                        <div className="flex items-center gap-2 mb-4 text-zinc-400">
                            <InfoIcon size={16} />
                            <h3 className="text-xs font-bold uppercase tracking-wider">Thông tin mượn</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Info label="Ngày mượn" value={formatDate(borrow?.borrow_date)} />
                            <Info label="Hạn trả" value={formatDate(borrow?.due_date)} />
                        </div>
                    </div>
                </div>

                {/* Fine Section */}
                {diffDays > 0 ? (
                    <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 shadow-inner">
                        <div className="flex items-center gap-3 text-red-400 mb-3">
                            <AlertTriangle size={24} className="animate-pulse" />
                            <div>
                                <p className="text-sm font-bold uppercase tracking-wide">Phát hiện quá hạn mượn sách</p>
                                <p className="text-xs opacity-70">Sách đã quá hạn {diffDays} ngày (Đơn giá: 5,000₫/ngày)</p>
                            </div>
                        </div>
                        <div className="flex items-end justify-between">
                            <p className="text-xs text-zinc-500">Vui lòng thu phí trước khi hoàn tất</p>
                            <p className="text-3xl font-black text-red-500 tracking-tighter">
                                {totalFine.toLocaleString()}₫
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-3 text-emerald-400">
                        <InfoIcon size={20} />
                        <span className="text-sm font-medium">Sách trả đúng hạn. Không phát sinh phí phạt.</span>
                    </div>
                )}

                {/* Payment Section */}
                <div className="space-y-4 pt-2">
                    <FieldLabel className="text-zinc-400 text-xs font-bold uppercase tracking-widest">
                        Phương thức thanh toán
                    </FieldLabel>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <SelectApp
                            placeholder="Chọn phương thức"
                            options={[
                                { label: "💵 Tiền mặt", value: "money" },
                                { label: "💳 Chuyển khoản", value: "transfer" },
                            ]}
                            onValueChange={onChangePaymentMethod}
                            value={paymentMethod ?? ""}
                            className="bg-[#141414] border-zinc-800"
                        />

                        {paymentMethod === "transfer" && (
                            <SelectApp
                                placeholder="Chọn tài khoản ngân hàng"
                                options={bankOptions ?? []}
                                onValueChange={onChangeBank}
                                value={bank?.id.toString() ?? ""}
                                className="bg-[#141414] border-zinc-800"
                            />
                        )}
                    </div>

                    {paymentMethod === "transfer" && bank && (
                        <div className="w-full mt-4 p-4 bg-white rounded-2xl flex flex-col items-center gap-2 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                            <LazyImage
                                src={`https://img.vietqr.io/image/${bank.bank_code}-${bank.account_number}-compact.jpg?amount=${totalFine}&addInfo=${borrow?.borrow_code}`}
                                className="w-48 h-48 object-contain"
                            />
                            <p className="text-[10px] text-gray-400 font-bold uppercase">Quét mã QR để thanh toán nhanh</p>
                        </div>
                    )}
                </div>
            </div>

            {isConfirm && (
                <ConfirmPayment
                    onClose={onCancel}
                    onConfirm={onConfirm}
                    totalFine={totalFine}
                />
            )}
        </Popup>
    );
}

function Info({ label, value }: { label: string; value?: string }) {
    return (
        <div className="space-y-0.5">
            <p className="text-zinc-500 text-[11px] font-medium">{label}</p>
            <p className="font-semibold text-zinc-200 text-sm truncate">{value || "—"}</p>
        </div>
    );
}

interface IConfirmPaymentProps {
    onConfirm: () => void,
    onClose: () => void,
    totalFine: number
}

const ConfirmPayment = ({ onConfirm, onClose, totalFine }: IConfirmPaymentProps) => {
    return (
        <Popup
            variant="sm"
            type="confirm"
            open
            onConfirm={onConfirm}
            onClose={onClose}
            title="Xác nhận giao dịch"
            className="bg-[#1a1a1c] text-gray-200 border border-zinc-800 shadow-2xl"
        >
            <div className="p-2">
                <p className="text-zinc-300">Bạn có xác nhận đã thu số tiền <span className="text-emerald-400 font-bold">{totalFine.toLocaleString()}₫</span> và hoàn tất trả sách?</p>
            </div>
        </Popup>
    )
}