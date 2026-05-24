import { useFetch } from '@/hooks/useFetch';
import { CartService } from '@/lib/cart-utils';
import { useNotificationStore } from '@/store/notification.store';
import { useNavigate, useParams } from '@tanstack/react-router';
import { BookOpen, Heart, Info, Loader2, Star } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`}>
        {children}
    </span>
);

const Button = ({ children, variant, className, ...props }: any) => {
    const baseStyle = "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2";
    const variants: any = {
        primary: "bg-[#00b98e] text-white hover:bg-[#00a37d]",
        secondary: "bg-white/10 text-white hover:bg-white/20",
        outline: "border border-white/20 text-white hover:bg-white/10",
        ghost: "text-white hover:bg-white/10 h-10 w-10 p-0"
    };
    return (
        <button className={`${baseStyle} ${variants[variant || 'primary']} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default function BookDetail() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const notification = useNotificationStore();
    const { id } = useParams({ from: "/user-book-detail/$id" });

    const { data, isLoading } = useFetch<any>({ // Sử dụng any hoặc cập nhật interface Book phù hợp với JSON mới
        url: `category-books/${id}`,
        key: ["book-detail", id],
    });

    const gotoReadBook = () => {
        navigate({
            to: "/read-book/" + id,
        });
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#00b98e] animate-spin" />
            </div>
        );
    }

    if (!data) return null;

    const handleAddToCart = () => {
        if (data?.stock_quantity === 0) {
            notification.updateState({ open: true, message: "Đã hết sách", type: "warning" })

            return
        }

        try {
            const productId = Number(id);
            CartService.addToCart(productId, 1);

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

    return (
        <div className="min-h-screen bg-[#121212] text-gray-300 font-sans p-6 md:p-12 selection:bg-[#00b98e]/30">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Bên trái: Ảnh bìa sách */}
                <div className="lg:col-span-3 flex justify-center lg:justify-start">
                    <div className="relative group rounded-lg overflow-hidden shadow-2xl border border-white/10 w-[240px] aspect-[3/4] bg-[#1a1a1a]">
                        <img
                            src={`http://127.0.0.1:3000${data.avatar_path}`}
                            alt={data.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-md rounded-tr-md flex items-center gap-1 shadow-md">
                            <span>HỘI VIÊN</span>
                            <span className="text-[8px]">👑</span>
                        </div>
                    </div>
                </div>

                {/* Ở giữa: Thông tin chi tiết sách */}
                <div className="lg:col-span-6 space-y-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                            {data.title}
                        </h1>

                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                                <span className="text-white font-semibold">5.0</span>
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill="currentColor" />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">• ISBN: {data.isbn}</span>
                            </div>
                        </div>

                        <div className="mt-3 flex gap-2">
                            <Badge className="bg-[#cc2944] text-white text-xs font-medium px-2.5 py-1 rounded-sm uppercase">
                                {data.categories?.name || 'Chưa phân loại'}
                            </Badge>
                            <Badge className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-medium px-2.5 py-1 rounded-sm">
                                Năm XB: {data.publish_year}
                            </Badge>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-4 text-sm">
                        <div>
                            <p className="text-gray-500 text-xs mb-1">Nhà xuất bản</p>
                            <p className="text-white font-medium hover:text-[#00b98e] cursor-pointer transition-colors">
                                {data.publishers?.name}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs mb-1">Số trang</p>
                            <p className="text-white font-medium">{data.pages} trang</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs mb-1">Ngôn ngữ</p>
                            <p className="text-white font-medium">{data.language}</p>
                        </div>
                    </div>

                    {/* Trạng thái kho & Giá */}
                    <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#00b98e]/10 rounded-lg">
                                <Info className="w-5 h-5 text-[#00b98e]" />
                            </div>
                            <div>
                                <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Giá bán lẻ</p>
                                <p className="text-xl font-bold text-white">
                                    {Number(data.price).toLocaleString("vi-VN")}đ
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Trạng thái</p>
                            <p className={`text-sm font-bold ${data.available_quantity > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {data.available_quantity > 0 ? "Còn hàng" : 'Hết hàng'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Button variant="primary" className="flex items-center gap-2 px-8 font-bold shadow-lg shadow-[#00b98e]/20" onClick={gotoReadBook}>
                            <BookOpen size={18} /> Đọc ngay
                        </Button>

                        <Button
                            onClick={handleAddToCart}
                            variant="outline" className="flex items-center gap-2 px-6 font-semibold border-white/10 cursor-pointer">
                            Thêm vào giỏ hàng
                        </Button>
                    </div>

                    {/* Phần mô tả */}
                    <div className="space-y-3">
                        <h3 className="text-white font-bold flex items-center gap-2">
                            <div className="w-1 h-4 bg-[#00b98e] rounded-full"></div>
                            Giới thiệu nội dung
                        </h3>
                        <div
                            className="text-sm text-gray-400 leading-relaxed pt-2 prose prose-invert max-w-none"
                            dangerouslySetInnerHTML={{ __html: data.content || data.description }}
                        />
                    </div>
                </div>

                {/* Bên phải: Banner Hội Viên */}
                <div className="lg:col-span-3 sticky top-6">
                    <div className="border border-orange-500/30 bg-gradient-to-b from-[#2a1b15] to-[#161412] p-6 rounded-2xl text-center relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Star size={80} />
                        </div>

                        <div className="inline-flex items-center gap-1 bg-amber-500 text-black text-[10px] font-bold px-3 py-0.5 rounded-full mb-4">
                            <span>👑 HỘI VIÊN PREMIUM</span>
                        </div>

                        <h3 className="text-orange-400 font-bold text-lg tracking-wide uppercase leading-tight mb-2">
                            Đặc quyền<br />Vô tận
                        </h3>

                        <p className="text-[11px] text-gray-400 mt-3 mb-6 px-2 leading-relaxed">
                            Mượn cuốn <span className="text-white">"{data.title}"</span> miễn phí và truy cập kho <span className="text-white font-semibold">20,000+</span> tài liệu lập trình khác.
                        </p>

                        <button className="w-full bg-[#00b98e] text-white text-sm font-bold py-3 px-4 rounded-xl hover:bg-[#00a37d] transition-all transform hover:-translate-y-0.5 active:scale-95">
                            Đăng ký ngay
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}