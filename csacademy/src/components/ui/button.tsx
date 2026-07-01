import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-500 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:     "bg-cyber-500 text-space-900 shadow hover:bg-cyber-400 font-semibold",
        destructive: "bg-red-500 text-white shadow-sm hover:bg-red-600",
        outline:     "border border-border bg-transparent text-slate-200 shadow-sm hover:bg-card hover:border-cyber-500",
        secondary:   "bg-card text-slate-200 shadow-sm hover:bg-border",
        ghost:       "hover:bg-card hover:text-slate-100 text-slate-400",
        link:        "text-cyber-500 underline-offset-4 hover:underline",
        purple:      "bg-purple-600 text-white shadow hover:bg-purple-500 font-semibold",
        gradient:    "bg-gradient-to-r from-cyber-500 to-purple-600 text-white shadow font-semibold hover:opacity-90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm:      "h-8 rounded-md px-3 text-xs",
        lg:      "h-12 rounded-lg px-8 text-base",
        xl:      "h-14 rounded-lg px-10 text-lg",
        icon:    "h-9 w-9",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
