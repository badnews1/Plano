"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";

import { cn } from "./utils";

// Контекст для передачи onOpenChange из Root в Content
const SelectContext = React.createContext<{
  onOpenChange?: (open: boolean) => void;
}>({});

function Select({
  onOpenChange,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return (
    <SelectContext.Provider value={{ onOpenChange }}>
      <SelectPrimitive.Root data-slot="select" onOpenChange={onOpenChange} {...props} />
    </SelectContext.Provider>
  );
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

function SelectTrigger({
  className,
  size = "default",
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default" | "lg";
  variant?: "default" | "minimal" | "minimal-icon" | "ghost";
}) {
  // Для minimal-icon и ghost не рендерим автоматическую иконку
  const shouldRenderIcon = variant !== "minimal-icon" && variant !== "ghost";

  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      data-variant={variant}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-md text-sm whitespace-nowrap transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50",
        // Дефолтные стили (с фоном и бордером)
        variant === "default" && "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-[var(--bg-secondary)] px-3 py-2 focus-visible:ring-[3px]",
        // Минималистичный стиль (без фона, без бордера, без ховера, стиль как у h2 text-lg)
        variant === "minimal" && "bg-transparent border-none px-0 py-0 [&_[data-slot=select-value]]:text-[length:var(--text-lg)] [&_[data-slot=select-value]]:font-[var(--font-weight-medium)] [&_[data-slot=select-value]]:leading-[1.5] [&_[data-slot=select-value]]:text-[var(--text-primary)]",
        // Минималистичный вариант только с иконкой (для использования с asChild на h2/h3/etc)
        variant === "minimal-icon" && "bg-transparent border-none px-0 py-0 w-auto cursor-pointer",
        // Ghost стиль (как у ghost кнопки - прозрачный фон, тонкий текст, hover эффект, без стрелки)
        variant === "ghost" && "bg-transparent border-none px-0 py-0 font-normal text-foreground/60 hover:text-foreground transition-colors",
        // Фиксированная высота только для default/minimal вариантов (не для minimal-icon)
        variant !== "minimal-icon" && "data-[size=default]:h-9 data-[size=sm]:h-8 data-[size=lg]:h-12",
        "*:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {children}
      {shouldRenderIcon && (
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="size-4 opacity-50" />
        </SelectPrimitive.Icon>
      )}
    </SelectPrimitive.Trigger>
  );
}

function SelectContent({
  className,
  children,
  position = "popper",
  onEscapeKeyDown,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  const { onOpenChange } = React.useContext(SelectContext);

  const handleEscapeKeyDown = (event: KeyboardEvent) => {
    // Останавливаем всплытие события, чтобы не закрывать родительские модалки
    event.stopPropagation();
    
    // Вызываем пользовательский обработчик, если он передан
    onEscapeKeyDown?.(event);
    
    // Закрываем Select, если событие не было отменено
    if (!event.defaultPrevented && onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-[var(--z-modal-nested)] max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className,
        )}
        position={position}
        onEscapeKeyDown={handleEscapeKeyDown}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className,
      )}
      {...props}
    >
      <span className="absolute right-2 flex size-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon className="size-4" />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "flex cursor-default items-center justify-center py-1",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon className="size-4" />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};