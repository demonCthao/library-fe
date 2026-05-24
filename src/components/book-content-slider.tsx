import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface BookContentSliderProps {
    content: string; // Đây là chuỗi HTML từ database
    title: string;
}

export const BookContentSlider = ({ content, title }: BookContentSliderProps) => {
    return (
        <div className="w-full max-w-4xl mx-auto py-10 bg-[#121214]">
            <h2 className="text-2xl font-bold text-emerald-400 mb-6 px-4">{title}</h2>

            <Swiper
                modules={[Navigation, Pagination, Keyboard]}
                spaceBetween={50}
                slidesPerView={1}
                navigation
                keyboard={{ enabled: true }}
                pagination={{ clickable: true, dynamicBullets: true }}
                className="rounded-xl overflow-hidden shadow-2xl border border-white/5"
            >
                {/* Nếu bạn có nhiều chương, bạn sẽ map qua mảng. 
          Ở đây mình ví dụ hiển thị nội dung HTML hiện tại vào 1 Slide lớn có khả năng cuộn.
        */}
                <SwiperSlide className="bg-[#1e1e20] p-8 md:p-16">
                    <div className="max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                        {/* Sử dụng class 'prose' để tự động định dạng các thẻ HTML (h1, p, li...)
               'prose-invert' để dùng cho nền tối (chữ trắng)
            */}
                        <article
                            className="prose prose-emerald prose-invert max-w-full 
                         break-words [overflow-wrap:anywhere] 
                         selection:bg-emerald-500/30"
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </SwiperSlide>

                {/* Ví dụ Slide thứ 2 (Thông tin thêm) */}
                <SwiperSlide className="bg-[#1e1e20] p-8 flex flex-col items-center justify-center text-center">
                    <h3 className="text-xl font-semibold mb-4">Bạn đã hoàn thành chương này!</h3>
                    <p className="text-gray-400">Hãy nhấn nút bên dưới để sang chương tiếp theo.</p>
                </SwiperSlide>
            </Swiper>
        </div>
    );
};