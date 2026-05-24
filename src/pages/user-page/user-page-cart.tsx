import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/image";
import { Separator } from "@/components/ui/separator";
import { useFetch } from "@/hooks/useFetch";
import { CartService } from "@/lib/cart-utils";
import { CartDataResponse } from "@/models/cart.model";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
    ArrowRight,
    ChevronLeft,
    CreditCard,
    Minus,
    Plus,
    TicketPercent,
    Trash2
} from "lucide-react";
import { useMutationRequest } from "@/hooks/useMutation";
import { useNotificationStore } from "@/store/notification.store";
import { useTranslation } from "react-i18next";
import { OrderSuccessPopup } from "./user-page-order-success";
import { useAccountStore } from "@/store/account.store";
import { OrderConfirmDialog } from "./user-page-order-confirm";

const CartPage = () => {
    const { id } = useParams({ from: "/cart/$id" });
    const navigate = useNavigate();
    const notification = useNotificationStore();
    const { t } = useTranslation();
    const user = useAccountStore();
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const [isConfirm, setIsConfirm] = useState<boolean>(false)

    /**
     * Reactive cart state
     */
    const [cookieItems, setCookieItems] = useState(
        CartService.getCart()
    );

    /**
     * Build query params
     */
    const searchParams = useMemo(() => {
        const params = new URLSearchParams();

        if (id) {
            params.append("user_id", id.toString());
        }

        if (cookieItems.length > 0) {
            const booksJson = JSON.stringify(
                cookieItems.map((i) => ({
                    book_id: i.id,
                    quantity: i.quantity
                }))
            );

            params.append("books", booksJson);
        }

        return params.toString();
    }, [cookieItems, id]);

    /**
     * Fetch cart details
     */
    const { data: cartData, isLoading } =
        useFetch<CartDataResponse>({
            url: `users-pages/cart/details?${searchParams}`,
            key: ["cart", searchParams],
            options: {
                enabled: true,
                refetchOnWindowFocus: false,
            }
        });

    /**
    * Create order
     */
    const { mutate } = useMutationRequest({
        key: ["create-purchase"],
        url: "purchase-orders",
        method: "post",

        options: {
            onSuccess: () => {
                notification.updateState({
                    message: t("updateSuccess"),
                    type: "success",
                    open: true
                })
                setIsConfirm(false)
                setIsSuccess(true)
                CartService.clearCart()
            },

            onError: () => {
                setIsConfirm(false)
                notification.updateState({
                    message: t("updateFail"),
                    type: "error",
                    open: true
                })
            }
        }
    })

    /**
     * Update quantity
     */
    const handleUpdateQty = (
        productId: number,
        currentQty: number,
        delta: number
    ) => {
        const newQty = currentQty + delta;

        if (newQty < 1) return;

        CartService.updateQty(productId, newQty);

        /**
         * Trigger rerender
         */
        setCookieItems(CartService.getCart());
    };

    /**
     * Remove item
     */
    const handleRemove = (productId: number) => {
        CartService.removeFromCart(productId);

        /**
         * Trigger rerender
         */
        setCookieItems(CartService.getCart());
    };

    /**
     * Loading state
     */
    if (isLoading && cartData) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-emerald-500 font-medium">
                Đang cập nhật giỏ hàng...
            </div>
        );
    }

    const cartItems = cartData?.items || [];

    const summary = cartData?.summary || {
        subtotal: 0,
        total_amount: 0,
        shipping_fee: 0
    };

    const gotoDashboard = () => {
        navigate({
            to: "/user-page",
        });
    }

    const gotoOrder = () => {
        navigate({
            to: "/user-page-order",
        });
    }

    const createOrder = () => {
        if (cartItems.length === 0) {
            notification.updateState({
                message: t("cartEmpty"),
                type: "warning",
                open: true
            })
            return
        }

        mutate({
            user_id: user?.user?.userId,
            books: cartItems.map(item => ({
                book_id: item.id,
                qty: item.quantity,
                price: item.price
            }))
        })
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-10 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        Giỏ hàng của bạn

                        <span className="text-gray-500 text-lg">
                            ({cartItems.length})
                        </span>
                    </h1>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            className="text-emerald-500 hover:text-emerald-400 p-0 flex gap-1"
                            onClick={gotoDashboard}
                        >
                            <ChevronLeft size={20} />
                            Tiếp tục mua sắm
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-emerald-500 hover:text-emerald-400 px-2 flex gap-1"
                            onClick={gotoOrder}
                        >
                            Đi đến đơn hàng
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT */}
                    <div className="lg:col-span-8 space-y-4">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-[#141414] border border-gray-800 rounded-2xl p-4 flex gap-4 items-center hover:border-gray-700 transition-all group"
                                >
                                    {/* IMAGE */}
                                    <div className="w-20 h-28 md:w-24 md:h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-900 border border-gray-800">
                                        <LazyImage
                                            className="w-full h-full object-cover rounded-md border border-white/10"
                                            src={`http://127.0.0.1:3000${item.avatar_path}`}
                                        />
                                    </div>

                                    {/* CONTENT */}
                                    <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        {/* INFO */}
                                        <div className="space-y-1">
                                            <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-emerald-400 transition-colors">
                                                {item.title}
                                            </h3>

                                            <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 w-fit px-2 py-0.5 rounded">
                                                Bản đẹp
                                            </p>

                                            <p className="text-pink-500 font-bold md:hidden">
                                                {item.total_price?.toLocaleString(
                                                    "vi-VN"
                                                )}
                                                đ
                                            </p>
                                        </div>

                                        {/* ACTIONS */}
                                        <div className="flex items-center justify-between md:justify-end gap-8">
                                            {/* QTY */}
                                            <div className="flex items-center border border-gray-700 rounded-full bg-[#1a1a1a] px-1 shadow-inner">
                                                <button
                                                    onClick={() =>
                                                        handleUpdateQty(
                                                            item.id,
                                                            item.quantity,
                                                            -1
                                                        )
                                                    }
                                                    className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30"
                                                    disabled={
                                                        item.quantity <= 1
                                                    }
                                                >
                                                    <Minus size={14} />
                                                </button>

                                                <span className="w-8 text-center text-sm font-bold">
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        handleUpdateQty(
                                                            item.id,
                                                            item.quantity,
                                                            1
                                                        )
                                                    }
                                                    className="p-1.5 text-gray-400 hover:text-white"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            {/* PRICE */}
                                            <div className="hidden md:block text-right min-w-[100px]">
                                                <p className="text-pink-500 font-bold text-lg">
                                                    {item.total_price?.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    đ
                                                </p>

                                                <p className="text-gray-500 text-[10px]">
                                                    {item.price?.toLocaleString(
                                                        "vi-VN"
                                                    )}
                                                    đ / cái
                                                </p>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleRemove(item.id)
                                                }
                                                className="text-gray-600 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-[#141414] rounded-2xl border border-dashed border-gray-800 text-gray-500 space-y-4">
                                <p>Giỏ hàng của bạn đang trống</p>

                                <Button className="bg-emerald-500 hover:bg-emerald-600 rounded-full">
                                    Khám phá sách ngay
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-[#141414] border border-gray-800 rounded-2xl p-6 sticky top-8 shadow-xl">
                            <h2 className="text-xl font-bold mb-6">
                                Tổng đơn hàng
                            </h2>

                            {/* COUPON */}
                            <div className="relative mb-6 group">
                                <TicketPercent
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors"
                                    size={18}
                                />

                                <input
                                    type="text"
                                    placeholder="Mã giảm giá"
                                    className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald-500 transition-all"
                                />
                            </div>

                            {/* SUMMARY */}
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Tạm tính</span>

                                    <span className="text-white font-medium">
                                        {summary.subtotal?.toLocaleString(
                                            "vi-VN"
                                        )}
                                        đ
                                    </span>
                                </div>

                                <div className="flex justify-between text-gray-400">
                                    <span>Phí vận chuyển</span>

                                    <span className="text-white font-medium">
                                        {summary.shipping_fee?.toLocaleString(
                                            "vi-VN"
                                        )}
                                        đ
                                    </span>
                                </div>

                                <Separator className="bg-gray-800" />

                                <div className="flex justify-between items-end pt-2">
                                    <span className="text-lg font-medium">
                                        Tổng tiền
                                    </span>

                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-pink-500">
                                            {summary.total_amount?.toLocaleString(
                                                "vi-VN"
                                            )}
                                            đ
                                        </p>

                                        <p className="text-gray-500 text-[10px] italic">
                                            (Đã bao gồm VAT)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CHECKOUT */}
                            <Button
                                onClick={() => setIsConfirm(true)}
                                className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-xl mt-8 flex gap-2 group transition-all">
                                <CreditCard size={20} />

                                Mua ngay

                                <ArrowRight
                                    size={18}
                                    className="group-hover:translate-x-1 transition-transform"
                                />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {
                isSuccess && <OrderSuccessPopup open onClose={() => setIsSuccess(false)} />
            }
            {
                isConfirm && <OrderConfirmDialog onConfirm={createOrder} onOpenChange={setIsConfirm} open totalAmount={summary.total_amount} totalItems={cartItems.length} />
            }
        </div>
    );
};

export default CartPage;