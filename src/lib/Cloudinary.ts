import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─────────────────────────────────────────────────────────────────────────────
// ORIGINAL FUNCTION — bilkul UNCHANGED hai. Jo bhi forms/APIs isko already
// use kar rahe hain (PDF/docs upload ke liye), unka behavior exactly same
// rahega. Isse koi chhed-chhad nahi ki gayi hai.
// ─────────────────────────────────────────────────────────────────────────────
async function uploadToCloudinary(file: File, folderName: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: "image",
         // PDF, docs etc. ke liye 'raw' hona mandatory hai
        public_id: `${Date.now()}-${file.name.split(".")[0].replaceAll(" ", "_")}`,
        format: "pdf"
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload loop failed:", error);
          return reject(error);
        }
        resolve(result?.secure_url?.replace('/upload/', '/upload/fl_attachment:false/') || "");
      }
    );

    uploadStream.end(buffer);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW FUNCTION — sirf images (jpg/png/webp) ke liye, jaise homepage cover
// image ya indexing logos. Ismein "format: pdf" force nahi kiya gaya, isliye
// Cloudinary image ko uske original format mein hi store/serve karega, aur
// <img> tag mein preview/render sahi se chalega.
//
// Yeh function purane uploadToCloudinary se bilkul alag/independent hai,
// isliye purane callers (jo PDF/docs ke liye use kar rahe hain) par koi
// asar nahi padega.
// ─────────────────────────────────────────────────────────────────────────────
export async function uploadImageToCloudinary(file: File, folderName: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        resource_type: "image",
        public_id: `${Date.now()}-${file.name.split(".")[0].replaceAll(" ", "_")}`,
        // format yahan intentionally nahi diya — Cloudinary file ke actual
        // type (jpg/png/webp) se khud detect karega
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary image upload failed:", error);
          return reject(error);
        }
        resolve(result?.secure_url || "");
      }
    );

    uploadStream.end(buffer);
  });
}

export default uploadToCloudinary;