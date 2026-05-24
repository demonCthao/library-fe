import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // text-white được đưa lên làm mặc định, giảm gap xuống 1.5
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none active:scale-[0.96] cursor-pointer text-white [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // default giờ dùng chữ trắng thay vì màu đen của emerald cũ
        default: 
          "bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-500/10",
        destructive:
          "bg-red-600 hover:bg-red-500 shadow-md shadow-red-500/10",
        outline:
          "border border-white/10 bg-transparent hover:bg-white/5 hover:border-white/20",
        secondary:
          "bg-white/10 hover:bg-white/15 border border-white/5",
        ghost:
          "hover:bg-white/5",
        link: 
          "text-emerald-400 underline-offset-4 hover:underline px-0",
      },
      size: {
        // Thu gọn padding (px) và chiều cao (h)
        default: "h-9 px-3.5 py-2", 
        xs: "h-6 px-2 text-[11px] rounded-lg [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 px-3 rounded-lg text-xs",
        lg: "h-11 px-6 rounded-xl text-base",
        icon: "size-9 rounded-xl",
        "icon-sm": "size-8 rounded-lg",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }