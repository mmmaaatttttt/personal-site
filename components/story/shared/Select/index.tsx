import { FC, ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";

interface Option {
  value: string;
  label: string;
}

interface SelectProps<T extends Option> {
  name: string;
  value: string;
  onChange: (option: T) => void;
  options: T[];
  placeholder?: string;
  className?: string;
}

const Select = <T extends Option>({
  name,
  value,
  onChange,
  options,
  placeholder,
  className,
}: SelectProps<T>) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = options.find(o => o.value === e.target.value);
    if (selected) onChange(selected);
  };

  return (
    <div className={`relative group ${className}`}>
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        className="block w-full appearance-none bg-white border-2 border-gray-200 hover:border-gray-300 px-4 py-2 pr-10 rounded-xl text-sm font-medium text-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400 group-hover:text-gray-500 transition-colors">
        <ChevronDown size={18} strokeWidth={2.5} />
      </div>
    </div>
  );
};

export default Select;
