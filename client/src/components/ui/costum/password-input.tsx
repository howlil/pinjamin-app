import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormikProps } from "formik";
import { cn } from "@/lib/utils";

interface PasswordInputProps {
  formik: FormikProps<any>;
  name: string;
  label?: string;
  placeholder?: string;
  className?: string;
  minLength?: number;
  required?: boolean;
}

const PasswordInput = ({
  formik,
  name,
  label,
  placeholder = "Min. 8 characters",
  className,
  minLength = 8,
  required = false
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const hasError = formik.touched[name] && formik.errors[name];

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[name]}
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
        <p className="text-sm text-red-500">{formik.errors[name] as string}</p>
      )}
    </div>
  );
};

export default PasswordInput;