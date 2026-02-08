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
    const circumference = Math.ceil(3.14 * radius * 2);
    const percentage = Math.ceil(circumference * ((100 - value) / 100));

    const viewBox = `-${size * 0.125} -${size * 0.125} ${size * 1.25} ${size * 1.25}`;

    return (
        <div className="relative">
            <svg
                width={size}
                height={size}
                viewBox={viewBox}
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transform: "rotate(-90deg)" }}
                className="relative"
            >
                {/* Base Circle */}
                <circle
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    fill="transparent"
                    strokeWidth={strokeWidth ?? circleStrokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset="0"
                    className={cn("stroke-primary/25", className)}
                />

                {/* Progress */}
                <circle
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    strokeWidth={strokeWidth ?? progressStrokeWidth}
                    strokeLinecap={shape}
                    strokeDashoffset={percentage}
                    fill="transparent"
                    strokeDasharray={circumference}
                    className={cn("stroke-primary", progressClassName)}
                />
            </svg>
            {showLabel && (
                <div
                    className={cn(
                        "absolute inset-0 flex items-center justify-center text-lg",
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
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 99) {
                    clearInterval(timer)
                    return 100
                }
                return prev + 1
            })
        }, 20)

        return () => clearInterval(timer)
    }, [])

    return (
        <div className="flex items-center justify-center h-full overflow-hidden">
            <div className="w-64 h-32 flex items-center justify-center">
                <CircularProgress
                    value={progress}
                    size={160}
                    strokeWidth={16}
                    showLabel
                    labelClassName="text-2xl font-bold"
                    renderLabel={(progress) => `${progress}%`}
                    className="stroke-orange-500/25"
                    progressClassName="stroke-indigo-600"
                />
            </div>
        </div>
    )
}