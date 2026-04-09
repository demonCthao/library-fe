import * as React from "react";

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
        <div className="relative w-full">
            {
                children ?? <>
                    <input
                        type="text"
                        placeholder=" "
                        className="peer w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-gray-900 transition-all"
                        {...props}
                        ref={ref}
                    />

                    <label
                        className="absolute left-3 top-1/2 -translate-y-1/2 
                            px-2 text-sm text-gray-500
                            transition-all duration-200
                            peer-focus:top-0 peer-focus:text-xs peer-focus:text-gray-900
                            peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:text-xs
                            bg-gray-100
                            before:absolute before:inset-0 before:bg-gray-100 before:z-[-1]
                            pointer-events-none"
                    >
                        {label}
                    </label>
                </>
            }
        </div>
    );
});

FieldSearch.displayName = "FieldSearch";