"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { generateUploadSignature } from "@/actions/cloudinary";
import { UploadCloud, Loader2, CheckCircle, XCircle } from "lucide-react";

interface Props {
  // We can pass an existing URL to show a preview (for the "Edit" page)
  initialUrl?: string;
  // The 'name' of the hidden input field for the form
  inputName?: string;
}

export function ImageUploader({ initialUrl = "", inputName = "imageUrl" }: Props) {
  const [imageUrl, setImageUrl] = useState<string>(initialUrl);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setStatus("uploading");

    try {
      // 1. Get the signature from our server action
      const { timestamp, signature } = await generateUploadSignature();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp.toString());

      // 2. Upload directly to Cloudinary
      const endpoint = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!}/image/upload`;
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.secure_url);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`w-full aspect-video border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-colors
        ${isDragActive ? "border-primary bg-primary/10" : "border-gray-300 hover:border-primary"}
        ${imageUrl ? "border-green-500" : ""}`}
      >
        <input {...getInputProps()} />

        {status === "uploading" && (
          <div className="flex flex-col items-center gap-2 text-muted-foreground animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span>Uploading...</span>
          </div>
        )}

        {status !== "uploading" && !imageUrl && (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <UploadCloud className="w-8 h-8" />
            <span>{isDragActive ? "Drop the file here..." : "Drag & drop or click to upload"}</span>
            <p className="text-xs">PNG, JPG up to 5MB</p>
          </div>
        )}
        
        {imageUrl && status !== "uploading" && (
            <div className="p-4 relative w-full h-full">
                <img src={imageUrl} alt="Upload preview" className="w-full h-full object-contain rounded-md" />
            </div>
        )}
      </div>

      {status === "error" && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
            <XCircle className="w-4 h-4" />
            <span>Upload failed. Please try again.</span>
        </div>
      )}
      
      {/* This hidden input will hold the final URL for the form submission */}
      <input type="hidden" name={inputName} value={imageUrl} />
    </div>
  );
}