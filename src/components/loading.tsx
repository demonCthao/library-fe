import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface CircularProgressProps {
    value: number;
    renderLabel?: (progress: number) => number | string;
    size?: number;
    strokeWidth?: number;
    circleStrokeWidth?: number;
    progressStrokeWidth?: number;
    shape?: "square" | "round";
    className?: string;
    progressClassName?: string;
    labelClassName?: string;
    showLabel?: boolean;
}

const CircularProgress = ({
    value,
    renderLabel,
    className,
    progressClassName,
    labelClassName,
    showLabel,
    shape = "round",
    size = 100,
    strokeWidth,
    circleStrokeWidth = 10,
    progressStrokeWidth = 10,
}: CircularProgressProps) => {
    const radius = size / 2 - 10;
    const circumference = 2 * Math.PI * radius;
    // Đảo ngược logic để vẽ đúng chiều kim đồng hồ
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                style={{ transform: "rotate(-90deg)" }}
                className="relative"
            >
                {/* Vòng tròn nền (Track) */}
                <circle
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    fill="transparent"
                    strokeWidth={strokeWidth ?? circleStrokeWidth}
                    className={cn("stroke-white/5", className)}
                />

                {/* Vòng tròn tiến trình (Progress) */}
                <circle
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    fill="transparent"
                    strokeWidth={strokeWidth ?? progressStrokeWidth}
                    strokeLinecap={shape}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className={cn(
                        "stroke-emerald-500 transition-all duration-300 ease-out",
                        progressClassName
                    )}
                />
            </svg>
            {showLabel && (
                <div
                    className={cn(
                        "absolute inset-0 flex items-center justify-center font-mono",
                        labelClassName
                    )}
                >
                    {renderLabel ? renderLabel(value) : value}
                </div>
            )}
        </div>
    );
};

export default function Loading() {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Tăng tốc độ mượt mà hơn
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                return prev + 1;
            });
        }, 15); // Nhanh hơn một chút để tạo cảm giác linh hoạt

        return () => clearInterval(timer);
    }, []);

    return (
        // Thêm min-h-screen để căn giữa toàn bộ ứng dụng khi đang load
        <div className="fixed inset-0 flex items-center justify-center bg-[#121214] z-[9999]">
            <div className="flex flex-col items-center gap-6">
                <CircularProgress
                    value={progress}
                    size={120}
                    strokeWidth={8}
                    showLabel
                    labelClassName="text-xl font-bold text-white"
                    renderLabel={(p) => `${p}%`}
                    className="stroke-white/10"
                    progressClassName="stroke-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                />

                {/* Thêm text hiệu ứng để phù hợp với ứng dụng Bookstore */}
                <div className="flex flex-col items-center">
                    <p className="text-emerald-500 font-medium tracking-widest animate-pulse uppercase text-xs">
                        Đang tải dữ liệu
                    </p>
                    <div className="flex gap-1 mt-2">
                        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce"></span>
                    </div>
                </div>
            </div>
        </div>
    );
}