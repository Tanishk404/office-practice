import { NextRequest, NextResponse } from "next/server";
import { DbConnection } from "@/lib/Db";
import JournalArticle from "@/models/Article";
import { uploadToGridFS } from "@/lib/GridFS";

// ✅ Confirmed against your existing /api/articles/route.ts (POST/GET) —
// import path matches exactly.

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await DbConnection();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, msg: "Article id is required" }, { status: 400 });
    }

    const deleted = await JournalArticle.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, msg: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, msg: "Article deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Article DELETE Error:", error);
    return NextResponse.json(
      { success: false, msg: error.message },
      { status: 500 }
    );
  }
}











export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // Type must be Promise
) {
  try {
    await DbConnection();
    
    // You MUST await the params here
    const { id } = await params;

    const article = await JournalArticle.findById(id);

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: article },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}










export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await DbConnection();
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, msg: "Article id is required" }, { status: 400 });
    }
    const formData = await request.formData();
    const articleDetailsStr = formData.get("articleDetails") as string;
    if (!articleDetailsStr) {
      return NextResponse.json({ success: false, error: "Metadata missing" }, { status: 400 });
    }
    const articlePayload = JSON.parse(articleDetailsStr);

    const articlePdfFile = formData.get("articlePdf") as File | null;
    if (articlePdfFile && articlePdfFile.size > 0) {
      const mainPdfId = await uploadToGridFS(articlePdfFile, "journal_articles");
      articlePayload.articlePdfUrl = mainPdfId;
    }

    const supplementaryPdfFile = formData.get("supplementaryPdf") as File | null;
    if (supplementaryPdfFile && supplementaryPdfFile.size > 0) {
      const suppPdfId = await uploadToGridFS(supplementaryPdfFile, "journal_supplementary");
      articlePayload.supplementaryPdfUrl = suppPdfId;
    }

    const updated = await JournalArticle.findByIdAndUpdate(
      id,
      { $set: articlePayload },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, msg: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Article updated successfully!", data: updated }, { status: 200 });
  } catch (error: any) {
    console.error("Article PUT Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

