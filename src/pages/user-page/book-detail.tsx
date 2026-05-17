import { useNavigate, useParams } from '@tanstack/react-router';
import { BookOpen, Heart, Star } from 'lucide-react';
import React from 'react';

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
    const { id } = useParams({ from: "/user-book-detail/$id" });

    const gotoReadBook = () => {
        navigate({
            to: "/read-book/" + id,
            replace: true
        });
    }

    return (
        <div className="min-h-screen bg-[#121212] text-gray-300 font-sans p-6 md:p-12 selection:bg-[#00b98e]/30">

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Bên trái: Ảnh bìa sách */}
                <div className="lg:col-span-3 flex justify-center lg:justify-start">
                    <div className="relative group rounded-lg overflow-hidden shadow-2xl border border-white/10 w-[240px] aspect-[3/4] bg-[#1a1a1a]">
                        <img
                            src="https://waka.vn/images/dac-biet/nem-vi-stress-hoc-cach-truong-thanh.jpg" // Thay bằng link ảnh thật hoặc asset của bạn
                            alt="Nếm vị stress - Học cách trưởng thành"
                            className="w-full h-full object-cover"
                        />
                        {/* Nhãn Hội Viên góc trên cùng */}
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
                            Nếm vị "stress" - Học cách trưởng thành
                        </h1>

                        {/* Đánh giá & Thứ hạng */}
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                                <span className="text-white font-semibold">5.0</span>
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill="currentColor" />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">• 1 đánh giá</span>
                            </div>
                        </div>

                        {/* Thẻ Xu hướng (Badge) */}
                        <div className="mt-3">
                            <Badge className="bg-[#cc2944] text-white text-xs font-medium px-2.5 py-1 rounded-sm">
                                #51 trong Top xu hướng Sách nói
                            </Badge>
                        </div>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-3 gap-4 border-y border-white/5 py-4 text-sm">
                        <div>
                            <p className="text-gray-500 text-xs mb-1">Tác giả</p>
                            <p className="text-white font-medium hover:text-[#00b98e] cursor-pointer">Hoàng Anh Thư</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs mb-1">Thể loại</p>
                            <p className="text-white font-medium hover:text-[#00b98e] cursor-pointer">Phát triển cá nhân</p>
                        </div>
                        <div>
                            <p className="text-gray-500 text-xs mb-1">Gói cước</p>
                            <p className="text-white font-medium">Hội viên</p>
                        </div>
                    </div>

                    {/* Bộ lọc tùy chọn đọc/nghe (Filter Controls) */}
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-500 w-24">Chọn loại sách</span>
                            <div className="flex gap-2">
                                <button className="bg-white/5 border border-white/10 text-white px-4 py-1.5 rounded text-xs hover:bg-white/10">Sách điện tử</button>
                                <button className="bg-white/10 border border-[#00b98e]/50 text-white px-4 py-1.5 rounded text-xs">Sách nói</button>
                                <button className="text-gray-600 px-4 py-1.5 rounded text-xs cursor-not-allowed" disabled>Sách giấy</button>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-gray-500 w-24">Chọn nội dung</span>
                            <div className="flex gap-2">
                                <button className="bg-white/10 text-white px-4 py-1.5 rounded text-xs">Đầy đủ</button>
                                <button className="bg-white/5 text-gray-400 px-4 py-1.5 rounded text-xs hover:bg-white/10">Tóm tắt</button>
                            </div>
                        </div>
                    </div>

                    {/* Nhóm nút Action chính */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Button variant="secondary" className="flex items-center gap-2 px-6 font-semibold border border-white/10" onClick={gotoReadBook}>
                            <BookOpen size={16} /> Đọc sách
                        </Button>

                        <Button variant="ghost" className="border border-white/10 rounded-full flex items-center justify-center">
                            <Heart size={18} />
                        </Button>
                    </div>

                    {/* Phần mô tả ngắn */}
                    <div className="text-sm text-gray-400 leading-relaxed pt-2">
                        <p>
                            Giới thiệu cuốn sách <span className="text-white font-medium">Nếm vị "stress" - Học cách trưởng thành</span>: Cuốn sách "Nếm Vị Stress - Học Cách Trưởng Thành" không phải là một giáo trình khô khan giúp bạn "tiêu diệt" căng thẳng. Thay vào đó, tác phẩm mới gợi bạn bước vào một "căn bếp tâm hồn", nơi stress được nhìn nhận như muối, đường... <span className="text-[#00b98e] hover:underline cursor-pointer">Xem thêm</span>
                        </p>
                    </div>
                </div>

                {/* Bên phải: Banner Khuyến mãi / Đăng ký Hội Viên */}
                <div className="lg:col-span-3">
                    <div className="border border-orange-500/30 bg-gradient-to-b from-[#2a1b15] to-[#161412] p-5 rounded-2xl text-center relative overflow-hidden shadow-xl">
                        {/* Nhãn nhỏ phía trên */}
                        <div className="inline-flex items-center gap-1 bg-amber-500 text-black text-[10px] font-bold px-3 py-0.5 rounded-full mb-4">
                            <span>👑 HỘI VIÊN</span>
                        </div>

                        <h3 className="text-orange-400 font-bold text-base tracking-wide uppercase leading-tight">
                            Đọc & Nghe Sách<br />Không Giới Hạn
                        </h3>

                        <p className="text-xs text-gray-400 mt-3 mb-6 px-2 leading-normal">
                            Sách này và <span className="text-white font-semibold">20,000+</span> sách điện tử, sách nói, truyện tranh...
                        </p>

                        <button className="w-full bg-[#1e1e1e] border border-white/10 text-gray-200 text-sm font-semibold py-2.5 px-4 rounded-full hover:bg-white/5 transition-colors">
                            Trở thành hội viên
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}