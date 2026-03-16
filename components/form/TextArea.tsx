type TextAreaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
};

export function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 2,
  required = false,
}: TextAreaProps) {
  return (
    <div>
      <label className="form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="form-input"
      />
    </div>
  );
}
