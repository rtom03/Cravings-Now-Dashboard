import { useState } from "react";
import { uploadImageToCloudinary } from "../lib/uploadImage";

export function useImageUpload(onUploaded: (url: string) => void) {
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImageToCloudinary(file);
      onUploaded(imageUrl);
    } catch (err) {
      console.error("Image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return { uploading, handleImageChange };
}
