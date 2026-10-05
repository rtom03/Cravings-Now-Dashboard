import { Loader2, Plus } from "lucide-react";
import { useImageUpload } from "../../hooks/useImageUpload";

interface ImageUploadBoxProps {
  image?: string | null;
  onUploaded: (url: string) => void;
  size?: number; // px — defaults to the 56px (h-14 w-14) used elsewhere
}

export function ImageUploadBox({
  image,
  onUploaded,
  size = 56,
}: ImageUploadBoxProps) {
  const { uploading, handleImageChange } = useImageUpload(onUploaded);

  return (
    <label className="cursor-pointer">
      <div
        className="relative overflow-hidden rounded-md border border-white/10 bg-white/5"
        style={{ height: size, width: size }}
      >
        {uploading ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 size={18} className="animate-spin text-sky-400" />
          </div>
        ) : image ? (
          <img src={image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
            <Plus />
          </div>
        )}
      </div>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploading}
        onChange={handleImageChange}
      />
    </label>
  );
}
