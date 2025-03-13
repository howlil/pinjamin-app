import { FC } from "react";
import { FormikProps } from "formik";
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
  formik: FormikProps<any>;
  name: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  className?: string;
  required?: boolean;
}

const SelectInput: FC<SelectInputProps> = ({
  formik,
  name,
  label,
  placeholder = "Select an option",
  options,
  className,
  required = false
}) => {
  const handleChange = (value: string) => {
    formik.setFieldValue(name, value);
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

      <Select
        name={name}
        onValueChange={handleChange}
        value={formik.values[name]}
        onOpenChange={() => {
          if (!formik.touched[name]) {
            formik.setFieldTouched(name, true);
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
        <p className="text-sm text-red-500">{formik.errors[name] as string}</p>
      )}
    </div>
  );
};

export default SelectInput;