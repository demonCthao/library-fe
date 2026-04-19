import { type Table as TanStackTTable } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface IDropdownHeaderTableProps<TData> {
    table: TanStackTTable<TData>;
}

export const DropdownHeaderTable = <TData,>({ table }: IDropdownHeaderTableProps<TData>) => {
    const { t } = useTranslation();

    return (
        <div><DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button type="button">
                    <Settings2 size={18} /> {t("view")}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) rounded-lg min-w-40"
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="font-normal font-semibold">
                    {t("toggleColumns")}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table.getAllLeafColumns().map(column => (
                    <DropdownMenuCheckboxItem
                        key={column.id}
                        checked={column.getIsVisible()}
                        onCheckedChange={(checked) =>
                            column.toggleVisibility(!!checked)
                        }
                        className="cursor-pointer py-2 font-normal"
                    >
                        {t(column.columnDef.meta?.label ?? column.id)}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu></div>
    )
}
