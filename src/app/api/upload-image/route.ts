// app/api/upload-image/route.ts
// Receives image file → uploads to Cloudinary → returns secure_url

import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "Image must be under 2MB" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const url = await new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          public_id: `${Date.now()}-${file.name.split(".")[0].replaceAll(" ", "_")}`,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result?.secure_url || "");
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ success: true, url }, { status: 200 });

  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}