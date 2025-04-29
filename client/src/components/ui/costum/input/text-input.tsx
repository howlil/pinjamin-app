import { FC, ChangeEvent, FocusEvent } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TextInputProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
  error?: string;
}

const TextInput: FC<TextInputProps> = ({
  name,
  value,
  onChange,
  onBlur,
  label,
  type = "text",
  placeholder,
  className,
  required = false,
  error,
}) => {
  const hasError = !!error;

  return (
    <div>
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="mt-2">
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          className={cn(
            hasError && "border-red-500  focus-visible:ring-red-500",
            className
          )}
        />
      </div>

      {hasError && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default TextInput;
