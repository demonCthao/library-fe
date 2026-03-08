import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

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
        <div className={cn("flex flex-col gap-2 w-full", wrapperClassName)}>
            {label && (
                <Label className="text-sm font-medium text-gray-700">
                    {label}
                </Label>
            )}

            <div className="relative">
                {
                    !isHideIcon? <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> : null
                }
                {
                    children ? children : <Input
                        ref={ref}
                        className={cn("pl-9", className)}
                        {...props}
                    />
                }

            </div>
        </div>
    );
});

FieldSearch.displayName = "FieldSearch";