import { AnyFormApi } from "@tanstack/react-form"
import _ from "lodash"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type BasePopupProps = {
    open: boolean
    onClose: () => void
    children: React.ReactNode
    title: string
    description?: string
    variant: "lg" | "sm" | "md" | "xl" | "2xl"
    className?: string
}

type FormPopupProps = BasePopupProps & {
    type: "form"
    form: AnyFormApi
    onConfirm?: never
}

type NonFormPopupProps = BasePopupProps & {
    type: "confirm" | "information"
    form?: never
    onConfirm: () => void
}

type PopupProps = FormPopupProps | NonFormPopupProps

export const Popup = ({ open, form, type, title, description, variant, children, onClose, onConfirm, className }: PopupProps) => {
    const { t } = useTranslation();
    const width: Record<string, string> = {
        sm: "sm:max-w-md",
        md: "sm:max-w-lg",
        lg: "sm:max-w-2xl",
        xl: "sm:max-w-4xl",
        "2xl": "sm:max-w-6xl",
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent
                className={cn(
                    "max-w-[90%] shadow-2xl transition-all duration-300",
                    "bg-[#0a0a0b] border border-emerald-500/30 text-white",
                    "shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]",
                    width[variant],
                    className
                )}
            >
                <DialogHeader className="space-y-2 border-b border-white/5 pb-4">
                    <DialogTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full" /> {/* Thanh trang trí bên trái tiêu đề */}
                        {t(title)}
                    </DialogTitle>
                    {
                        !_.isNil(description) && (
                            <DialogDescription className="text-gray-400 text-sm italic font-medium">
                                {description}
                            </DialogDescription>
                        )
                    }
                </DialogHeader>

                <div className="py-2 text-white">
                    {
                        _.isEqual(type, "form") && form ? (
                            <form
                                className="space-y-6"
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    form.handleSubmit()
                                }}>
                                {/* Phần nội dung chính - Text sẽ màu trắng sáng ở đây */}
                                <div className="max-h-[65vh] overflow-y-auto pr-3 custom-scrollbar text-gray-100">
                                    {children}
                                </div>

                                <DialogFooter className="gap-3 sm:gap-2 border-t border-white/5 pt-6">
                                    <DialogClose asChild>
                                        <Button
                                            variant="ghost"
                                            className="text-gray-400 hover:text-white hover:bg-white/5 font-medium transition-all"
                                        >
                                            {t("cancel")}
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        className="bg-emerald-500 hover:bg-emerald-600 text-[#0a0a0b] font-bold px-8 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all active:scale-95"
                                        type="submit"
                                    >
                                        {t("save")}
                                    </Button>
                                </DialogFooter>
                            </form>
                        ) : (
                            <div className="space-y-2">
                                <div className="max-h-[65vh] overflow-y-auto pr-3 text-gray-100">
                                    {children}
                                </div>
                                <DialogFooter className="gap-3 sm:gap-2 border-t border-white/5 pt-3">
                                    {
                                        _.isEqual(type, "confirm") ? (
                                            <>
                                                <DialogClose asChild>
                                                    <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-white/5 font-medium">
                                                        {t("cancel")}
                                                    </Button>
                                                </DialogClose>
                                                <Button
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-[#0a0a0b] font-bold px-8 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                                                    type="button"
                                                    onClick={onConfirm}
                                                >
                                                    {t("confirm")}
                                                </Button>
                                            </>
                                        ) : (
                                            <DialogClose asChild>
                                                <Button className="bg-emerald-500 hover:bg-emerald-600 text-[#0a0a0b] font-bold px-10">
                                                    OK
                                                </Button>
                                            </DialogClose>
                                        )
                                    }
                                </DialogFooter>
                            </div>
                        )
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}