import type { ChatLine } from "@/types/content";
import { ChatLineInput } from "./ChatLineInput";

type ChatLinesSectionProps = {
  lines: ChatLine[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdateRole: (index: number, role: "q" | "a") => void;
  onUpdateText: (index: number, text: string) => void;
  onUpdateImage: (index: number, image: string) => void;
};

export function ChatLinesSection({
  lines,
  onAdd,
  onRemove,
  onUpdateRole,
  onUpdateText,
  onUpdateImage,
}: ChatLinesSectionProps) {
  return (
    <div className="mt-6">
      <div className="mb-3 flex items-center justify-between">
        <label className="form-label mb-0">Chat Lines (Tanya/Jawab)</label>
        <button
          onClick={onAdd}
          className="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300 dark:bg-slate-700/60 dark:text-slate-300 dark:hover:bg-slate-600/60"
        >
          + Tambah Line
        </button>
      </div>
      <div className="space-y-3">
        {lines.map((line, i) => (
          <ChatLineInput
            key={i}
            line={line}
            index={i}
            onRoleChange={onUpdateRole}
            onTextChange={onUpdateText}
            onImageChange={onUpdateImage}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  );
}
