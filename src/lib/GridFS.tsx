import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { Readable } from "stream";

export async function uploadToGridFS(file: File, folderName: string): Promise<string> {
  const db = mongoose.connection.db !;
  const bucket = new GridFSBucket(db, { bucketName: "pdfs" });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${folderName}/${Date.now()}-${file.name.replaceAll(" ", "_")}`;

  return new Promise((resolve, reject) => {
    const readable = Readable.from(buffer);
    const uploadStream = bucket.openUploadStream(fileName);

    readable.pipe(uploadStream);
    uploadStream.on("finish", () => resolve(uploadStream.id.toString()));
    uploadStream.on("error", reject);
  });
}

export async function getFromGridFS(fileId: string): Promise<Buffer> {
  const db = mongoose.connection.db!;
  const bucket = new GridFSBucket(db, { bucketName: "pdfs" });
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(fileId)
    );
    downloadStream.on("data", (chunk) => chunks.push(chunk));
    downloadStream.on("end", () => resolve(Buffer.concat(chunks)));
    downloadStream.on("error", reject);
  });
}