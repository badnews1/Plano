import * as React from "react";

import { cn } from "./utils";

interface InputProps extends Omit<React.ComponentProps<"input">, 'showCharCount'> {
  showCharCount?: boolean;
  variant?: 'tertiary' | 'secondary' | 'borderless';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, showCharCount, maxLength, onChange, variant = 'tertiary', ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(0);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Объединяем рефы
    React.useImperativeHandle(ref, () => inputRef.current!);

    // Обновляем счетчик при изменении значения
    React.useEffect(() => {
      if (showCharCount && inputRef.current) {
        setCharCount(inputRef.current.value.length);
      }
    }, [showCharCount]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (showCharCount) {
        setCharCount(e.target.value.length);
      }
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <div className="relative w-full">
        <input
          type={type}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-[var(--text-tertiary)] selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            variant === 'tertiary' && "border-input bg-input-background",
            variant === 'secondary' && "border-[var(--border-tertiary)] bg-[var(--bg-secondary)]",
            variant === 'borderless' && "border-none bg-transparent",
            "focus-visible:border-ring",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            showCharCount && maxLength && "pr-16", // Добавляем отступ справа для счетчика
            className,
          )}
          ref={inputRef}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
        {showCharCount && maxLength && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-tertiary)] pointer-events-none">
            {maxLength - charCount}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };