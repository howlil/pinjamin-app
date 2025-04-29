import { FC } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectInputProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
  required?: boolean;
  error?: string;
}

const SelectInput: FC<SelectInputProps> = ({
  name,
  value,
  onChange,
  onBlur,
  label,
  placeholder = "Select an option",
  options,
  className,
  required = false,
  error
}) => {
  const handleValueChange = (newValue: string) => {
    onChange(newValue);
  };

  const hasError = !!error;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <Select
        name={name}
        onValueChange={handleValueChange}
        value={value}
        onOpenChange={(open) => {
          if (!open && onBlur) {
            onBlur();
          }
        }}
      >
        <SelectTrigger 
          id={name}
          className={cn(
            hasError && "border-red-500 focus-visible:ring-red-500",
            className
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasError && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default SelectInput;