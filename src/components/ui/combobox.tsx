"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type ComboboxOption = {
  value: string;
  label: string;
};

export type ComboboxProps = {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
};

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  className,
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  const filteredOptions = React.useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(term) || option.value.toLowerCase().includes(term)
    );
  }, [options, search]);

  const selected = value ? options.find((opt) => opt.value === value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between w-full text-left font-normal",
            !selected && "text-muted-foreground",
            "cursor-pointer",
            className
          )}
          disabled={disabled}
        >
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className="opacity-50" size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <div className="p-2">
          <Input
            autoFocus
            placeholder={searchPlaceholder}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => event.stopPropagation()}
          />
        </div>
        <div role="listbox" className="max-h-60 overflow-y-auto py-1">
          {filteredOptions.length ? (
            filteredOptions.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  type="button"
                  key={option.value}
                  className={cn(
                    "flex w-full items-center gap-2 px-2 py-1.5 text-sm rounded-sm",
                    "cursor-pointer",
                    isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent"
                  )}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                >
                  <Check className={cn("size-4", isSelected ? "opacity-100" : "opacity-0")} />
                  <span className="truncate text-left">{option.label}</span>
                </button>
              );
            })
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground" role="status">
              {emptyMessage}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
