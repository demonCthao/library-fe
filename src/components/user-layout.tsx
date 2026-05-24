import { Search, ShoppingCart, Phone, Mail, MapPin, X, Loader2 } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button";
import { useNavigate } from '@tanstack/react-router';
import { useFetch } from '@/hooks/useFetch';
import { Category } from '@/models/category.model';
import { Book } from '@/models/book.model'; // Đảm bảo bạn có model này
import Loading from './loading';
import { useAccountStore } from '@/store/account.store';
import _ from 'lodash';
import AvatarDropdownMenu from './avatar-dropdown';
import { LazyImage } from './ui/image';
import { RegisterModal } from '@/pages/user-page/user-page-register';
import { CartService } from '@/lib/cart-utils';
import { useDebounce } from '@/hooks/useDebounce';

interface ILayoutProps {
    children: React.ReactNode
}

// COMPONENT SEARCH MỚI
const SearchMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const searchRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const baseUrl = "http://127.0.0.1:3000";
    const bookDebounce = useDebounce(keyword)

    // Xử lý đóng khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // API tìm kiếm (chỉ chạy khi có keyword)
    const { data: results, isLoading } = useFetch<Book[]>({
        url: keyword.length > 1 ? `books/keyword?keyword=${bookDebounce}` : '',
        key: ["search-dropdown", keyword],
    });

    return (
        <div className="relative" ref={searchRef}>
            <div className="flex items-center gap-2">
                {!isOpen ? (
                    <button
                        onClick={() => setIsOpen(true)}
                        className="hover:text-emerald-400 transition text-gray-300 cursor-pointer p-2"
                    >
                        <Search className="h-5 w-5" />
                    </button>
                ) : (
                    <div className="flex items-center bg-zinc-900 border border-emerald-500/50 rounded-full px-3 py-1.5 animate-in fade-in zoom-in duration-200">
                        <Search className="h-4 w-4 text-emerald-500" />
                        <input
                            autoFocus
                            type="text"
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            placeholder="Tìm tên sách..."
                            className="bg-transparent border-none outline-none text-sm text-white px-2 w-40 md:w-64"
                        />
                        <button onClick={() => { setIsOpen(false); setKeyword(''); }}>
                            <X className="h-4 w-4 text-gray-500 hover:text-white" />
                        </button>
                    </div>
                )}
            </div>

            {/* DROPDOWN KẾT QUẢ */}
            {isOpen && keyword.length > 1 && (
                <div className="absolute top-full right-0 mt-3 w-[320px] md:w-[450px] bg-[#1a1a1c] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[60]">
                    <div className="p-3 border-b border-white/5 flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-emerald-500 tracking-wider">Kết quả tìm kiếm</span>
                        {isLoading && <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />}
                    </div>

                    <div className="max-h-[350px] overflow-y-auto">
                        {results && results.length > 0 ? (
                            results.map((book) => (
                                <div
                                    key={book.id}
                                    onClick={() => {
                                        navigate({ to: `/user-book-detail/${book.id}` });
                                        setIsOpen(false);
                                    }}
                                    className="flex gap-3 p-3 hover:bg-emerald-500/5 cursor-pointer transition-colors group border-b border-white/5 last:border-none"
                                >
                                    <img
                                        src={baseUrl + book.avatar_path}
                                        className="w-10 h-14 object-cover rounded shadow-sm"
                                        alt=""
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-gray-200 group-hover:text-emerald-400 truncate">
                                            {book.title}
                                        </h4>
                                        <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">Năm XB: {book.publish_year}</p>
                                        <p className="text-xs text-emerald-500 font-bold mt-1">
                                            {Number(book.price) === 0 ? "Miễn phí" : `${Number(book.price).toLocaleString()}đ`}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : !isLoading && (
                            <div className="p-8 text-center text-sm text-gray-500">
                                Không tìm thấy sách phù hợp
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default function UserLayout({ children }: ILayoutProps) {
    const navigate = useNavigate();
    const account = useAccountStore();
    const [isRegister, setIsRegister] = useState<boolean>(false)

    const cookieItems = CartService.getCart();

    const { data, isLoading } = useFetch<Category[]>({
        url: "category-books",
        key: ["category-books"],
    });

    const gotoLogin = () => navigate({ to: "/login" });
    const gotoHome = () => navigate({ to: "/user-page" });
    const gotoCart = () => {
        const targetId = account?.user?.userId || "guest";
        navigate({ to: `/cart/${targetId}` });
    }

    const onOpenRegister = (value: boolean) => setIsRegister(value)

    if (isLoading) return <Loading />

    return (
        <div className="min-h-screen bg-[#121214] text-white">
            <div className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/10">
                <header className="w-full">
                    <div className="mx-auto flex h-16 items-center justify-between px-6">
                        {/* LEFT */}
                        <div className="flex items-center gap-10">
                            <div className="text-4xl cursor-pointer font-white text-emerald-400" onClick={gotoHome}>
                                <LazyImage className="h-[40px] w-auto" src="../../src/assets/images/image.png" />
                            </div>

                            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
                                {data?.map((item: Category) => (
                                    <a
                                        key={item.id}
                                        href={"/user-page-category-detail/" + item.id}
                                        className="transition hover:text-emerald-400 whitespace-nowrap text-gray-300"

                                    >
                                        {item?.name}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {/* RIGHT */}
                        <div className="flex items-center gap-4">
                            {/* THAY THẾ NÚT SEARCH CŨ BẰNG SEARCHMENU */}
                            <SearchMenu />

                            {!_.isNull(account?.user) && (
                                <button
                                    className="hover:text-emerald-400 transition text-gray-300 cursor-pointer relative p-2"
                                    onClick={gotoCart}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {cookieItems.length > 0 && (
                                        <span className="absolute top-2 right-1 translate-x-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#0a0a0a]">
                                            {cookieItems.length > 99 ? "99+" : cookieItems.length}
                                        </span>
                                    )}
                                </button>
                            )}

                            {_.isNull(account?.user) ? (
                                <>
                                    <Button
                                        variant="secondary"
                                        className="rounded-full bg-zinc-800 hover:bg-zinc-700 text-white border-none"
                                        onClick={() => setIsRegister(true)}
                                    >
                                        Đăng ký
                                    </Button>

                                    <Button
                                        className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white px-6"
                                        onClick={gotoLogin}
                                    >
                                        Đăng nhập
                                    </Button>
                                </>
                            ) : (
                                <AvatarDropdownMenu />
                            )}
                        </div>
                    </div>
                </header>
            </div>

            <main>{children}</main>

            <footer className="bg-[#0a0a0a] text-[#a0a0a0] pt-16 pb-8 px-4 md:px-12 font-sans border-t border-gray-900">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">

                    {/* Cột 1: Thông tin liên hệ & QR */}
                    <div className="lg:col-span-1">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-[#00c853] tracking-tighter">
                                BOOKSTORE
                            </h2>
                            <p className="text-xs mt-1 text-gray-500">Hệ thống phân phối sách trực tuyến</p>
                        </div>

                        <div className="space-y-3 text-sm mb-6">
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-gray-500" />
                                <span>098434343</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-gray-500" />
                                <span>Support@bookstore.vn</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-white p-1 rounded-sm w-28 h-28">
                                {/* Thay QR thực tế của bạn ở đây */}
                                <img
                                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Bookstore"
                                    alt="QR Code"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <a href="#" className="hover:opacity-80 transition-opacity">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-9 w-auto" />
                                </a>
                                <a href="#" className="hover:opacity-80 transition-opacity">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-9 w-auto" />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Cột 2: Về chúng tôi */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Về chúng tôi</h3>
                        <ul className="space-y-2 text-sm">
                            {["Giới thiệu", "Cơ cấu tổ chức", "Lĩnh vực hoạt động", "Cơ hội đầu tư", "Tuyển dụng", "Liên hệ"].map((item) => (
                                <li key={item} className="hover:text-[#00c853] cursor-pointer transition-colors">{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Cột 3: Thông tin hữu ích */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Thông tin hữu ích</h3>
                        <ul className="space-y-2 text-sm">
                            {["Thỏa thuận sử dụng dịch vụ", "Quyền lợi", "Quy định riêng tư", "Câu hỏi thường gặp", "Tiếp nhận đánh giá"].map((item) => (
                                <li key={item} className="hover:text-[#00c853] cursor-pointer transition-colors">{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Cột 4: Hỗ trợ khách hàng */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Hỗ trợ khách hàng</h3>
                        <ul className="space-y-2 text-sm">
                            {["Chính sách đổi trả", "Chính sách thanh toán", "Giải quyết khiếu nại", "Điều khoản hàng hóa cấm", "Bảo mật thông tin"].map((item) => (
                                <li key={item} className="hover:text-[#00c853] cursor-pointer transition-colors">{item}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Cột 5: Tin tức */}
                    <div>
                        <h3 className="text-white font-bold mb-4">Tin tức</h3>
                        <ul className="space-y-2 text-sm">
                            {["Tin dịch vụ", "Review sách", "Lịch phát hành"].map((item) => (
                                <li key={item} className="hover:text-[#00c853] cursor-pointer transition-colors">{item}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <Separator className="bg-gray-900 my-8" />

                {/* Phần thông tin bản quyền & Địa chỉ */}
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-6 text-[11px] leading-relaxed text-gray-500">
                    <div className="space-y-1 md:max-w-2xl">
                        <p className="flex items-start gap-2">
                            <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            Địa chỉ: Tổ 9 Phú Lương, Thành phố Hà Nội, Việt Nam.
                        </p>
                        <p>Người đại diện: Nguyễn Văn A - Số điện thoại: 098434343 - Email: Support@bookstore.vn</p>
                        <p>© 2026 Bản quyền thuộc về Bookstore Team.</p>
                    </div>
                </div>
            </footer>
            {isRegister && (
                <RegisterModal onOpenChange={onOpenRegister} open={isRegister} />
            )}
        </div>
    )
}

const Separator = ({ className }: { className?: string }) => (
    <div className={`h-[1px] w-full ${className}`} />
);