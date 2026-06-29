import { NextRequest, NextResponse } from "next/server";
import { DbConnection } from "@/lib/Db";
import { getFromGridFS } from "@/lib/GridFS";


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> } // Promise use karein
) {
  try {
    const { fileId } = await params; // await karein
    await DbConnection();
    const buffer = await getFromGridFS(fileId);

    if (!buffer) {
        return NextResponse.json({ error: "PDF not found in GridFS" }, { status: 404 });
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline",
      },
    });
  } catch (error) {
    console.error("PDF Route Error: ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}