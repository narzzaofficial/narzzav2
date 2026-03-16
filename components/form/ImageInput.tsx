import { ImageUpload } from "../admin/ImageUpload";

type ImageInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  buttonText?: string;
  placeholder?: string;
  required?: boolean;
};

export function ImageInput({
  label,
  value,
  onChange,
  buttonText = "Upload Gambar",
  placeholder = "https://picsum.photos/seed/your-seed/800/400",
  required = false,
}: ImageInputProps) {
  return (
    <div>
      <label className="form-label">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <ImageUpload
        currentImageUrl={value}
        onUploadComplete={onChange}
        label=""
        buttonText={buttonText}
      />
      <div className="mt-2">
        <label className="form-label">Atau masukkan URL manual</label>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="form-input"
        />
      </div>
    </div>
  );
}
