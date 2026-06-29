import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { DbConnection } from "@/lib/Db";
import JournalArticle from "@/models/Article";
import { getFromGridFS } from "@/lib/GridFS";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ volume: string; issue: string; id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, msg: "Invalid article id" },
        { status: 400 }
      );
    }

    await DbConnection();

    const article = await JournalArticle.findById(id).lean();

    if (!article || !(article as any).articlePdfUrl) {
      return NextResponse.json(
        { success: false, msg: "PDF not found for this article" },
        { status: 404 }
      );
    }

    const fileId = (article as any).articlePdfUrl;
    const buffer = await getFromGridFS(fileId);

    if (!buffer) {
      return NextResponse.json(
        { success: false, msg: "PDF not found in GridFS" },
        { status: 404 }
      );
    }

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="article-${id}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("PDF proxy route error:", error);
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
}