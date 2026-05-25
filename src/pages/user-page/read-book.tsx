import { useParams } from "@tanstack/react-router";
import useEmblaCarousel from 'embla-carousel-react';
import {
    ChevronLeft, ChevronRight,
    List,
    Maximize2,
    Search,
    Settings,
    Share2,
    Loader2
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Giả định các UI components từ shadcn/ui của bạn
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFetch } from "@/hooks/useFetch";
import { LazyImage } from "@/components/ui/image";

// Định nghĩa Interface cho dữ liệu nhận từ BookChapterDTO của Back-end
interface BookChapterDTO {
    id: number;
    title: string;
    currentChapterIndex: number;
    chapterContent: string;
    totalChapters: number;
    avatar_path: string;
    isbn: string;
    description: string;
}

export default function ReadBook() {
    const { id } = useParams({ from: "/read-book/$id" });
    const [chapterIndex, setChapterIndex] = useState<number>(0);

    const { data: bookData, isLoading } = useFetch<BookChapterDTO>({
        url: `category-books/${id}/chapter?chapterIndex=${chapterIndex}`,
        key: ["book-reader", id, chapterIndex.toString()],
    });

    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [totalSlides, setTotalSlides] = useState(0);
    const [slides, setSlides] = useState<string[]>([]);

    useEffect(() => {
        if (bookData?.chapterContent) {
            const paragraphs = bookData.chapterContent
                .split('\n\n')
                .filter(p => p.trim() !== "");

            setSlides(paragraphs.length > 0 ? paragraphs : [bookData.chapterContent]);
        } else {
            setSlides([]);
        }
    }, [bookData]);

    const scrollPrev = useCallback(() => {
        if (!emblaApi) return;

        if (emblaApi.canScrollPrev()) {
            emblaApi.scrollPrev();
        } else if (chapterIndex > 0) {
            setChapterIndex(prev => prev - 1);
        }
    }, [emblaApi, chapterIndex]);

    const scrollNext = useCallback(() => {
        if (!emblaApi) return;

        if (emblaApi.canScrollNext()) {
            emblaApi.scrollNext();
        } else if (bookData && chapterIndex < bookData.totalChapters - 1) {
            setChapterIndex(prev => prev + 1);
            setCurrentSlideIndex(0);
        }
    }, [emblaApi, chapterIndex, bookData]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCurrentSlideIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        setTotalSlides(emblaApi.scrollSnapList().length);
        emblaApi.on('select', onSelect);
        emblaApi.scrollTo(0);
    }, [emblaApi, onSelect, slides]);

    const progress = totalSlides > 0 ? ((currentSlideIndex + 1) / totalSlides) * 100 : 0;

    return (
        <div className="flex h-screen bg-[#121212] text-zinc-300 font-sans overflow-hidden">

            {/* --- SIDEBAR TRÁI --- */}
            <aside className="w-[320px] bg-[#1a1a1a] border-r border-zinc-800 flex flex-col">
                <div className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-zinc-800 rounded-md flex items-center justify-center shrink-0 overflow-hidden">
                            <LazyImage
                                src={`http://127.0.0.1:3000${bookData?.avatar_path}`}
                                alt={bookData?.title}
                                className="rounded object-cover"
                            />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-white leading-tight">
                                {bookData?.title || "Đang tải tên sách..."}
                            </h1>
                            <p className="text-xs text-zinc-500 mt-1">Tác giả</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Mục lục nhanh</label>
                        {bookData && (
                            <select
                                value={chapterIndex}
                                onChange={(e) => {
                                    setChapterIndex(Number(e.target.value));
                                    setCurrentSlideIndex(0);
                                }}
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-md p-2 text-sm text-white focus:outline-none focus:border-[#00b98e]"
                            >
                                {Array.from({ length: bookData.totalChapters }).map((_, idx) => (
                                    <option key={idx} value={idx}>
                                        Chương {idx + 1}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    <ScrollArea className="h-[calc(100vh-280px)] pr-4">
                        <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
                            <p className="text-[#00b98e] font-medium italic underline">Giới thiệu sách</p>
                            <p>Bạn đang đọc nội dung được phân tách tự động theo hồi và chương từ hệ thống quản lý dữ liệu.</p>
                        </div>
                    </ScrollArea>
                </div>
            </aside>

            <main className="flex-1 flex flex-col relative">

                {/* Header Công cụ */}
                <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#121212]/80 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest truncate max-w-xs">
                            {bookData?.title || "..."}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-zinc-400"><Search size={18} /></Button>
                        <Button variant="ghost" size="icon" className="text-zinc-400"><List size={18} /></Button>
                        <Button variant="ghost" size="icon" className="text-zinc-400"><Settings size={18} /></Button>
                        <Button variant="ghost" size="icon" className="text-zinc-400"><Share2 size={18} /></Button>
                        <Button variant="ghost" size="icon" className="text-zinc-400"><Maximize2 size={18} /></Button>
                    </div>
                </header>

                {/* Khu vực Slide trang sách */}
                <div className="flex-1 relative flex items-center justify-center p-8">

                    {/* Nút điều hướng lùi */}
                    <button
                        onClick={scrollPrev}
                        disabled={chapterIndex === 0 && currentSlideIndex === 0}
                        className="cursor-pointer absolute left-4 z-20 p-3 rounded-full bg-zinc-800/50 hover:bg-zinc-700 text-white transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Khung chứa Carousel */}
                    <div className="w-full h-full max-w-4xl bg-[#1e1e1e] rounded-xl shadow-2xl border border-zinc-800 overflow-hidden" ref={emblaRef}>
                        <div className="flex h-full">
                            {isLoading ? (
                                <div className="flex-[0_0_100%] flex items-center justify-center h-full">
                                    <Loader2 className="w-8 h-8 animate-spin text-[#00b98e]" />
                                    <span className="ml-2 text-zinc-400">Đang tải chương mới...</span>
                                </div>
                            ) : slides.length === 0 ? (
                                <div className="flex-[0_0_100%] flex items-center justify-center h-full text-zinc-500">
                                    Chương này chưa có nội dung hoặc trống.
                                </div>
                            ) : (
                                slides.map((content, idx) => (
                                    <div key={idx} className="flex-[0_0_100%] min-w-0 h-full p-12 text-white overflow-y-auto">
                                        <div className="flex flex-col justify-center min-h-full max-w-2xl mx-auto">
                                            {/* Hiện tiêu đề chương ở slide đầu tiên */}
                                            {idx === 0 && (
                                                <h2 className="text-2xl font-bold text-[#00b98e] mb-6 border-b border-zinc-800 pb-2">
                                                    Chương {chapterIndex + 1}
                                                </h2>
                                            )}
                                            <p className="text-xl leading-relaxed text-zinc-200 font-serif whitespace-pre-line">
                                                {content}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Nút điều hướng tiến */}
                    <button
                        onClick={scrollNext}
                        disabled={bookData && chapterIndex === bookData.totalChapters - 1 && currentSlideIndex === totalSlides - 1}
                        className="cursor-pointer absolute right-4 z-20 p-3 rounded-full bg-zinc-800/50 hover:bg-zinc-700 text-white transition-all shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Footer Thanh tiến trình */}
                <footer className="h-16 px-8 flex flex-col justify-center gap-2 bg-[#121212]">
                    <div className="flex justify-between items-center text-[11px] text-zinc-500 uppercase">
                        <span>
                            Chương {chapterIndex + 1} {bookData ? `/ Tối đa ${bookData.totalChapters} Chương` : ''}
                        </span>
                        <span>{Math.round(progress)}% (Trang {currentSlideIndex + 1}/{totalSlides || 1})</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Progress value={progress} className="h-1 flex-1 bg-zinc-800" />
                    </div>
                </footer>
            </main>
        </div>
    );
}