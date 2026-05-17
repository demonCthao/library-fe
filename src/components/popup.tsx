import { AnyFormApi } from "@tanstack/react-form"
import _ from "lodash"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { useTranslation } from "react-i18next";

type BasePopupProps = {
    open: boolean
    onClose: () => void
    children: React.ReactNode
    title: string
    description?: string
    variant: "lg" | "sm" | "md" | "xl" | "2xl"
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

export const Popup = ({ open, form, type, title, description, variant, children, onClose, onConfirm }: PopupProps) => {
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
            <DialogContent className={`max-w-[80%] ${width[variant]}`}>
                <DialogHeader>
                    <DialogTitle className="font-bold">{t(title)}</DialogTitle>
                    {
                        !_.isNull(description) && <DialogDescription>
                            {description}
                        </DialogDescription>
                    }
                </DialogHeader>
                {
                    _.isEqual(type, "form") && form ?
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                form.handleSubmit()
                            }}>
                            {children}
                            <DialogFooter className="mt-3">
                                <DialogClose asChild>
                                    <Button className="cursor-pointer" variant="outline">{t("cancel")}</Button>
                                </DialogClose>
                                <Button className="cursor-pointer" type="submit" onClick={onConfirm}>{t("save")}</Button>
                            </DialogFooter>
                        </form> :
                        <div>
                            {children}
                            <DialogFooter className="mt-5">
                                {
                                    _.isEqual(type, "confirm") ?
                                        <>
                                            <DialogClose asChild>
                                                <Button variant="outline">{t("cancel")}</Button>
                                            </DialogClose>
                                            <Button type="button" onClick={onConfirm}>{t("confirm")}</Button>
                                        </>
                                        :
                                        <DialogClose asChild>
                                            <Button variant="outline">OK</Button>
                                        </DialogClose>
                                }

                            </DialogFooter>
                        </div>
                }

            </DialogContent>
        </Dialog>
    )
}
