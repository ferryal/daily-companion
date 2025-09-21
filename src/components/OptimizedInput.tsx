"use client";

import { forwardRef, useCallback, memo } from "react";
import { cn } from "@/lib/utils";

interface OptimizedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const OptimizedInput = memo(
  forwardRef<HTMLInputElement, OptimizedInputProps>(
    ({ className, type, onChange, ...props }, ref) => {
      const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          if (onChange) {
            onChange(e);
          }
        },
        [onChange]
      );

      return (
        <input
          type={type}
          ref={ref}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          onChange={handleChange}
          style={{
            contain: "layout style",
            transform: "translateZ(0)",
            willChange: "contents",
          }}
          {...props}
        />
      );
    }
  )
);

OptimizedInput.displayName = "OptimizedInput";

export { OptimizedInput };
