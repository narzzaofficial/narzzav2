type SelectOption = {
  value: string | number;
  label: string;
};

type SelectInputProps = {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
};

export function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}: SelectInputProps) {
  return (
    <div>
      <label className="form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="form-input"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
