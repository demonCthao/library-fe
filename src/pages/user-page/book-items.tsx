import { LazyImage } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { BookOpen, Heart, ShoppingCart } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Book } from "@/models/book.model";
import { useState } from "react";

interface BookItemProps {
    book: Book;
    onClick: () => void;
    onClickCart: () => void
}

export const BookItem = ({ book, onClick, onClickCart }: BookItemProps) => {
    const imageUrl = `http://127.0.0.1:3000${book.avatar_path}`;
    const [isLove, setIsLove] = useState(false)

    return (
        <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
                <div
                    className="cursor-pointer group w-[250px]"
                    onClick={onClick}
                >
                    <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:ring-2 group-hover:ring-emerald-500">
                        <LazyImage
                            className="w-full h-[380px] object-cover transition-transform duration-500 group-hover:scale-105"
                            src={imageUrl}
                        />
                        {/* Tag Hội viên nếu cần (giả định logic) */}
                        <span className="absolute top-2 right-2 bg-orange-500 text-[10px] text-white px-2 py-0.5 rounded shadow-md">
                            HỘI VIÊN
                        </span>
                    </div>
                    <div className="mt-3 font-medium text-gray-200 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                        {book.title}
                    </div>
                </div>
            </HoverCardTrigger>

            <HoverCardContent
                side="right"
                align="start"
                sideOffset={15}
                className="w-[480px] bg-[#1e1e20] border-none text-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 rounded-xl"
            >
                <div className="flex flex-col gap-5">
                    {/* PHẦN TRÊN: THÔNG TIN SÁCH */}
                    <div className="flex gap-5">
                        {/* Ảnh bìa cố định kích thước */}
                        <div className="w-[140px] h-[200px] shrink-0 shadow-2xl">
                            <LazyImage
                                className="w-full h-full object-cover rounded-md border border-white/10"
                                src={imageUrl}
                            />
                        </div>

                        {/* Nội dung bên phải */}
                        <div className="flex flex-col flex-1 min-w-0">
                            <h3 className="text-2xl font-bold leading-tight line-clamp-2 mb-2">
                                {book.title}
                            </h3>

                            <p className="text-sm text-gray-400 font-medium mb-3">
                                Tác giả: <span className="text-emerald-400">{"Nhiều tác giả"}</span>
                            </p>

                            <div className="space-y-1">
                                <h4 className="text-[10px] uppercase text-zinc-500 font-bold tracking-widest">Giới thiệu</h4>
                                <p className="text-sm text-zinc-400 line-clamp-4 leading-relaxed italic">
                                    {book.description || "Nội dung đang được cập nhật..."}
                                </p>
                            </div>

                            <div className="mt-auto pt-3 text-orange-400 font-bold text-2xl">
                                {book.price
                                    ? `${Number(book.price).toLocaleString("vi-VN")}đ`
                                    : "Miễn phí"}
                            </div>
                        </div>
                    </div>

                    {/* PHẦN DƯỚI: NÚT BẤM HÀNH ĐỘNG */}
                    <div className="flex items-center gap-3 pt-2">
                        {/* Nút Đọc ngay - Màu xanh Emerald */}
                        <Button
                            onClick={(e) => { e.stopPropagation(); onClick(); }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex-[2] gap-2 h-12 text-base font-bold shadow-lg shadow-emerald-500/20"
                        >
                            <BookOpen size={20} /> Đọc ngay
                        </Button>

                        {/* Nút Mua sách - Màu Cam */}
                        <Button
                            onClick={(e) => { e.stopPropagation(); onClickCart(); }}
                            className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg flex-[2] gap-2 h-12 text-base font-bold shadow-lg shadow-orange-500/20"
                        >
                            <ShoppingCart size={20} /> Mua sách
                        </Button>
                        <button
                            onClick={() => { setIsLove(!isLove) }}
                            className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border border-white/10
                                ${isLove
                                    ? "bg-red-500 text-white border-none shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                                    : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white"
                                }`}
                        >
                            <Heart
                                size={20}
                                className={`transition-transform duration-300 ${isLove ? "fill-white scale-110" : "scale-100"}`}
                            />
                        </button>
                    </div>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};