import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const inputVariants = cva("", {
  variants: {
    variant: {
      default: "border border-gray-300 bg-white",
    },
    size: {
      sm: "h-7",
      default: "h-8",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

function Input({
  className,
  type,
  variant,
  size,
  value,
  ...props
}: React.ComponentProps<"input"> & VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      value={value ?? ""}
      className={cn(
        "text-gray-700 file:text-gray-700 placeholder:text-gray-400 flex h-7 w-full min-w-0 rounded-md px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus:border-gray-400",
        "aria-invalid:focus:border-rose-500",
        inputVariants({ variant, size, className }),
      )}
      {...props}
    />
  );
}

export { Input };
