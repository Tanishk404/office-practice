import { NextResponse } from "next/server";
import { DbConnection } from "@/lib/Db";
import Page from "@/models/Page";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params; // ✅ await lagaya
    await DbConnection();
    const page = await Page.findOne({ slug, isActive: true }).lean();
    if (!page)
      return NextResponse.json({ success: false, msg: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true, page: JSON.parse(JSON.stringify(page)) });
  } catch (err) {
    return NextResponse.json({ success: false, msg: "Failed" }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params; // ✅ await lagaya
    await DbConnection();
    await Page.findOneAndDelete({ slug });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, msg: "Delete failed" }, { status: 500 });
  }
}