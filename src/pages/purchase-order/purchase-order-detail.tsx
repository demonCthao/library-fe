import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { LazyImage } from '@/components/ui/image';
import { PURCHASE_ORDER } from '@/constants/purchase-order.constants';
import { useFetch } from '@/hooks/useFetch';
import { formatDate } from '@/lib/utils';
import { PurchaseOrder } from '@/models/purchase-order.model';
import { useNotificationStore } from '@/store/notification.store';
import { useNavigate, useParams } from '@tanstack/react-router';
import { CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PurchaseOrderPayment from './purchase-order-payment';
import { useMutationRequest } from '@/hooks/useMutation';
import PurchaseOrderAdd from './purchase-order-add';
import { Book } from '@/models/book.model';

export default function PurchaseOrderDetail() {
    const { id } = useParams({ from: "/purchase-order-detail/$id" });
    const { t } = useTranslation();
    const navigate = useNavigate();
    const notification = useNotificationStore();
    const [isPayment, setIsPayment] = useState<boolean>(false);
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [isRemove, setIsRemove] = useState<boolean>(false);

    const { data, isLoading, error, refetch } = useFetch<PurchaseOrder>({
        url: `purchase-orders/${id}`,
        key: ["purchase-orders-detail", id],
    });

    const { mutate } = useMutationRequest({
        key: ["payment-purchase-order"],
        url: `purchase-orders/${id}`,
        method: "put", options: {
            onSuccess: () => {
                notification.updateState({ message: t("updateSuccess"), type: "success", open: true });
                refetch();
                setIsPayment(false)
            },
            onError: () => {
                notification.updateState({ message: t("updateFail"), type: "error", open: true });
            }
        }
    });

    if (isLoading) return <Loading />;
    if (error instanceof Error) return <div>{error.message}</div>;

    const isGuest = !data?.reader;

    const handlePayment = () => {
        mutate({
            payment_status: PURCHASE_ORDER.PAID
        })
    }

    const onAddBook = () => {
        setIsAdd(true)
    }

    const onCloseAddForm = () => {
        setIsAdd(false)
    }

    const onConfirmAdd = (books: Book[]) => {

    }

    const onRemoveBook = (id: number) => {
        setIsRemove(true)
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        🧾 Chi tiết đơn mua sách
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Mã đơn: {data?.purchase_order_code}
                    </p>
                </div>

                <div className="flex gap-3">
                    <span
                        className={`px-4 py-1 rounded-full text-sm font-medium inline-flex items-center justify-center
                            ${data?.payment_status === "PAID"
                                ? "bg-green-100 text-green-600"
                                : "bg-yellow-100 text-yellow-600"
                            }`}
                    >
                        {t(data?.payment_status === PURCHASE_ORDER.PAID ? "paid" : "unpaid")}
                    </span>

                    {
                        data?.payment_status === PURCHASE_ORDER.UNPAID && <Button
                            variant="outline"
                            onClick={() => setIsPayment(true)}
                            className="bg-green-500 hover:bg-green-600 shadow"
                        >
                            {t("payment")}
                        </Button>
                    }

                    <Button
                        variant="outline"
                        onClick={() => navigate({ to: "/purchase-order" })}
                    >
                        ← {t("back")}
                    </Button>
                </div>
            </div>

            {/* INFO */}
            <div className="grid md:grid-cols-2 gap-6">

                {/* USER INFO */}
                <Card title={"👤" + (isGuest ? t("guestCustomer") : t("customerInformation"))}>
                    {isGuest ? (
                        <>
                            <Info label="Tên" value={data?.guest_name || "-"} />
                            <Info label="SĐT" value={data?.guest_phone || "-"} />
                        </>
                    ) : (
                        <>
                            <Info label="Mã KH" value={data?.reader?.reader_code} />
                            <Info label="Họ tên" value={data?.reader?.full_name} />
                            <Info label="Email" value={data?.reader?.email} />
                            <Info label="Điện thoại" value={data?.reader?.phone} />
                            <Info label="Địa chỉ" value={data?.reader?.address} />
                        </>
                    )}
                </Card>

                {/* ORDER INFO */}
                <Card title={"🧾" + t("orderInformation")}>
                    <Info label="Mã đơn" value={data?.purchase_order_code} />
                    <Info
                        label="Ngày tạo"
                        value={formatDate(data?.created_at)}
                    />
                    <Info
                        label="Tổng số sách"
                        value={String(data?.books?.length || 0)}
                    />
                    <Info
                        label="Tổng số tiền"
                        value={Number(data?.total_price).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND"
                        })}
                    />
                </Card>

            </div>

            {/* BOOK LIST */}
            <div className="bg-white rounded-xl shadow p-5">
                <div className="flex justify-between w-full items-center">
                    <h2 className="text-lg font-semibold mb-4">
                        📚 Danh sách sách
                    </h2>
                    {
                        data?.payment_status === PURCHASE_ORDER.UNPAID && <div onClick={onAddBook}>
                            <CirclePlus className="cursor-pointer" size={26} />
                        </div>
                    }
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {data?.books.map((book) => (
                        <div
                            key={book.id}
                            className="border rounded-xl overflow-hidden hover:shadow-lg transition"
                        >
                            <div className="h-44 bg-gray-100">
                                {book.avatar_path ? (
                                    <LazyImage
                                        src={`http://127.0.0.1:3000${book.avatar_path}`}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>

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
                                    <p>
                                        Giá: {Number(book.price).toLocaleString()}đ
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {
                isPayment && 
                <PurchaseOrderPayment 
                handleConfirm={handlePayment} 
                purchase={data}
                onClose={() => setIsPayment(false)} 
                />
            }
            {
                isAdd && 
                <PurchaseOrderAdd
                    onClose={onCloseAddForm}
                    onConfirm={onConfirmAdd} 
                />
            }
        </div>
    )
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

function Info({
    label,
    value,
}: {
    label: string;
    value?: string;
}) {
    return (
        <div className="flex justify-between text-sm">
            <span className="text-gray-400">{label}</span>
            <span className="font-medium text-gray-800">
                {value || "-"}
            </span>
        </div>
    );
}
