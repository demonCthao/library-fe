"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import * as React from "react";

export interface SelectOption {
    label: string;
    value: string;
    icon?: React.ReactNode;
    otherValue?: any;
    default?: boolean
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

        const getDefault = () => {
            if (defaultValue) {
                return defaultValue
            }

            return options.find(o => o.default)?.value
        }

        return (
            <Select
                value={value}
                defaultValue={getDefault()}
                onValueChange={onValueChange}
                disabled={disabled}
            >
                <SelectTrigger className={cn("w-full font-sans font-bold text-blue-gray-500", className)}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>

                <SelectContent>
                    {options.map((option) => (
                        <SelectItem className="cursor-pointer font-sans font-bold text-blue-gray-500" key={`${option.label}-${option.value}`} value={option.value}>
                            {option.label} {option?.icon}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        );
    }
);

SelectApp.displayName = "SelectApp";

export { SelectApp };
