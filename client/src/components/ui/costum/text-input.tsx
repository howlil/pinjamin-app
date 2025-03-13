import { FC } from "react";
import { FormikProps } from "formik";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TextInputProps {
  formik: FormikProps<any>;
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const TextInput: FC<TextInputProps> = ({
  formik,
  name,
  label,
  type = "text",
  placeholder,
  className,
  required = false
}) => {
  const hasError = formik.touched[name] && formik.errors[name];

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[name]}
        className={cn(
          hasError && "border-red-500 focus-visible:ring-red-500",
          className
        )}
      />
      
      {hasError && (
        <p className="text-sm text-red-500">{formik.errors[name] as string}</p>
      )}
    </div>
  );
};

export default TextInput;