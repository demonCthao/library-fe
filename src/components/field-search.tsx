import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface FieldSearchProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    isHideIcon?: boolean
    label?: string;
    wrapperClassName?: string;
    children?: React.ReactNode;
}

export const FieldSearch = React.forwardRef<
    HTMLInputElement,
    FieldSearchProps
>(({ isHideIcon = false, label, className, wrapperClassName, children, ...props }, ref) => {
    return (
        <div className={cn("relative w-full group", wrapperClassName)}>
            {
                children ?? (
                    <>
                        {/* Icon kính lúp ở đầu (nếu không ẩn) */}
                        {!isHideIcon && (
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors duration-200">
                                <Search size={16} />
                            </div>
                        )}

                        <input
                            type="text"
                            placeholder=" "
                            className={cn(
                                "peer w-full px-4 py-2 text-sm rounded-xl transition-all duration-200",
                                // Dark Mode Styles
                                "bg-[#252529] border border-white/5 text-gray-200",
                                // Focus Styles
                                "focus:outline-none focus:border-emerald-500/50 focus:bg-[#2b2b30] focus:ring-4 focus:ring-emerald-500/10",
                                // Padding chỉnh sửa dựa theo icon
                                !isHideIcon ? "pl-10" : "pl-4",
                                className
                            )}
                            {...props}
                            ref={ref}
                        />

                        {/* Floating Label */}
                        <label
                            className={cn(
                                "absolute transition-all duration-200 pointer-events-none text-gray-500",
                                // Vị trí mặc định
                                "top-1/2 -translate-y-1/2 text-sm",
                                !isHideIcon ? "left-10" : "left-4",

                                // Khi Focus: Nhảy lên trên và đổi sang chữ TRẮNG
                                "peer-focus:-top-2 peer-focus:left-3 peer-focus:text-[11px] peer-focus:text-white peer-focus:font-bold peer-focus:bg-[#1a1a1c] peer-focus:px-2",

                                // Khi có dữ liệu (not-placeholder-shown): Nhảy lên trên và màu Emerald
                                "peer-not-placeholder-shown:-top-2 peer-not-placeholder-shown:left-3 peer-not-placeholder-shown:text-[11px] peer-not-placeholder-shown:text-emerald-400 peer-not-placeholder-shown:bg-[#1a1a1c] peer-not-placeholder-shown:px-2"
                            )}
                        >
                            {label}
                        </label>
                    </>
                )
            }
        </div>
    );
});

FieldSearch.displayName = "FieldSearch";