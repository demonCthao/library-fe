import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LazyImage } from "@/components/ui/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PURCHASE_ORDER } from "@/constants/purchase-order.constants";
import { useFetch } from "@/hooks/useFetch";
import { useMutationRequest } from "@/hooks/useMutation";
import { PurchaseOrder } from "@/models/purchase-order.model";
import { useAccountStore } from "@/store/account.store";
import { useNotificationStore } from "@/store/notification.store";
import { format } from "date-fns"; // Nếu bạn có cài date-fns, nếu không dùng JS thuần
import { Loader2, RotateCcw, ShoppingBag } from "lucide-react";
import React, { useState } from "react";
import { DeleteOrderDialog } from "./user-page-delete-order";

export default function UserPageOrder() {
    const account = useAccountStore();
    const notification = useNotificationStore();
    const [selectedPurchaseOrder, setSelectedPurchaseOrder] = useState<PurchaseOrder | null>(null);
    const [isConfirm, setIsConfirm] = useState<boolean>(false)

    // Fetch dữ liệu thực tế từ API
    const { data: dataOrders, isLoading, refetch } = useFetch<PurchaseOrder[]>({
        url: "users-pages/orders/" + account.user?.userId,
        key: ["orders"],
    });

    const { mutate } = useMutationRequest({
        key: ["delete-purchase-order"],
        url: `purchase-orders/${selectedPurchaseOrder?.id}`, method: "delete", options: {
            onSuccess: () => {
                notification.updateState({ message: "Cập nhật dữ liệu thành công", type: "success", open: true });
                refetch()
            },
            onError: () => {
                notification.updateState({ message: "Cập nhật dữ liệu thất bại", type: "error", open: true });
            }
        }
    });

    // Hàm render trạng thái dựa trên dữ liệu JSON thực tế (payment_status)
    const renderStatus = (status: string) => {
        switch (status) {
            case "PAID":
                return <Badge className="bg-green-500/20 text-green-500 border-none hover:bg-green-500/30">Đã thanh toán</Badge>;
            case "UNPAID":
                return <Badge className="bg-yellow-500/20 text-yellow-500 border-none hover:bg-yellow-500/30">Chờ thanh toán</Badge>;
            case "CANCELLED":
                return <Badge className="bg-red-500/20 text-red-500 border-none hover:bg-red-500/30">Đã hủy</Badge>;
            default:
                return <Badge className="bg-gray-500/20 text-gray-500 border-none">{status}</Badge>;
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
            </div>
        );
    }

    const cancelOrder = (order: PurchaseOrder) => {
        if (order.payment_status === PURCHASE_ORDER.PAID) {
            notification.updateState({
                message: "Đơn hàng đã thanh toán không thể hủy",
                type: "warning",
                open: true
            })
            return;
        }

        setSelectedPurchaseOrder(order);
        setIsConfirm(true);
    }

    const onConfirmDelete = () => {
        mutate({})
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <ShoppingBag className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Đơn hàng đã mua</h1>
                        <p className="text-xs text-gray-500 mt-1">Quản lý và theo dõi các giao dịch của bạn</p>
                    </div>
                </div>

                <ScrollArea className="h-full">
                    <div className="space-y-6">
                        {dataOrders && dataOrders.length > 0 ? (
                            dataOrders.map((order) => (
                                <Card key={order.id} className="bg-[#141414] border-gray-800 border-none shadow-2xl overflow-hidden">
                                    {/* Header đơn hàng */}
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 bg-[#1a1a1a]/50 border-b border-gray-800">
                                        <div className="flex flex-col gap-1">
                                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Mã đơn hàng</p>
                                            <p className="text-sm font-mono text-green-500 font-bold tracking-wider">
                                                {order.purchase_order_code}
                                            </p>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-2">
                                            <p className="text-xs text-gray-500">
                                                {format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}
                                            </p>
                                            {renderStatus(order.payment_status)}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="p-4 space-y-4">
                                        {/* Danh sách sản phẩm từ purchase_order_items */}
                                        {order.purchase_order_items.map((item, index) => (
                                            <React.Fragment key={item.id}>
                                                <div className="flex items-center justify-between gap-4 py-2">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-22 bg-gray-900 rounded-md overflow-hidden border border-gray-800 flex-shrink-0 shadow-inner">
                                                            <LazyImage
                                                                src={`http://127.0.0.1:3000${item.books.avatar_path}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <h3 className="text-sm font-medium text-gray-200 line-clamp-1 hover:text-green-500 cursor-pointer transition-colors">
                                                                {item.books.title}
                                                            </h3>
                                                            <p className="text-[11px] text-gray-500 italic uppercase">ISBN: {item.books.isbn}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <span className="text-[11px] px-1.5 py-0.5 bg-gray-800 rounded text-gray-400">x{item.quantity}</span>
                                                                <span className="text-xs text-green-500/80">
                                                                    {Number(item.unit_price).toLocaleString("vi-VN")}đ
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-bold text-gray-100">
                                                            {(Number(item.unit_price) * item.quantity).toLocaleString("vi-VN")}đ
                                                        </p>
                                                    </div>
                                                </div>
                                                {index !== order.purchase_order_items.length - 1 && (
                                                    <Separator className="bg-gray-800/30" />
                                                )}
                                            </React.Fragment>
                                        ))}

                                        {/* Footer đơn hàng */}
                                        <div className="mt-4 pt-4 border-t border-gray-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] text-gray-500 italic">Tổng thanh toán</span>
                                                <span className="text-xl font-bold text-[#e91e63]">
                                                    {Number(order.total_price).toLocaleString("vi-VN")}đ
                                                </span>
                                            </div>

                                            <div className="flex gap-3 w-full md:w-auto">
                                                <Button
                                                    onClick={() => cancelOrder(order)}
                                                    className="flex-1 md:flex-none bg-[#00c853] hover:bg-[#00a344] text-white font-bold transition-all text-xs h-9">
                                                    <RotateCcw className="w-3 h-3 mr-1" />
                                                    Hủy đơn hàng
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-[#141414] rounded-2xl border border-dashed border-gray-800">
                                <ShoppingBag className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                                <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
            {
                isConfirm && <DeleteOrderDialog onConfirm={onConfirmDelete} onOpenChange={setIsConfirm} open orderCode={selectedPurchaseOrder?.purchase_order_code?? ""} />
            }
        </div>
    );
}