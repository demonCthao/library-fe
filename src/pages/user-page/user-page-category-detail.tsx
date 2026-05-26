import { Button } from '@/components/ui/button';
import { LazyImage } from '@/components/ui/image';
import { useFetch } from '@/hooks/useFetch';
import { Book } from '@/models/book.model';
import { useNavigate, useParams } from '@tanstack/react-router';

import {
    ChevronLeft,
    ChevronRight,
    Eye,
    Filter,
    LayoutGrid,
    List,
    Loader2,
    Search,
    ShoppingCart,
    SortAsc,
    SortDesc
} from 'lucide-react';

import { useMemo, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';

import {
    EffectCoverflow,
    Autoplay,
    Navigation
} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

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

    const { id } = useParams({
        from: "/user-page-category-detail/$id"
    });

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const [searchTerm, setSearchTerm] = useState('');

    const [sortConfig, setSortConfig] = useState<
        'name-asc'
        | 'name-desc'
        | 'price-asc'
        | 'price-desc'
        | 'none'
    >('none');

    const [activeIndex, setActiveIndex] = useState(0);

    const baseUrl = "http://127.0.0.1:3000";

    const { data: categories, isLoading } = useFetch<CategoryResponse[]>({
        url: `category-books/books/${id}`,
        key: ["category-books", id],
    });

    const currentCategory = Array.isArray(categories)
        ? categories.find(cat => cat.id === Number(id))
        : categories;

    const categoryName =
        (currentCategory as any)?.name || "Danh mục sách";

    const filteredAndSortedBooks = useMemo(() => {

        let result = [...((currentCategory as any)?.books || [])];

        if (searchTerm) {
            result = result.filter(book =>
                book.title
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        }

        switch (sortConfig) {

            case 'name-asc':
                result.sort((a, b) =>
                    a.title.localeCompare(b.title)
                );
                break;

            case 'name-desc':
                result.sort((a, b) =>
                    b.title.localeCompare(a.title)
                );
                break;

            case 'price-asc':
                result.sort((a, b) =>
                    Number(a.price) - Number(b.price)
                );
                break;

            case 'price-desc':
                result.sort((a, b) =>
                    Number(b.price) - Number(a.price)
                );
                break;

            default:
                break;
        }

        return result;

    }, [currentCategory, searchTerm, sortConfig]);

    const bannerBooks = useMemo(() => {
        return filteredAndSortedBooks.slice(0, 6);
    }, [filteredAndSortedBooks]);

    const currentActiveBook = bannerBooks[activeIndex];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#00b98e]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#121212] text-gray-300 p-4 md:p-10">

            <div className="max-w-7xl mx-auto space-y-8">

                {/* BACK */}
                <button
                    onClick={() => navigate({ to: "/user-page" })}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#00b98e] transition-all"
                >
                    <ChevronLeft size={16} />
                    Quay lại
                </button>

                {/* HERO */}
                {bannerBooks.length > 0 && currentActiveBook && (

                    <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#181818] p-6 lg:p-10">

                        {/* BG */}
                        <div
                            className="absolute inset-0 opacity-10 blur-3xl scale-110 bg-cover bg-center"
                            style={{
                                backgroundImage:
                                    `url(${baseUrl + currentActiveBook.avatar_path})`
                            }}
                        />

                        <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">

                            {/* LEFT */}
                            <div className="space-y-5">

                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#00b98e]/20 bg-[#00b98e]/10 text-[#00b98e] text-xs font-bold">
                                    BOOKLIB PREMIUM
                                </div>

                                <h1 className="text-3xl lg:text-5xl font-black text-white leading-tight">
                                    {currentActiveBook.title}
                                </h1>

                                <p className="text-gray-400 leading-relaxed line-clamp-4">
                                    {
                                        currentActiveBook.description ||
                                        "Khám phá những cuốn sách chất lượng với trải nghiệm đọc hiện đại."
                                    }
                                </p>

                                <div className="flex items-center gap-4 pt-2">

                                    <Button
                                        onClick={() =>
                                            navigate({
                                                to: `/user-book-detail/${currentActiveBook.id}`
                                            })
                                        }
                                        className="bg-[#00b98e] hover:bg-[#00a37d] h-11 px-6 rounded-xl"
                                    >
                                        <Eye size={16} className="mr-2" />
                                        Đọc ngay
                                    </Button>

                                    <span className="text-2xl font-black text-orange-400">
                                        {
                                            Number(currentActiveBook.price) === 0
                                                ? "Miễn phí"
                                                : `${Number(currentActiveBook.price).toLocaleString()}đ`
                                        }
                                    </span>

                                </div>

                            </div>

                            {/* RIGHT */}
                            <div className="relative">

                                <Swiper
                                    effect={'coverflow'}
                                    centeredSlides={true}
                                    slidesPerView={'auto'}
                                    loop={bannerBooks.length > 1}
                                    grabCursor={true}

                                    autoplay={{
                                        delay: 4000,
                                        disableOnInteraction: false,
                                    }}

                                    navigation={{
                                        nextEl: '.swiper-next',
                                        prevEl: '.swiper-prev',
                                    }}

                                    coverflowEffect={{
                                        rotate: 0,
                                        stretch: 0,
                                        depth: 120,
                                        modifier: 2.5,
                                        slideShadows: false,
                                    }}

                                    onSlideChange={(swiper) =>
                                        setActiveIndex(swiper.realIndex)
                                    }

                                    modules={[
                                        EffectCoverflow,
                                        Navigation,
                                        Autoplay
                                    ]}

                                    className="w-full py-10"
                                >

                                    {bannerBooks.map((book) => (

                                        <SwiperSlide
                                            key={book.id}
                                            className="!w-[220px]"
                                        >

                                            {({ isActive }) => (

                                                <BannerSlide
                                                    book={book}
                                                    isActive={isActive}
                                                />

                                            )}

                                        </SwiperSlide>

                                    ))}

                                </Swiper>

                                <button className="swiper-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center hover:bg-[#00b98e] transition-all">
                                    <ChevronLeft size={18} />
                                </button>

                                <button className="swiper-next absolute right-0 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center hover:bg-[#00b98e] transition-all">
                                    <ChevronRight size={18} />
                                </button>

                            </div>

                        </div>

                    </div>

                )}

                {/* CONTROLS */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

                    <div>
                        <h2 className="text-2xl font-bold text-white">
                            {categoryName}
                        </h2>

                        <p className="text-gray-500 text-sm mt-1">
                            {filteredAndSortedBooks.length} cuốn sách
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                        {/* SEARCH */}
                        <div className="relative">

                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />

                            <input
                                type="text"
                                placeholder="Tìm kiếm sách..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                                className="bg-[#1a1a1a] border border-white/5 rounded-xl h-11 pl-10 pr-4 text-sm focus:outline-none focus:border-[#00b98e] w-64"
                            />

                        </div>

                        {/* SORT */}
                        <DropdownMenu>

                            <DropdownMenuTrigger asChild>

                                <button className="h-11 px-4 rounded-xl bg-[#1a1a1a] border border-white/5 flex items-center gap-2 hover:border-[#00b98e]/50">

                                    <Filter size={16} />
                                    Sắp xếp

                                </button>

                            </DropdownMenuTrigger>

                            <DropdownMenuContent className="bg-[#1a1a1a] border-white/10 text-white">

                                <DropdownMenuLabel>
                                    Theo tên
                                </DropdownMenuLabel>

                                <DropdownMenuItem
                                    onClick={() => setSortConfig('name-asc')}
                                >
                                    <SortAsc className="mr-2 size-4" />
                                    A-Z
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => setSortConfig('name-desc')}
                                >
                                    <SortDesc className="mr-2 size-4" />
                                    Z-A
                                </DropdownMenuItem>

                            </DropdownMenuContent>

                        </DropdownMenu>

                        {/* VIEW */}
                        <div className="flex items-center bg-[#1a1a1a] border border-white/5 p-1 rounded-xl">

                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${
                                    viewMode === 'grid'
                                        ? 'bg-[#00b98e] text-white'
                                        : 'text-gray-500'
                                }`}
                            >
                                <LayoutGrid size={18} />
                            </button>

                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${
                                    viewMode === 'list'
                                        ? 'bg-[#00b98e] text-white'
                                        : 'text-gray-500'
                                }`}
                            >
                                <List size={18} />
                            </button>

                        </div>

                    </div>

                </div>

                {/* BOOKS */}
                <div
                    className={
                        viewMode === 'grid'
                            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
                            : "flex flex-col gap-4"
                    }
                >

                    {filteredAndSortedBooks.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            mode={viewMode}
                        />
                    ))}

                </div>

            </div>

        </div>
    );
}














interface BannerSlideProps {
    book: Book;
    isActive: boolean;
}

const BannerSlide = ({
    book,
    isActive
}: BannerSlideProps) => {

    const baseUrl = "http://127.0.0.1:3000";

    return (

        <div
            className={`
                relative aspect-[3/4] overflow-hidden rounded-3xl
                transition-all duration-500
                border
                ${isActive
                    ? 'scale-100 border-[#00b98e]/50 shadow-[0_0_40px_rgba(0,185,142,0.25)]'
                    : 'scale-90 border-white/10 opacity-60'}
            `}
        >

            <img
                src={baseUrl + book.avatar_path}
                alt={book.title}
                className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-4">

                <h3 className="text-white font-bold line-clamp-2">
                    {book.title}
                </h3>

                <p className="text-[#00b98e] text-sm mt-1 font-semibold">
                    {
                        Number(book.price) === 0
                            ? "Miễn phí"
                            : `${Number(book.price).toLocaleString()}đ`
                    }
                </p>

            </div>

        </div>

    );
};














interface BookCardProps {
    book: Book;
    mode: 'grid' | 'list';
}

const BookCard = ({
    book,
    mode
}: BookCardProps) => {

    const navigate = useNavigate();

    const baseUrl = "http://127.0.0.1:3000";

    const displayPrice =
        Number(book.price) === 0
            ? "Miễn phí"
            : `${Number(book.price).toLocaleString()}đ`;

    if (mode === 'list') {

        return (

            <div
                onClick={() =>
                    navigate({
                        to: `/user-book-detail/${book.id}`
                    })
                }
                className="group flex gap-5 p-4 bg-[#1a1a1a] rounded-2xl border border-white/5 hover:border-[#00b98e]/40 transition-all cursor-pointer"
            >

                <div className="w-28 aspect-[3/4] rounded-xl overflow-hidden">

                    <LazyImage
                        src={baseUrl + book.avatar_path}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                </div>

                <div className="flex-1 flex flex-col justify-between">

                    <div>

                        <h3 className="text-white text-lg font-bold group-hover:text-[#00b98e] transition-all">
                            {book.title}
                        </h3>

                        <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                            {book.description}
                        </p>

                    </div>

                    <div className="flex items-center justify-between mt-4">

                        <span className="text-[#00b98e] font-bold">
                            {displayPrice}
                        </span>

                        <Button
                            size="sm"
                            className="bg-[#00b98e] hover:bg-[#00a37d]"
                        >
                            <ShoppingCart size={14} className="mr-1" />
                            Thêm giỏ
                        </Button>

                    </div>

                </div>

            </div>

        );
    }

    return (

        <div
            onClick={() =>
                navigate({
                    to: `/user-book-detail/${book.id}`
                })
            }
            className="group cursor-pointer"
        >

            <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/10">

                <img
                    src={baseUrl + book.avatar_path}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">

                    <Button className="bg-[#00b98e] hover:bg-[#00a37d]">
                        Chi tiết
                    </Button>

                </div>

            </div>

            <div className="mt-3 px-1">

                <h3 className="text-sm font-bold text-gray-200 line-clamp-2 group-hover:text-[#00b98e] transition-all">
                    {book.title}
                </h3>

                <div className="flex items-center justify-between mt-2">

                    <span className="text-[#00b98e] text-sm font-bold">
                        {displayPrice}
                    </span>

                    <span className="text-xs text-gray-500">
                        {book.publish_year}
                    </span>

                </div>

            </div>

        </div>

    );
};