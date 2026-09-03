import { Upload } from "lucide-react";
import { useRef } from "react";

export default function MainImageUpload({
  imageUrl,
  onChange,
  onDelete,
}: {
  imageUrl: string | null;
  onChange: (url: string) => void;
  onDelete: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    onChange(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-3">
      <p className="text-[13px] font-medium text-slate-300">Main image</p>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files[0]);
        }}
        className="mx-auto flex w-40 cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-white/15 bg-[#12151b] p-3 text-center transition hover:border-sky-500/40"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Product"
            className="h-28 w-full rounded-md object-cover"
          />
        ) : (
          <div className="flex h-28 w-full items-center justify-center rounded-md bg-white/[0.03]">
            <Upload size={20} className="text-slate-600" />
          </div>
        )}
      </div>

      <div className="text-center">
        {imageUrl && (
          <button
            onClick={onDelete}
            className="text-[12.5px] font-medium text-rose-400 hover:text-rose-300"
          >
            Delete
          </button>
        )}
        <p className="text-[12px] text-slate-500">Click or drag to change</p>
      </div>

      <div className="space-y-0.5 text-center text-[11.5px] text-slate-500">
        <p>Recommended ratio 4:5 (Width to height)</p>
        <p>Recommended size: 1080 width x 1350 height</p>
        <p>Max image size: 2.5 MB</p>
        <p>Applies to all images</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
