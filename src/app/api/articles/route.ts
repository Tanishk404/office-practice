import { NextRequest, NextResponse } from "next/server";
import { DbConnection } from "@/lib/Db";
import JournalArticle from "@/models/Article";
import { uploadToGridFS } from "@/lib/GridFS";

export async function POST(request: Request) {
  try {
    await DbConnection();

    const formData = await request.formData();

    // 1. Meta Data
    const articleDetailsStr = formData.get("articleDetails") as string;
    if (!articleDetailsStr) {
      return NextResponse.json({ success: false, error: "Metadata missing" }, { status: 400 });
    }
    const articlePayload = JSON.parse(articleDetailsStr);

    // 2. Files
    const articlePdfFile = formData.get("articlePdf") as File | null;
    const supplementaryPdfFile = formData.get("supplementaryPdf") as File | null;

    if (!articlePdfFile) {
      return NextResponse.json({ success: false, error: "Main Article PDF is required" }, { status: 400 });
    }

    // 3. Upload to MongoDB GridFS
    console.log("Uploading to MongoDB GridFS...");

    const mainPdfId = await uploadToGridFS(articlePdfFile, "journal_articles");
    articlePayload.articlePdfUrl = mainPdfId;

    if (supplementaryPdfFile && supplementaryPdfFile.size > 0) {
      const suppPdfId = await uploadToGridFS(supplementaryPdfFile, "journal_supplementary");
      articlePayload.supplementaryPdfUrl = suppPdfId;
    }

    // 4. Save to DB
    const newArticle = await JournalArticle.create(articlePayload);

    return NextResponse.json(
      { success: true, message: "Successfully saved!", data: newArticle },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


export async function GET(req:NextRequest){
  try {
    await DbConnection()
    const user = await JournalArticle.find().sort({ displayOrder: 1, createdAt: 1 })
    console.log(user)

    if(!user){
      return NextResponse.json(
        {msg: 'User data is not find'},
        {status: 402}
      )
    }

    
    return NextResponse.json(
        {msg: 'We get the user data', user},
        {status: 200}
      )

  } catch (error) {
    console.log(error)
        return NextResponse.json(
        {msg: 'Something went wrong, Server error'},
        {status: 500}
      )
  }
}






export async function PATCH(req: NextRequest) {
  try {
    await DbConnection();
    const { items } = await req.json();
    if (!Array.isArray(items)) {
      return NextResponse.json({ success: false, msg: "items array required" }, { status: 400 });
    }
    await Promise.all(
      items.map(({ id, order }: { id: string; order: number }) =>
        JournalArticle.findByIdAndUpdate(id, { displayOrder: order })
      )
    );
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("PATCH /api/articles error:", error);
    return NextResponse.json({ success: false, msg: error.message }, { status: 500 });
  }
}
 