"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { generateUploadSignature } from "@/actions/cloudinary";
import { UploadCloud, Loader2, XCircle } from "lucide-react";

interface Props {
  initialUrl?: string; // For backward compatibility (single image)
  inputName?: string;
  onUploadComplete?: (url: string) => void;
  allowMultiple?: boolean; // New prop to enable multi-drop
}

export function ImageUploader({ initialUrl = "", inputName = "imageUrl", onUploadComplete, allowMultiple = false }: Props) {
  const [imageUrl, setImageUrl] = useState<string>(initialUrl);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setStatus("uploading");

    // Loop through all dropped files (if multiple)
    for (const file of acceptedFiles) {
      try {
        const { timestamp, signature } = await generateUploadSignature();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
        formData.append("signature", signature);
        formData.append("timestamp", timestamp.toString());

        const endpoint = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`;
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          const secureUrl = data.secure_url;
          
          // If singular, update local preview. If multiple, the parent handles the state via callback
          if (!allowMultiple) {
            setImageUrl(secureUrl);
          }
          
          if (onUploadComplete) onUploadComplete(secureUrl);
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    }
    setStatus("success");
    setTimeout(() => setStatus("idle"), 2000); // Reset status after 2s
  }, [onUploadComplete, allowMultiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: allowMultiple,
  });

  return (
    <div className="w-full h-full">
      <div
        {...getRootProps()}
        className={`w-full h-full min-h-[100px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-all relative overflow-hidden bg-surface
        ${isDragActive ? "border-brand bg-accent/5" : "border-border hover:border-brand"}
        ${status === 'error' ? "border-red-500" : ""}`}
      >
        <input {...getInputProps()} />

        {/* If single mode and we have an image, show it. If multiple, we don't show preview here (parent does it) */}
        {!allowMultiple && imageUrl && status !== "uploading" ? (
            <div className="absolute inset-0 p-1">
                <img src={imageUrl} alt="Upload preview" className="w-full h-full object-contain" />
                <div className="absolute top-1 right-1 bg-surface/80 backdrop-blur-sm text-[8px] px-2 py-1 rounded border border-border uppercase font-bold text-foreground">
                    Replace
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center gap-1 text-accent p-4">
                {status === "uploading" ? (
                    <Loader2 className="w-6 h-6 animate-spin text-brand" />
                ) : (
                    <UploadCloud className="w-6 h-6" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest">
                    {status === "uploading" ? "Uploading..." : allowMultiple ? "Add Images" : "Upload Image"}
                </span>
            </div>
        )}
      </div>

      {inputName && !allowMultiple && <input type="hidden" name={inputName} value={imageUrl} />}
    </div>
  );
}