import { Button } from "@/components/ui/button";
import { LazyImage } from "@/components/ui/image";
import { useFetch } from "@/hooks/useFetch";
import { CartService } from "@/lib/cart-utils";
import { Book } from "@/models/book.model";
import { useAccountStore } from "@/store/account.store";
import { useNotificationStore } from "@/store/notification.store";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
    ChevronRight,
    Minus,
    Plus,
    ShoppingCart
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ProductDetail = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const notification = useNotificationStore();
    const user = useAccountStore((state) => state.user);
    const { id } = useParams({ from: "/user-page-book/$id" });
    const [quantity, setQuantity] = useState(1);
    const [selectedEdition, setSelectedEdition] = useState(4);

    const { data } = useFetch<Book>({
        url: `category-books/${id}`,
        key: ["book-detail", id],
    });

    const editions = [
        { id: 1, label: "Bản thường", price: "139.000đ" },
    ];

    const handleAddToCart = () => {
        if (data?.stock_quantity === 0) {
            notification.updateState({ open: true, message: "Đã hết sách", type: "warning" })

            return
        }

        try {
            const productId = Number(id);
            CartService.addToCart(productId, quantity);

            notification.updateState({
                message: t("Thêm vào giỏ hàng thành công!"),
                type: "success",
                open: true
            });
        } catch (error) {
            notification.updateState({
                message: t("updateFail"),
                type: "error",
                open: true
            });
        }
    };

    const buyNow = () => {
        if (data?.stock_quantity === 0) {
            notification.updateState({ open: true, message: "Đã hết sách", type: "warning" })

            return
        }

        const productId = Number(id);
        CartService.addToCart(productId, quantity);

        const targetId = user?.userId || "guest";
        navigate({
            to: `/cart/${targetId}`,
        });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                <span>Trang chủ</span> <ChevronRight size={14} />
                <span>Nhà sách</span> <ChevronRight size={14} />
                <span className="text-gray-200">{data?.title}</span>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">

                {/* LEFT COLUMN: IMAGES */}
                <div className="md:col-span-4 space-y-4">
                    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#1a1a1a] border border-gray-800">
                        <LazyImage src={`http://127.0.0.1:3000${data?.avatar_path}`} className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="md:col-span-8 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{data?.title}</h1>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-gray-800">
                        <div>
                            <p className="text-gray-500 text-xs uppercase mb-1">Danh mục</p>
                            <p className="text-emerald-500 font-medium text-sm">{data?.categories.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase mb-1">Nhà xuất bản</p>
                            <p className="font-medium text-sm">{data?.publishers.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase mb-1">Năm phát hành</p>
                            <p className="font-medium text-sm">{data?.publish_year}</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs uppercase mb-1">Nhà phát hành</p>
                            <p className="font-medium text-sm">Book store</p>
                        </div>
                    </div>

                    {/* Selection Sections */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 w-24 text-sm">Chọn loại sách</span>
                            <Button variant="outline" className="bg-[#1a1a1a] border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-500/10">
                                Sách giấy
                            </Button>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 w-24 text-sm">Giá bán</span>
                            <div className="flex items-center gap-3">
                                <span className="text-pink-500 text-3xl font-bold">{`${Number(data?.price).toLocaleString("vi-VN")}đ`}</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <span className="text-gray-400 w-24 text-sm pt-2">Phiên bản</span>
                            <div className="flex flex-wrap gap-2 flex-1">
                                {editions.map((ed) => (
                                    <button
                                        key={ed.id}
                                        onClick={() => setSelectedEdition(ed.id)}
                                        className={`flex justify-between items-center px-4 py-3 rounded-lg border w-[calc(50%-4px)] md:w-[220px] transition-all ${selectedEdition === ed.id
                                            ? "border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500"
                                            : "border-gray-800 bg-[#1a1a1a] hover:border-gray-600"
                                            }`}
                                    >
                                        <span className={`text-xs ${selectedEdition === ed.id ? "text-emerald-500" : "text-gray-300"}`}>
                                            {ed.label}
                                        </span>
                                        <span className={`text-xs font-bold ${selectedEdition === ed.id ? "text-emerald-500" : "text-white"}`}>
                                            {

                                            }
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 w-24 text-sm">Số lượng</span>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-gray-700 rounded-lg bg-[#1a1a1a]">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 text-gray-400 hover:text-white"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="px-4 py-1 border-x border-gray-700 min-w-[48px] text-center">{quantity.toString().padStart(2, "0")}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-2 text-gray-400 hover:text-white"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <span className="text-gray-500 text-sm">Còn lại {data?.stock_quantity} sản phẩm</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Button onClick={buyNow} className="flex-1 h-14 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg rounded-full">
                            Mua ngay
                        </Button>
                        <Button onClick={handleAddToCart} variant="outline" className="flex-1 h-14 bg-[#1a1a1a] border-gray-700 hover:bg-gray-800 text-white font-bold rounded-full gap-2">
                            <ShoppingCart size={20} />
                            Thêm vào giỏ hàng
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;