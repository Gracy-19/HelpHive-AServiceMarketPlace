import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config(); // ✅ load .env first

// ✅ Cloudinary config (with timeout included)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME?.trim(),
  api_key: process.env.CLOUDINARY_API_KEY?.trim(),
  api_secret: process.env.CLOUDINARY_API_SECRET?.trim(),
  timeout: 60000, // ✅ 60 sec timeout (fixes 499)
});

console.log("🌤️ Cloudinary initialized:", cloudinary.config().cloud_name);

export function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    // ✅ Auto-select resource type (image or raw)
    const finalOptions = {
      resource_type: options.resource_type || detectResourceType(buffer),
      timeout: 60000, // ✅ ensure long timeout
      ...options,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      finalOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

/* --------------------------------------------------
 ✅ Detect resource type: image vs raw (PDF, DOCX, etc)
---------------------------------------------------*/
function detectResourceType(buffer) {
  const header = buffer.toString("utf8", 0, 4);

  // ✅ PNG/JPG/JPEG/GIF
  if (
    header.startsWith("\x89PNG") ||
    header.startsWith("\xFF\xD8") ||
    header.startsWith("GIF8")
  ) {
    return "image";
  }

  // ✅ PDFs always start with "%PDF"
  if (header.startsWith("%PDF")) return "raw";

  // ✅ DOCX/ZIP start with "PK"
  if (header.startsWith("PK")) return "raw";

  // ✅ Fallback
  return "raw";
}
