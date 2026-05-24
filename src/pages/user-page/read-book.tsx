import { useParams } from "@tanstack/react-router";
import useEmblaCarousel from 'embla-carousel-react';
import {
    ChevronLeft, ChevronRight,
    List,
    Maximize2,
    Search,
    Settings,
    Share2
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

// Giả định các UI components từ shadcn/ui
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ReadBook() {
    const { id } = useParams({ from: "/read-book/$id" });
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalSlides, setTotalSlides] = useState(0);

    // Dữ liệu giả lập các trang sách
    const slides = [
        {
            id: 1,
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-8 p-12">
                    <div className="border-4 border-white/20 p-8 rounded-lg max-w-md">
                        <h2 className="text-4xl font-bold mb-4">PHẦN 1</h2>
                        <p className="text-2xl italic">Bán hàng là tâm lý - Hiểu đúng để dùng đúng</p>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-3xl font-semibold">Chương 1.</h3>
                        <p className="text-xl max-w-lg">Bán hàng không phải thuyết phục, mà là giảm kháng cự</p>
                    </div>
                </div>
            )
        },
        {
            id: 2,
            content: (
                <div className="flex flex-col items-center justify-center h-full text-center p-12">
                    <p className="text-xl leading-relaxed max-w-2xl">
                        "Trong kinh doanh, tâm lý học quan trọng hơn cả kỹ năng chuyên môn.
                        Người bán hàng thành công là người thấu hiểu nỗi sợ của khách hàng..."
                    </p>
                </div>
            )
        }
    ];

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCurrentIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        setTotalSlides(emblaApi.scrollSnapList().length);
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    const progress = ((currentIndex + 1) / totalSlides) * 100;

    return (
        <div className="flex h-screen bg-[#121212] text-zinc-300 font-sans overflow-hidden">

            {/* --- SIDEBAR TRÁI --- */}
            <aside className="w-[320px] bg-[#1a1a1a] border-r border-zinc-800 flex flex-col">
                <div className="p-6 space-y-6">
                    {/* Header Sidebar */}
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shrink-0">
                            <img src="/api/placeholder/48/48" alt="Logo" className="rounded" />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-white leading-tight">
                                Ứng dụng thuật tâm lý vào bán hàng
                            </h1>
                            <p className="text-xs text-zinc-500 mt-1">Brian Tracy</p>
                        </div>
                    </div>

                    <Button className="w-full bg-[#00b98e] hover:bg-[#00a37d] text-white rounded-full">
                        Đăng nhập
                    </Button>

                    {/* Nội dung giới thiệu */}
                    <ScrollArea className="h-[calc(100vh-250px)] pr-4">
                        <div className="space-y-4 text-sm leading-relaxed text-zinc-400">
                            <p className="text-[#00b98e] font-medium italic underline">Sách mượn</p>
                            <p>
                                Nếu bạn từng đặt câu hỏi "điều gì đã tạo nên sự khác biệt giữa một người bán hàng xuất sắc với một người bán hàng bình thường?", câu trả lời chính là: <strong>Tâm lý học.</strong>
                            </p>
                            <p>
                                Brian Tracy - bậc thầy về bán hàng, sẽ chỉ cho bạn thấy những rào cản tâm lý vô hình đang ngăn cản bạn đạt được doanh số kỳ vọng.
                            </p>
                            <p>
                                Cuốn sách này không dạy bạn các "mẹo" lừa dối khách hàng, nó giúp bạn hiểu sâu sắc nhu cầu và nỗi sợ của con người để từ đó đưa ra giải pháp phù hợp nhất.
                            </p>
                        </div>
                    </ScrollArea>
                </div>
            </aside>

            {/* --- NỘI DUNG CHÍNH (READER) --- */}
            <main className="flex-1 flex flex-col relative">

                {/* Header Công cụ */}
                <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-6 bg-[#121212]/80 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
                            Ứng dụng thuật tâm lý vào bán hàng
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

                    {/* Nút điều hướng Slide */}
                    <button
                        onClick={scrollPrev}
                        className="cursor-pointer absolute left-4 z-20 p-3 rounded-full bg-zinc-800/50 hover:bg-zinc-700 text-white transition-all shadow-xl"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    {/* Khung chứa Carousel */}
                    <div className="w-full h-full max-w-4xl bg-[#1e1e1e] rounded-xl shadow-2xl border border-zinc-800 overflow-hidden" ref={emblaRef}>
                        <div className="flex h-full">
                            {slides.map((slide) => (
                                <div key={slide.id} className="flex-[0_0_100%] min-w-0 h-full text-white">
                                    {slide.content}
                                </div>
                            ))}
                            {/* <section className="mt-10 border-t border-white/10">
                                <BookContentSlider
                                    content={book.content}
                                    title={book.title}
                                />
                            </section> */}
                        </div>
                    </div>

                    <button
                        onClick={scrollNext}
                        className="cursor-pointer absolute right-4 z-20 p-3 rounded-full bg-zinc-800/50 hover:bg-zinc-700 text-white transition-all shadow-xl"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>

                {/* Footer Thanh tiến trình */}
                <footer className="h-16 px-8 flex flex-col justify-center gap-2 bg-[#121212]">
                    <div className="flex justify-between items-center text-[11px] text-zinc-500 uppercase">
                        <span>Phần 1 - Bán hàng là tâm lý - Hiểu đúng để dùng đúng</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Progress value={progress} className="h-1 flex-1 bg-zinc-800" />
                    </div>
                </footer>
            </main>
        </div>
    );
}
