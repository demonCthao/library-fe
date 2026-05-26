import { Button } from '@/components/ui/button';
import { LazyImage } from '@/components/ui/image';
import { useFetch } from '@/hooks/useFetch';
import { Book } from '@/models/book.model';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, Eye, Filter, LayoutGrid, List, Loader2, Search, ShoppingCart, SortAsc, SortDesc } from 'lucide-react';
import { useMemo, useState } from 'react';

// Import các thành phần của Shadcn Carousel
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CategoryResponse {
    id: number;
    name: string;
    parent_id: number | null;
    books: Book[];
}

export default function CategoryDetail() {
    const navigate = useNavigate();
    const { id } = useParams({ from: "/user-page-category-detail/$id" });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'none'>('none');

    const baseUrl = "http://127.0.0.1:3000";

    const { data: categories, isLoading } = useFetch<CategoryResponse[]>({
        url: `category-books/books/${id}`,
        key: ["category-books", id],
    });

    const currentCategory = Array.isArray(categories)
        ? categories.find(cat => cat.id === Number(id))
        : categories;

    const categoryName = (currentCategory as any)?.name || "Danh mục sách";

    // Xử lý lọc và sắp xếp
    const filteredAndSortedBooks = useMemo(() => {
        let result = [...((currentCategory as any)?.books || [])];

        if (searchTerm) {
            result = result.filter(book =>
                book.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        switch (sortConfig) {
            case 'name-asc':
                result.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                result.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'price-asc':
                result.sort((a, b) => Number(a.price) - Number(b.price));
                break;
            case 'price-desc':
                result.sort((a, b) => Number(b.price) - Number(a.price));
                break;
            default:
                break;
        }

        return result;
    }, [currentCategory, searchTerm, sortConfig]);

    // Lấy tối đa 3 cuốn sách đầu tiên làm slide banner nổi bật
    const bannerBooks = useMemo(() => {
        return filteredAndSortedBooks.slice(0, 3);
    }, [filteredAndSortedBooks]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-[#00b98e] animate-spin" />
            </div>
        );
    }

    const backToMain = () => {
        navigate({ to: "/user-page" });
    };

    return (
        <div className="min-h-screen bg-[#121212] text-gray-300 p-4 md:p-10">
            <div className="max-w-7xl mx-auto space-y-10">
                <button
                    onClick={backToMain}
                    className="flex items-center text-sm text-gray-500 hover:text-[#00b98e] transition-colors mb-2 cursor-pointer"
                >
                    <ChevronLeft size={16} /> Quay lại
                </button>
                {bannerBooks.length > 0 && (
                    <div className="relative group w-full overflow-hidden rounded-3xl bg-[#161616] border border-white/5">
                        <Carousel opts={{ loop: true }} className="w-full">
                            <CarouselContent>
                                {bannerBooks.map((book) => {
                                    const bannerPrice = Number(book.price) === 0
                                        ? "Miễn phí"
                                        : `${Number(book.price).toLocaleString()}đ`;

                                    return (
                                        <CarouselItem key={book.id}>
                                            <div className="relative w-full min-h-[350px] md:h-[400px] flex flex-col md:flex-row items-center justify-between p-6 md:p-12 gap-8 overflow-hidden">
                                                <div
                                                    className="absolute inset-0 bg-cover bg-center opacity-[0.03] blur-2xl pointer-events-none scale-110"
                                                    style={{ backgroundImage: `url(${baseUrl + book.avatar_path})` }}
                                                />

                                                {/* Bên trái: Thông tin chữ */}
                                                <div className="z-10 flex-1 space-y-4 text-center md:text-left">
                                                    <div className="flex items-center gap-2 group">
                                                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all duration-300">
                                                            <span className="text-xl font-black">B</span>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-lg font-bold text-white tracking-tight leading-none">
                                                                BOOK<span className="text-emerald-500">LIB</span>
                                                            </span>
                                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                                                                Management
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight line-clamp-2">
                                                        {book.title}
                                                    </h2>
                                                    <p className="text-sm text-gray-400 line-clamp-3 max-w-xl leading-relaxed">
                                                        {book.description && book.description !== "Novel" && book.description !== "Tiểu thuyết"
                                                            ? book.description
                                                            : book.content?.split("[co-chapter-split]")[0]?.replace(/Chương \d+: [^\n]*/, '').trim()}
                                                    </p>

                                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                                                        <Button
                                                            onClick={() => navigate({ to: `/user-book-detail/${book.id}` })}
                                                            className="bg-[#00b98e] hover:bg-[#00a37d] text-white font-semibold px-6 py-5 rounded-xl flex items-center gap-2 shadow-lg shadow-[#00b98e]/20 transition-all"
                                                        >
                                                            <Eye size={18} /> Đọc truyện
                                                        </Button>
                                                        <span className="text-xl font-bold text-orange-400">{bannerPrice}</span>
                                                    </div>
                                                </div>

                                                {/* Bên phải: Ảnh bìa sách đứng nổi bật */}
                                                <div className="z-10 relative w-44 md:w-56 aspect-[3/4] shrink-0 transform md:rotate-2 hover:rotate-0 transition-transform duration-500">
                                                    <div className="absolute inset-0 bg-black/40 rounded-2xl blur-lg transform translate-y-4 scale-95" />
                                                    <img
                                                        src={baseUrl + book.avatar_path}
                                                        alt={book.title}
                                                        className="w-full h-full object-cover rounded-2xl border border-white/10 shadow-2xl relative z-10"
                                                    />
                                                </div>

                                            </div>
                                        </CarouselItem>
                                    );
                                })}
                            </CarouselContent>

                            {/* Nút Previous custom */}
                            <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-20 size-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 hover:bg-[#00b98e] text-white border-none rounded-full cursor-pointer disabled:opacity-0" >
                                <ChevronLeft className="size-6" />
                            </CarouselPrevious>

                            {/* Nút Next custom */}
                            <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-20 size-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/10 hover:bg-[#00b98e] text-white border-none rounded-full cursor-pointer disabled:opacity-0" >
                                <ChevronRight className="size-6" />
                            </CarouselNext>
                        </Carousel>
                    </div>
                )}

                {/* ================= CONTROLS & BOOK LIST ================= */}
                <div className="space-y-6">
                    {/* Header & Bộ lọc */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div className="space-y-1">

                            <h1 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-[#00b98e] rounded-full"></span>
                                {categoryName}
                                <span className="text-sm font-normal text-gray-500">({filteredAndSortedBooks.length} cuốn)</span>
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            {/* Ô tìm kiếm nhanh */}
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#00b98e]" />
                                <input
                                    type="text"
                                    placeholder="Tìm trong mục này..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-[#1a1a1a] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#00b98e]/50 w-full md:w-64 transition-all"
                                />
                            </div>

                            {/* Dropdown Sắp xếp */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 px-4 py-2 text-sm bg-[#1a1a1a] border border-white/5 rounded-xl hover:text-white hover:border-[#00b98e]/50 transition-all">
                                        <Filter size={16} className={sortConfig !== 'none' ? 'text-[#00b98e]' : ''} />
                                        Sắp xếp
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-[#1a1a1a] border-white/10 text-gray-300 w-48à">
                                    <DropdownMenuLabel className="text-gray-500">Theo tên</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => setSortConfig('name-asc')} className="cursor-pointer hover:bg-white/5">
                                        <SortAsc className="mr-2 w-4 h-4" /> A - Z
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortConfig('name-desc')} className="cursor-pointer hover:bg-white/5">
                                        <SortDesc className="mr-2 w-4 h-4" /> Z - A
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/5" />
                                    <DropdownMenuLabel className="text-gray-500">Theo giá</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => setSortConfig('price-asc')} className="cursor-pointer hover:bg-white/5">
                                        Giá thấp đến cao
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortConfig('price-desc')} className="cursor-pointer hover:bg-white/5">
                                        Giá cao đến thấp
                                    </DropdownMenuItem>
                                    {sortConfig !== 'none' && (
                                        <>
                                            <DropdownMenuSeparator className="bg-white/5" />
                                            <DropdownMenuItem onClick={() => setSortConfig('none')} className="text-red-400 cursor-pointer">
                                                Xóa bộ lọc
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* View Mode Grid/List */}
                            <div className="flex items-center gap-1 bg-[#1a1a1a] p-1 rounded-xl border border-white/5">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-[#00b98e] text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <LayoutGrid size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-[#00b98e] text-white' : 'text-gray-500 hover:text-white'}`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Hiển thị danh sách truyện bên dưới */}
                    {filteredAndSortedBooks.length > 0 ? (
                        <div className={
                            viewMode === 'grid'
                                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
                                : "flex flex-col gap-4"
                        }>
                            {filteredAndSortedBooks.map((book) => (
                                <BookCard key={book.id} book={book} mode={viewMode} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center bg-[#1a1a1a] rounded-3xl border border-dashed border-white/10">
                            <p className="text-gray-500">Không tìm thấy sách nào phù hợp với yêu cầu.</p>
                            {searchTerm && (
                                <Button variant="link" onClick={() => setSearchTerm('')} className="text-[#00b98e]">
                                    Xóa tìm kiếm
                                </Button>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

// Giữ nguyên logic BookCardProps và BookCard của bạn...
interface BookCardProps {
    book: Book;
    mode: 'grid' | 'list';
}

const BookCard = ({ book, mode }: BookCardProps) => {
    const navigate = useNavigate();
    const baseUrl = "http://127.0.0.1:3000";

    const handleNavigate = () => {
        navigate({ to: `/user-book-detail/${book.id}` });
    };

    const displayPrice = Number(book.price) === 0
        ? "Miễn phí"
        : `${Number(book.price).toLocaleString()}đ`;

    if (mode === 'list') {
        return (
            <div
                onClick={handleNavigate}
                className="group flex gap-5 p-4 bg-[#1a1a1a] border border-white/5 rounded-2xl hover:border-[#00b98e]/30 hover:bg-[#00b98e]/[0.02] transition-all cursor-pointer items-center"
            >
                <div className="relative w-24 md:w-32 aspect-[3/4] overflow-hidden rounded-lg shadow-lg">
                    <LazyImage
                        src={baseUrl + book.avatar_path}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        alt={book.title}
                    />
                </div>

                <div className="flex-1 flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                        <h3 className="text-white text-lg font-bold group-hover:text-[#00b98e] transition-colors line-clamp-1">
                            {book.title}
                        </h3>
                        <span className="text-[#00b98e] font-bold text-lg">{displayPrice}</span>
                    </div>

                    <p className="text-sm text-gray-400">Ngôn ngữ: {book.language || "Tiếng Việt"}</p>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1 italic">
                        Sách hay nên đọc để mở mang kiến thức về lĩnh vực {book.category_id}...
                    </p>

                    <div className="flex gap-3 mt-3">
                        <Button size="sm" className="bg-[#00b98e] hover:bg-[#00a37d] h-8 text-xs">
                            <Eye size={14} className="mr-1" /> Xem chi tiết
                        </Button>
                        <Button size="sm" variant="outline" className="border-white/10 h-8 text-xs hover:bg-white/5">
                            <ShoppingCart size={14} className="mr-1" /> Thêm vào giỏ
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div onClick={handleNavigate} className="group cursor-pointer w-full">
            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 mb-3 shadow-md group-hover:shadow-[#00b98e]/20 group-hover:border-[#00b98e]/50 transition-all duration-300">
                <img
                    src={baseUrl + book.avatar_path}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-xl uppercase shadow-lg">
                    Hội viên
                </div>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-2 p-4">
                    <Button className="w-full bg-[#00b98e] hover:bg-[#00a37d] shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        Chi tiết
                    </Button>
                    <button className="text-white/70 hover:text-white text-xs flex items-center gap-1 mt-2">
                        <ShoppingCart size={14} /> + Giỏ hàng
                    </button>
                </div>
            </div>

            <div className="px-1">
                <h3 className="text-sm font-bold text-gray-200 line-clamp-2 group-hover:text-[#00b98e] transition-colors leading-snug min-h-[40px]">
                    {book.title}
                </h3>

                <div className="flex items-center justify-between mt-2">
                    <span className="text-[12px] font-bold text-[#00b98e]">
                        {displayPrice}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase font-medium">
                        {book.publish_year}
                    </span>
                </div>
            </div>
        </div>
    );
};