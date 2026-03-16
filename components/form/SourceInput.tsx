type SourceInputProps = {
  label?: string;
  titleValue: string;
  urlValue: string;
  onTitleChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  titlePlaceholder?: string;
  urlPlaceholder?: string;
};

export function SourceInput({
  label = "Sumber (Opsional)",
  titleValue,
  urlValue,
  onTitleChange,
  onUrlChange,
  titlePlaceholder = "Nama sumber (contoh: Kompas.com)",
  urlPlaceholder = "URL sumber (contoh: https://...)",
}: SourceInputProps) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          value={titleValue}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder={titlePlaceholder}
          className="form-input"
        />
        <input
          type="url"
          value={urlValue}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder={urlPlaceholder}
          className="form-input"
        />
      </div>
    </div>
  );
}
