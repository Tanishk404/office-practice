import { NextResponse } from "next/server";
import { DbConnection } from "@/lib/Db";
import Page from "@/models/Page";

export async function GET() {
  try {
    await DbConnection();
    const pages = await Page.find().lean();
    return NextResponse.json({ success: true, pages: JSON.parse(JSON.stringify(pages)) });
  } catch (err) {
    console.error("GET /api/pages error:", err);
    return NextResponse.json({ success: false, msg: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await DbConnection();
    const body = await req.json();
    const page = await Page.create(body);  // ✅ POST = sirf naya create
    return NextResponse.json({ success: true, page });
  } catch (err) {
    console.error("POST /api/pages error:", err);
    return NextResponse.json({ success: false, msg: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await DbConnection();
    const body = await req.json();
    const { _id, ...updateData } = body;  // ✅ _id alag karo

    if (!_id) {
      return NextResponse.json({ success: false, msg: "_id required" }, { status: 400 });
    }

    const page = await Page.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { returnDocument: "after" }
    );

    if (!page) {
      return NextResponse.json({ success: false, msg: "Page not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, page });
  } catch (err) {
    console.error("PUT /api/pages error:", err);
    return NextResponse.json({ success: false, msg: "Failed" }, { status: 500 });
  }
}