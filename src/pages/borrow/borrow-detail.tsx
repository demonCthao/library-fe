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
import { useState } from "react";
import FineReceiptPopup from "./fine-receipt-popup";
import { useTranslation } from "react-i18next";

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
        method: "post", options: {
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

    if (error instanceof Error) return <div>{error.message}</div>;

    const status = statusBorrowMap[data?.status ?? ""] ?? {
        label: data?.status,
        className: "bg-gray-100 text-gray-600",
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
            setOpenPopup(true);
            return;
        }
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
        <div className="max-w-7xl mx-auto space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">📄 Chi tiết phiếu mượn</h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Mã phiếu: {data?.borrow_code || `BR-${data?.id}`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span
                        className={`px-4 py-1 rounded-full text-sm font-medium ${status.className}`}
                    >
                        {status.label}
                    </span>

                    <Button
                        variant="outline"
                        onClick={handleBackToList}
                    >
                        ← Quay lại
                    </Button>

                    {_.isNull(data?.return_date) && (
                        <Button
                            className="bg-green-500 hover:bg-green-600 shadow"
                            onClick={returnBook}
                        >
                            Trả sách
                        </Button>
                    )}
                </div>
            </div>

            {/* INFO */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card title="👤 Thông tin độc giả">
                    <Info label="Mã" value={data?.reader.reader_code} />
                    <Info label="Họ tên" value={data?.reader.full_name} />
                    <Info label="Email" value={data?.reader.email} />
                    <Info label="Điện thoại" value={data?.reader.phone} />
                    <Info label="Địa chỉ" value={data?.reader.address} />
                </Card>

                <Card title="📖 Thông tin mượn">
                    <Info label="Ngày mượn" value={formatDate(data?.borrow_date)} />
                    <Info label="Hạn trả" value={formatDate(data?.due_date)} />
                    <Info
                        label="Ngày trả"
                        value={
                            data?.return_date
                                ? new Date(data?.return_date).toLocaleDateString()
                                : "Chưa trả"
                        }
                    />
                </Card>
            </div>

            {/* BOOK LIST */}
            <div className="bg-white rounded-xl shadow p-5">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    📚 Danh sách sách
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {data?.books.map((book) => (
                        <div
                            key={book.id}
                            className="group border rounded-xl overflow-hidden hover:shadow-lg transition"
                        >
                            {/* IMAGE */}
                            <div className="h-44 bg-gray-100 overflow-hidden">
                                {book.avatar_path ? (
                                    <LazyImage
                                        src={`http://127.0.0.1:3000${book.avatar_path}`}
                                        alt={book.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                                        No Image
                                    </div>
                                )}
                            </div>

                            {/* CONTENT */}
                            <div className="p-4 space-y-2">
                                <h3 className="font-semibold line-clamp-1">
                                    {book.title}
                                </h3>

                                <p className="text-sm text-gray-500 line-clamp-2">
                                    {book.description}
                                </p>

                                <div className="text-xs text-gray-400 pt-2 border-t">
                                    <p>Năm XB: {book.publish_year}</p>
                                    <p>Số trang: {book.pages}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* POPUP */}
            <FineReceiptPopup
                handleConfirm={confirmReturnBook}
                open={openPopup}
                borrow={data}
                onClose={() => setOpenPopup(false)}
            />
        </div>
    );
}

function Card({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-xl shadow p-5 space-y-3">
            <h2 className="text-lg font-semibold border-b pb-2">
                {title}
            </h2>
            <div className="space-y-2 text-sm">{children}</div>
        </div>
    );
}

function Info({ label, value }: { label: string; value?: string }) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-gray-400">{label}</span>
            <span className="font-medium text-gray-800">
                {value || "-"}
            </span>
        </div>
    );
}
