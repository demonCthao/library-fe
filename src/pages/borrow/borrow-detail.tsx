import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/image";
import { statusBorrowMap } from "@/constants/borrow-status";
import { useFetch } from "@/hooks/useFetch";
import { formatDate } from "@/lib/utils";
import { BorrowDetail } from "@/models/borrow-detail.model";
import { useNotificationStore } from "@/store/notification.store";
import { useNavigate, useParams } from "@tanstack/react-router";
import _ from "lodash";
import { useState } from "react";
import FineReceiptPopup from "./fine-receipt-popup";

export default function BorrowDetailPage() {
    const { id } = useParams({ from: "/borrow-detail/$id" });
    const navigation = useNavigate();
    const notification = useNotificationStore();
    const [openPopup, setOpenPopup] = useState<boolean>(false)

    const { data, isLoading, error } = useFetch<BorrowDetail>({
        url: `borrow-record/${id}`,
        key: ["borrow-detail", id],
    });

    if (isLoading) {
        return <Loading />
    }

    if (error instanceof Error) return <div>{error.message}</div>

    const status = statusBorrowMap[data?.status ?? ""] ?? {
        label: data?.status,
        className: "bg-gray-100 text-gray-600",
    };

    const handleBackToList = () => {
        navigation({
            to: "/borrow-records",
            replace: true
        })
    };

    const returnBook = () => {

        if (_.isUndefined(data?.due_date)) {
            return;
        }

        const isOverdue = new Date() > new Date(data?.due_date)

        if (isOverdue) {
            notification.updateState({ message: "Đã quá hạn ngày trả", open: true, type: "warning" });
            setOpenPopup(true);
            return;
        }
    }

    const handleClosePopup = () => {
        setOpenPopup(false);
    }

    const handleConfirm = () => {
        
    }

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="w-full flex">
                <div className="ml-auto flex gap-2">
                    <Button className="bg-green-500 hover:bg-green-600" onClick={handleBackToList}>Quay về danh sách</Button>
                    {
                        _.isNull(data?.return_date) && <Button className="bg-red-500 hover:bg-red-600" onClick={returnBook}>Trả sách</Button>
                    }
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Chi tiết phiếu mượn</h1>
                    <p className="text-gray-500">
                        Mã phiếu: {data?.borrow_code || `BR-${data?.id}`}
                    </p>
                </div>
                <span
                    className={`px-4 py-1 rounded text-sm font-medium ${status.className}`}
                >
                    {status.label}
                </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-xl p-5 space-y-3">
                    <h2 className="text-lg font-semibold border-b pb-2">
                        Thông tin độc giả
                    </h2>

                    <div className="space-y-2 text-sm">
                        <p><strong>Mã:</strong> {data?.reader.reader_code}</p>
                        <p><strong>Họ tên:</strong> {data?.reader.full_name}</p>
                        <p><strong>Email:</strong> {data?.reader.email}</p>
                        <p><strong>Điện thoại:</strong> {data?.reader.phone}</p>
                        <p><strong>Địa chỉ:</strong> {data?.reader.address}</p>
                    </div>
                </div>

                <div className="bg-white shadow rounded-xl p-5 space-y-3">
                    <h2 className="text-lg font-semibold border-b pb-2">
                        Thông tin mượn
                    </h2>

                    <div className="space-y-2 text-sm">
                        <p>
                            <strong>Ngày mượn: </strong>
                            {formatDate(data?.borrow_date)}
                        </p>
                        <p>
                            <strong>Hạn trả: </strong>
                            {formatDate(data?.due_date)}
                        </p>
                        <p>
                            <strong>Ngày trả:</strong>{" "}
                            {data?.return_date
                                ? new Date(data?.return_date).toLocaleDateString()
                                : "Chưa trả"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-xl p-5">
                <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                    Danh sách sách
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data?.books.map((book) => (
                        <div
                            key={book.id}
                            className="border rounded-lg p-4 hover:shadow-md transition"
                        >
                            <div className="h-40 bg-gray-100 flex items-center justify-center mb-3 rounded">
                                {book.avatar_path ? (
                                    <LazyImage
                                        src={`http://127.0.0.1:3000${book.avatar_path}`}
                                        alt={book.title}
                                        className="h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-sm">
                                        No Image
                                    </span>
                                )}
                            </div>

                            <h3 className="font-semibold">{book.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">
                                {book.description}
                            </p>

                            <div className="text-xs text-gray-400 mt-2 space-y-1">
                                <p>Năm XB: {book.publish_year}</p>
                                <p>Số trang: {book.pages}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <FineReceiptPopup handleConfirm={handleConfirm} open={openPopup} borrow={data} onClose={handleClosePopup} />
        </div>
    )
}
