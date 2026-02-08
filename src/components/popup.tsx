import { AnyFormApi } from "@tanstack/react-form"
import _ from "lodash"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"

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

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className={`sm:max-w-${variant}`}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
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
                        </form> :
                        <div>
                            {children}
                        </div>
                }
                <DialogFooter>
                    {
                        _.isEqual(type, "form") ?
                            <>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" onClick={onConfirm}>Save changes</Button>
                            </> :
                            _.isEqual(type, "confirm") ?
                                <>
                                    <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button type="button" onClick={onConfirm}>Confirm</Button>
                                </>
                                :
                                <DialogClose asChild>
                                    <Button variant="outline">OK</Button>
                                </DialogClose>
                    }

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
