"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { Plus, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  initialImage?: string; // To show existing image on Edit page
}

export function ImageUploader({ initialImage }: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState(initialImage || "");

  return (
    <div>
      <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
        Cover Image
      </label>
      
      {/* Hidden input to store the URL for the form */}
      <input type="hidden" name="imageUrl" value={imageUrl} />

      <CldUploadWidget
        uploadPreset="unsigned_preset" // Create an "unsigned" preset in Cloudinary settings
        onSuccess={(result: any) => {
          setImageUrl(result.info.secure_url);
        }}
      >
        {({ open }) => (
          <div
            onClick={() => open()}
            className="w-full aspect-video rounded-md border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {imageUrl ? (
              <img src={imageUrl} alt="Uploaded product" className="h-full w-full object-contain" />
            ) : (
              <div className="text-center text-gray-400">
                <ImageIcon className="mx-auto h-12 w-12" />
                <p className="mt-2 text-sm">Click to upload an image</p>
              </div>
            )}
          </div>
        )}
      </CldUploadWidget>
       <p className="text-[10px] text-gray-400 mt-2">
         * You must create an "unsigned" upload preset in Cloudinary for this to work.
       </p>
    </div>
  );
}