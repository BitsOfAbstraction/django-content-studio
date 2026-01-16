import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva("", {
  variants: {
    variant: {
      secondary: "bg-stone-100",
      default: "border bg-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Input({
  className,
  type,
  variant,
  value,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      value={value ?? ""}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground flex h-8 w-full min-w-0 rounded-md px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        inputVariants({ variant, className }),
      )}
      {...props}
    />
  );
}

export { Input };
