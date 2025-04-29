import { FC, ChangeEvent, FocusEvent } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TextAreaInputProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  error?: string;
  rows?: number;
}

const TextAreaInput: FC<TextAreaInputProps> = ({
  name,
  value,
  onChange,
  onBlur,
  label,
  placeholder,
  className,
  required = false,
  error,
  rows = 4
}) => {
  const hasError = !!error;

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <Textarea
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        rows={rows}
        className={cn(
          hasError && "border-red-500 focus-visible:ring-red-500",
          className
        )}
      />
      
      {hasError && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default TextAreaInput;