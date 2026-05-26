import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/image";
import { statusBorrowMap } from "@/constants/borrow-status";
import { useFetch } from "@/hooks/useFetch";
import { useMutationRequest } from "@/hooks/useMutation";
import { formatDate } from "@/lib/utils";
import { BorrowDetail } from "@/models/borrow-detail.model";
import { useNotificationStore } from "@/store/notification.store";
import { useNavigate, useParams } from "@tanstack/react-router";
import _ from "lodash";
import { ArrowLeft, BookCheck, BookOpenCheck, Calendar, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FineReceiptPopup from "./fine-receipt-popup";

export default function BorrowDetailPage() {
    const { t } = useTranslation();
    const { id } = useParams({ from: "/borrow-detail/$id" });
    const navigation = useNavigate();
    const notification = useNotificationStore();
    const [openPopup, setOpenPopup] = useState<boolean>(false);

    const { data, isLoading, error, refetch } = useFetch<BorrowDetail>({
        url: `borrow-record/${id}`,
        key: ["borrow-detail", id],
    });

    const { mutate } = useMutationRequest({
        key: ["return-book-record"],
        url: `borrow-record/return-book/${id}`,
        method: "post",
        options: {
            onSuccess: () => {
                notification.updateState({ message: t("updateSuccess"), type: "success", open: true });
                refetch();
                setOpenPopup(false)
            },
            onError: () => {
                notification.updateState({ message: t("updateFail"), type: "error", open: true });
            }
        }
    });

    if (isLoading) return <Loading />;
    if (error instanceof Error) return <div className="text-red-500 p-10 text-center">{error.message}</div>;

    const status = statusBorrowMap[data?.status ?? ""] ?? {
        label: data?.status,
        className: "bg-zinc-800 text-zinc-400",
    };

    const handleBackToList = () => {
        navigation({ to: "/borrow-records", replace: true });
    };

    const returnBook = () => {
        if (_.isUndefined(data?.due_date)) return;
        const isOverdue = new Date() > new Date(data?.due_date);

        if (isOverdue) {
            notification.updateState({
                message: "Đã quá hạn ngày trả",
                open: true,
                type: "warning",
            });
        }
        setOpenPopup(true);
    };

    const confirmReturnBook = (payment: string | null) => {
        if (!payment) {
            notification.updateState({
                message: t("requirePaymentMethod"),
                open: true,
                type: "error",
            });
            return;
        }
        mutate({})
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 text-gray-200 mt-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleBackToList}
                        className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2 italic">
                            <BookOpenCheck className="text-emerald-500" />
                            Chi tiết phiếu mượn
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1 font-mono tracking-tighter">
                            ID: {data?.borrow_code || `BR-${data?.id}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border transition-all
                            ${data?.status === "returned"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse"
                        }`}
                    >
                        {status.label}
                    </span>

                    {_.isNull(data?.return_date) && (
                        <Button
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 shadow-lg shadow-emerald-500/20"
                            onClick={returnBook}
                        >
                            <BookCheck size={18} className="mr-2" />
                            Trả sách
                        </Button>
                    )}
                </div>
            </div>

            {/* INFO GRID */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card icon={<UserIcon className="text-emerald-500" size={20} />} title="Thông tin độc giả">
                    <Info label="Họ tên" value={data?.users?.full_name} />
                    <Info label="Email" value={data?.users?.email} />
                    <Info label="Điện thoại" value={data?.users?.phone} />
                    <Info label="Địa chỉ" value={data?.users?.address} />
                </Card>

                <Card icon={<Calendar className="text-emerald-500" size={20} />} title="Thời gian mượn">
                    <Info label="Ngày mượn" value={formatDate(data?.borrow_date)} />
                    <Info label="Hạn trả" value={formatDate(data?.due_date)} isHighlight={new Date() > new Date(data?.due_date ?? "") && !data?.return_date} />
                    <Info
                        label="Ngày trả thực tế"
                        value={data?.return_date ? formatDate(data?.return_date) : "Chưa trả"}
                        valueColor={data?.return_date ? "text-emerald-400" : "text-orange-400"}
                    />
                </Card>
            </div>

            {/* BOOK LIST */}
            <div className="bg-[#1e1e20] rounded-2xl border border-zinc-800 overflow-hidden">
                <div className="p-6 border-b border-zinc-800 bg-zinc-800/30">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        Danh sách sách mượn ({data?.books.length})
                    </h2>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data?.books.map((book) => (
                            <div
                                key={book.id}
                                className="group bg-[#141414] border border-zinc-800 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all duration-300"
                            >
                                <div className="h-48 bg-zinc-900 relative">
                                    {book.avatar_path ? (
                                        <LazyImage
                                            src={`http://127.0.0.1:3000${book.avatar_path}`}
                                            alt={book.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-zinc-700 uppercase text-xs font-bold">
                                            No Image
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-xs font-bold px-3 py-1 bg-emerald-500 rounded-full">Xem sách</span>
                                    </div>
                                </div>

                                <div className="p-4 space-y-3">
                                    <h3 className="font-bold text-gray-100 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                                        {book.title}
                                    </h3>
                                    <p className="text-xs text-zinc-500 line-clamp-2 italic h-8">
                                        {book.description || "Không có mô tả..."}
                                    </p>
                                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 uppercase tracking-tighter">
                                        <span>XB: {book.publish_year}</span>
                                        <span>{book.pages} trang</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <FineReceiptPopup
                handleConfirm={confirmReturnBook}
                open={openPopup}
                borrow={data}
                onClose={() => setOpenPopup(false)}
            />
        </div>
    );
}

// COMPONENT CARD TỐI
function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="bg-[#1e1e20] rounded-2xl border border-zinc-800 p-6 shadow-xl transition-all hover:border-zinc-700">
            <div className="flex items-center gap-3 mb-5 border-b border-zinc-800 pb-3">
                {icon}
                <h2 className="text-sm uppercase font-bold tracking-widest text-zinc-400">
                    {title}
                </h2>
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

// COMPONENT INFO TỐI
function Info({ label, value, isHighlight, valueColor }: { label: string; value?: string; isHighlight?: boolean; valueColor?: string }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500 font-medium">{label}</span>
            <span className={`font-semibold ${isHighlight ? "text-red-400 animate-pulse" : valueColor || "text-zinc-200"}`}>
                {value || "—"}
            </span>
        </div>
    );
}