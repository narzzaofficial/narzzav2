import type { ChatLine } from "@/types/content";
import { ImageUpload } from "../admin/ImageUpload";

type ChatLineInputProps = {
  line: ChatLine;
  index: number;
  onRoleChange: (index: number, role: "q" | "a") => void;
  onTextChange: (index: number, text: string) => void;
  onImageChange: (index: number, image: string) => void;
  onRemove: (index: number) => void;
};

export function ChatLineInput({
  line,
  index,
  onRoleChange,
  onTextChange,
  onImageChange,
  onRemove,
}: ChatLineInputProps) {
  return (
    <div className="inner-panel">
      <div className="flex items-start gap-2">
        <select
          value={line.role}
          onChange={(e) => onRoleChange(index, e.target.value as "q" | "a")}
          className="form-input shrink-0 w-auto text-xs"
        >
          <option value="q">Tanya</option>
          <option value="a">Jawab</option>
        </select>
        <input
          value={line.text}
          onChange={(e) => onTextChange(index, e.target.value)}
          placeholder={line.role === "q" ? "Pertanyaan..." : "Jawaban..."}
          className="form-input min-w-0 flex-1"
        />
        <button onClick={() => onRemove(index)} className="btn-danger shrink-0">
          ✕
        </button>
      </div>
      <div className="mt-3">
        <label className="form-label">Gambar (opsional)</label>
        <ImageUpload
          label=""
          buttonText={line.image ? "Ganti Image" : "Set Image"}
          currentImageUrl={line.image || undefined}
          onUploadComplete={(url) => onImageChange(index, url)}
        />
      </div>
    </div>
  );
}
