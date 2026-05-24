import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";

type Slide = {
    id: number;
    image: string;
    title: string;
    subtitle: string;
};

const slides: Slide[] = [
    {
        id: 1,
        image: "../../src/assets/slider/4612.png",
        title: "READING STAYCATION",
        subtitle: "6 cuốn sách mới nhất",
    },
    {
        id: 2,
        image: "../../src/assets/slider/4639.png",
        title: "SÁCH HỘI VIÊN",
        subtitle: "Kho sách độc quyền",
    },
    {
        id: 3,
        image: "../../src/assets/slider/4651.jpg",
        title: "TRUYỆN TRANH HOT",
        subtitle: "Cập nhật mỗi ngày",
    },
    {
        id: 4,
        image: "../../src/assets/slider/4660.png",
        title: "TRUYỆN TRANH HOT",
        subtitle: "Cập nhật mỗi ngày",
    },
    {
        id: 5,
        image: "../../src/assets/slider/4675.jpg",
        title: "TRUYỆN TRANH HOT",
        subtitle: "Cập nhật mỗi ngày",
    },
    {
        id: 6,
        image: "../../src/assets/slider/4678.jpg",
        title: "TRUYỆN TRANH HOT",
        subtitle: "Cập nhật mỗi ngày",
    },
    {
        id: 7,
        image: "../../src/assets/slider/4684.png",
        title: "TRUYỆN TRANH HOT",
        subtitle: "Cập nhật mỗi ngày",
    },
    {
        id: 8,
        image: "../../src/assets/slider/4657.png",
        title: "TRUYỆN TRANH HOT",
        subtitle: "Cập nhật mỗi ngày",
    },
];

export function HeroSlider() {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: true })
    );

    React.useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <div className="relative group">
            <Carousel
                setApi={setApi}
                plugins={[plugin.current]}
                opts={{ loop: true }}
                className="w-full h-[400px]"
            >
                <CarouselContent>
                    {slides.map((slide) => (
                        <CarouselItem key={slide.id}>
                            <div className="relative w-full h-[400px]">
                                <img
                                    src={slide.image}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40" />

                                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                                    <h2 className="text-4xl font-bold mb-2">
                                        {slide.title}
                                    </h2>
                                    <p className="text-lg opacity-90">
                                        {slide.subtitle}
                                    </p>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Buttons */}
                <CarouselPrevious className="size-12 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/30 hover:bg-white/50 text-white border-none rounded-full" />
                <CarouselNext className="size-12 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/30 hover:bg-white/50 text-white border-none rounded-full" />
            </Carousel>

            {/* Dots (bottom right) */}
            <div className="absolute bottom-4 right-6 flex gap-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={`h-2.5 w-2.5 rounded-full transition-all ${index === current
                            ? "bg-white scale-110"
                            : "bg-white/50"
                            }`}
                    />
                ))}
            </div>

            <div className="absolute bottom-0 left-0 w-full h-30 bg-gradient-to-t from-black/100 to-transparent" />
            {/* <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent" /> */}
        </div>
    );
}