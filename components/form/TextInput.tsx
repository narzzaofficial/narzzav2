type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "url";
  required?: boolean;
};

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: TextInputProps) {
  return (
    <div>
      <label className="form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="form-input"
      />
    </div>
  );
}
