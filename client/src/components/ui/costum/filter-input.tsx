import React, { useState } from "react";
import { Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterInputProps {
  placeholder?: string;
  options?: FilterOption[];
  defaultValue?: string;
  onFilterChange?: (value: string) => void;
  className?: string;
}

export const FilterInput: React.FC<FilterInputProps> = ({
  placeholder = "Filter By",
  options = [],
  defaultValue = "",
  onFilterChange,
  className = "",
}) => {
  const [value, setValue] = useState<string>(defaultValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onFilterChange?.(newValue);
  };

  return (
    <div className={`relative w-64 ${className}`}>
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger>
          <Filter className="h-4 w-4 text-gray-400" />
          <div className="flex items-center justify-between w-full">
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterInput;
