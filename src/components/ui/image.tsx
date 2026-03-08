import { useEffect, useRef, useState } from "react";

type LazyImageProps = {
    src: string;
    alt?: string;
    className?: string;
    placeholder?: string;
};

export const LazyImage = ({
    src,
    alt = "",
    className,
    placeholder,
}: LazyImageProps) => {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.disconnect();
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <img
            ref={imgRef}
            src={isVisible ? src : placeholder}
            alt={alt}
            className={className}
        />
    );
};