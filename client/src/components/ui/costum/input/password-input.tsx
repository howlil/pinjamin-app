import { useState, ChangeEvent, FocusEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PasswordInputProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  minLength?: number;
  required?: boolean;
  error?: string;
}

const PasswordInput = ({
  name,
  value,
  onChange,
  onBlur,
  label,
  placeholder = "Min. 8 characters",
  className,
  minLength = 8,
  required = false,
  error
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const hasError = !!error;

  return (
    <div >
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative mt-2 ">
        <Input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          placeholder={placeholder}
          className={cn(
            "pr-10",
            hasError && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          minLength={minLength}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {hasError && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

export default PasswordInput;