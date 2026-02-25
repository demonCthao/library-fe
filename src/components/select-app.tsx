"use client";

import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
    label: string;
    value: string;
}

interface SelectApptProps {
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    options: SelectOption[];
    onValueChange?: (value: string) => void;
    disabled?: boolean;
    className?: string;
}

const SelectApp = React.memo(
    ({
        value,
        defaultValue,
        placeholder = "Chọn",
        options,
        onValueChange,
        disabled,
        className,
    }: SelectApptProps) => {
        return (
            <Select
                value={value}
                defaultValue={defaultValue}
                onValueChange={onValueChange}
                disabled={disabled}
            >
                <SelectTrigger className={cn("w-full", className)}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }
);

SelectApp.displayName = "SelectApp";

export { SelectApp };