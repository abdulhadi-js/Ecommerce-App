"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState, useEffect } from "react";
import { ImagePlus, Trash } from "lucide-react";

interface ImageUploadProps {
  initialUrls?: string[]; // Optional initial URLs for the Edit page
  onChange: (urls: string[]) => void;
}

export default function ImageUpload({ initialUrls = [], onChange }: ImageUploadProps) {
  const [urls, setUrls] = useState<string[]>(initialUrls);

  // When initialUrls prop changes (on the Edit page), update the state
  useEffect(() => {
    setUrls(initialUrls);
  }, [initialUrls]);

  const onUpload = (result: any) => {
    const newUrl = result.info.secure_url;
    const newUrls = [...urls, newUrl];
    setUrls(newUrls);
    onChange(newUrls); // Pass all URLs up to the parent form
  };

  const onRemove = (urlToRemove: string) => {
    const newUrls = urls.filter((url) => url !== urlToRemove);
    setUrls(newUrls);
    onChange(newUrls); // Pass updated URLs up
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {urls.map((url) => (
          <div key={url} className="relative w-48 h-48 rounded-md overflow-hidden border">
            <div className="absolute top-1 right-1 z-10">
              <button
                type="button"
                onClick={() => onRemove(url)}
                className="p-1.5 bg-red-600 text-white rounded-full shadow-md hover:bg-red-700"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
            <img className="object-cover w-full h-full" alt="Image" src={url} />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="unsigned_preset_name">
        {({ open }) => {
          const onClick = (e: React.MouseEvent) => {
            e.preventDefault();
            open();
          };
          return (
            <button
              type="button"
              className="flex items-center gap-2 border border-dashed p-4 rounded-md text-sm text-gray-500 hover:border-black hover:text-black transition"
              onClick={onClick}
            >
              <ImagePlus className="h-4 w-4" />
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
}