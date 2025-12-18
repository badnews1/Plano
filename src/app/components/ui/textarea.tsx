import * as React from "react";

import { cn } from "./utils";

interface TextareaProps extends Omit<React.ComponentProps<"textarea">, 'showCharCount'> {
  showCharCount?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, showCharCount, maxLength, onChange, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(0);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    // Объединяем рефы
    React.useImperativeHandle(ref, () => textareaRef.current!);

    // Обновляем счетчик при изменении значения
    React.useEffect(() => {
      if (textareaRef.current) {
        setCharCount(textareaRef.current.value.length);
      }
    }, [props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      if (onChange) {
        onChange(e);
      }
    };

    // Автоматически показываем счетчик если есть maxLength (для заметок)
    const shouldShowCharCount = showCharCount || maxLength !== undefined;

    return (
      <div className="relative w-full">
        <textarea
          data-slot="textarea"
          className={cn(
            "resize-none border-input placeholder:text-[var(--text-tertiary)] focus-visible:border-ring aria-invalid:border-destructive flex w-full rounded-md border bg-input-background px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            shouldShowCharCount && maxLength && "pb-8", // Добавляем отступ снизу для счетчика
            className,
          )}
          ref={textareaRef}
          maxLength={maxLength}
          onChange={handleChange}
          {...props}
        />
        {shouldShowCharCount && maxLength && (
          <div className="absolute right-3 bottom-2 text-xs text-[var(--text-tertiary)] pointer-events-none">
            {maxLength - charCount}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };