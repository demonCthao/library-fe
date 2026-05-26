import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { LazyImage } from '@/components/ui/image';
import { PURCHASE_ORDER } from '@/constants/purchase-order.constants';
import { useFetch } from '@/hooks/useFetch';
import { formatDate } from '@/lib/utils';
import { PurchaseOrder } from '@/models/purchase-order.model';
import { useNotificationStore } from '@/store/notification.store';
import { useNavigate, useParams } from '@tanstack/react-router';
import { CirclePlus, X, ArrowLeft, Receipt, User, Package, Wallet } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PurchaseOrderPayment from './purchase-order-payment';
import { useMutationRequest } from '@/hooks/useMutation';
import PurchaseOrderAdd from './purchase-order-add';
import { Book } from '@/models/book.model';
import ConfirmDialog from '@/components/confirm-dialog';
import _ from 'lodash';

export default function PurchaseOrderDetail() {
    const { id } = useParams({ from: "/purchase-order-detail/$id" });
    const { t } = useTranslation();
    const navigate = useNavigate();
    const notification = useNotificationStore();
    const [isPayment, setIsPayment] = useState<boolean>(false);
    const [isAdd, setIsAdd] = useState<boolean>(false);
    const [isRemove, setIsRemove] = useState<boolean>(false);
    const [bookSelected, setBookSelected] = useState<Book | null>(null)

    const { data, isLoading, error, refetch } = useFetch<PurchaseOrder>({
        url: `purchase-orders/${id}`,
        key: ["purchase-orders-detail", id],
    });

    const { mutate } = useMutationRequest({
        key: ["payment-purchase-order"],
        url: `purchase-orders/${id}`,
        method: "put",
        options: {
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

    const { mutate: mutateUpdateBooks } = useMutationRequest({
        key: ["update-book-purchase-order"],
        url: `purchase-orders/update-book/${id}`,
        method: "post",
        options: {
            onSuccess: () => {
                notification.updateState({ message: t("updateSuccess"), type: "success", open: true });
                refetch();
                if (isRemove) { setIsRemove(false); setBookSelected(null); }
                if (isAdd) { setIsAdd(false); }
            },
            onError: () => {
                notification.updateState({ message: t("updateFail"), type: "error", open: true });
            }
        }
    });

    if (isLoading) return <Loading />;
    if (error instanceof Error) return <div className="text-center p-20 text-red-400">{error.message}</div>;

    const isGuest = !data?.users;

    const onConfirmAdd = (books: Book[]) => {
        mutateUpdateBooks({
            purchase_order_items: books.map(book => ({
                purchase_order_id: Number(id),
                book_id: book.id,
                unit_price: book.price,
                quantity: 1
            }))
        })
    }

    const handleConfirmDelete = () => {
        mutateUpdateBooks({
            purchase_order_items: data?.books.filter(book => book.id !== bookSelected?.id).map(book => ({
                purchase_order_id: Number(id),
                book_id: book.id,
                unit_price: book.price,
                quantity: 1
            }))
        })
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 text-zinc-200 mt-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate({ to: "/purchase-order" })}
                        className="p-2 hover:bg-zinc-800 rounded-full transition-colors text-zinc-400 hover:text-white"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2 italic">
                            <Receipt className="text-emerald-500" />
                            Chi tiết đơn hàng
                        </h1>
                        <p className="text-zinc-500 text-sm mt-1 font-mono tracking-tighter">
                            ID: {data?.purchase_order_code}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border
                        ${data?.payment_status === "PAID"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse"
                        }`}
                    >
                        {t(data?.payment_status === PURCHASE_ORDER.PAID ? "paid" : "unpaid")}
                    </span>

                    {data?.payment_status === PURCHASE_ORDER.UNPAID && (
                        <Button
                            onClick={() => setIsPayment(true)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 shadow-lg shadow-emerald-500/20"
                        >
                            <Wallet size={18} className="mr-2" />
                            {t("payment")}
                        </Button>
                    )}
                </div>
            </div>

            {/* INFO GRID */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card icon={<User size={18} className="text-emerald-500" />} title={isGuest ? t("guestCustomer") : t("customerInformation")}>
                    {isGuest ? (
                        <>
                            <Info label="Tên khách hàng" value={data?.guest_name} />
                            <Info label="Số điện thoại" value={data?.guest_phone} />
                        </>
                    ) : (
                        <>
                            <Info label="Mã thành viên" value={data?.users?.user_code} />
                            <Info label="Họ tên" value={data?.users?.full_name} />
                            <Info label="Liên hệ" value={`${data?.users?.phone} | ${data?.users?.email}`} />
                            <Info label="Địa chỉ" value={data?.users?.address} />
                        </>
                    )}
                </Card>

                <Card icon={<Package size={18} className="text-emerald-500" />} title={t("orderInformation")}>
                    <Info label="Ngày khởi tạo" value={formatDate(data?.created_at)} />
                    <Info label="Số lượng mặt hàng" value={`${data?.books?.length || 0} sản phẩm`} />
                    <div className="pt-2 mt-2 border-t border-zinc-800 flex justify-between items-center">
                        <span className="text-zinc-500 text-xs uppercase font-bold tracking-widest italic">Tổng thanh toán</span>
                        <span className="text-xl font-black text-emerald-400">
                            {Number(data?.total_price).toLocaleString("vi-VN")}₫
                        </span>
                    </div>
                </Card>
            </div>

            {/* BOOK LIST */}
            <div className="bg-[#1e1e20] rounded-2xl border border-zinc-800 overflow-hidden shadow-xl">
                <div className="p-6 border-b border-zinc-800 bg-zinc-800/30 flex justify-between items-center">
                    <h2 className="text-lg font-bold flex items-center gap-2 uppercase tracking-tight">
                        <span className="w-2 h-6 bg-emerald-500 rounded-full mr-1"></span>
                        Danh mục sản phẩm ({data?.books.length})
                    </h2>
                    {data?.payment_status === PURCHASE_ORDER.UNPAID && (
                        <button
                            onClick={() => setIsAdd(true)}
                            className="flex items-center gap-2 text-xs font-bold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white px-4 py-2 rounded-xl transition-all border border-emerald-500/20"
                        >
                            <CirclePlus size={18} />
                            THÊM SÁCH
                        </button>
                    )}
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data?.books.map((book) => (
                            <div
                                key={book.id}
                                className="group relative bg-[#141414] border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-600 transition-all duration-300"
                            >
                                {data?.payment_status === PURCHASE_ORDER.UNPAID && (
                                    <button
                                        onClick={() => { setBookSelected(book); setIsRemove(true); }}
                                        className="absolute top-3 right-3 z-20 p-2 bg-zinc-900/80 hover:bg-rose-500 text-zinc-400 hover:text-white rounded-lg backdrop-blur-md transition-all border border-zinc-800 opacity-0 group-hover:opacity-100"
                                    >
                                        <X size={14} />
                                    </button>
                                )}

                                <div className="h-40 bg-zinc-900 overflow-hidden">
                                    {book.avatar_path ? (
                                        <LazyImage
                                            src={`http://127.0.0.1:3000${book.avatar_path}`}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-zinc-700 font-bold text-xs uppercase">No Cover</div>
                                    )}
                                </div>

                                <div className="p-4 space-y-3">
                                    <h3 className="font-bold text-zinc-100 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                                        {book.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 text-[10px]">
                                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded uppercase">{book.publish_year}</span>
                                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded uppercase">{book.pages} Trang</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                                        <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-tighter">Đơn giá:</span>
                                        <span className="text-sm font-bold text-emerald-400">
                                            {Number(book.price).toLocaleString()}₫
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* MODALS */}
            {isPayment && (
                <PurchaseOrderPayment
                    handleConfirm={() => mutate({ payment_status: PURCHASE_ORDER.PAID })}
                    purchase={data}
                    onClose={() => setIsPayment(false)}
                />
            )}
            {isAdd && (
                <PurchaseOrderAdd
                    onClose={() => setIsAdd(false)}
                    onConfirm={onConfirmAdd}
                    booksDefault={data?.books ?? []}
                />
            )}
            {isRemove && (
                <ConfirmDialog
                    label={_.defaultTo(bookSelected?.title, "Sách này")}
                    onClose={() => { setIsRemove(false); setBookSelected(null); }}
                    onConfirm={handleConfirmDelete}
                    open={isRemove}
                />
            )}
        </div>
    )
}

function Card({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div className="bg-[#1e1e20] rounded-2xl border border-zinc-800 p-6 shadow-xl transition-all hover:border-zinc-700">
            <div className="flex items-center gap-3 mb-5 border-b border-zinc-800 pb-3">
                {icon}
                <h2 className="text-xs uppercase font-bold tracking-[0.2em] text-zinc-500">
                    {title}
                </h2>
            </div>
            <div className="space-y-4">{children}</div>
        </div>
    );
}

function Info({ label, value }: { label: string; value?: string }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500 font-medium">{label}</span>
            <span className="font-semibold text-zinc-200 truncate ml-4">
                {value || "—"}
            </span>
        </div>
    );
}