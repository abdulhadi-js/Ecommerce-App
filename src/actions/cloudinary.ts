"use server";

import { v2 as cloudinary } from "cloudinary";

// This configures the server-side part of Cloudinary with your secret keys
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Generates a secure signature for a direct upload from the client.
 * This prevents users from needing our API secret in their browser.
 */
export async function generateUploadSignature() {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    {
      timestamp: timestamp,
      // You can add other parameters here for security, e.g., folder
    },
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    timestamp,
    signature,
  };
}