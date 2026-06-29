import { NextRequest, NextResponse } from "next/server";
import { DbConnection } from "@/lib/Db";
import Homepage from "@/models/Homepage";
import JournalArticle from "@/models/Article"; // ✅ FIX: model register karne ke liye import zaroori (populate ke liye)

function sanitizePayload(payload: any) {
  return {
    ...payload,
    ...(payload.indexing && {
      indexing: payload.indexing.filter(
        (item: { name?: string }) => item.name && item.name.trim() !== ""
      ),
    }),
    // ✅ FIX: jin mostPopular entries mein articleId nahi hai, unko save hi mat karo
    ...(payload.mostPopular && {
      mostPopular: payload.mostPopular.filter(
        (item: { articleId?: string }) => !!item.articleId
      ),
    }),
  };
}

// ─── GET: ab mostPopular.articleId ko real article data ke saath populate karega ──


export async function GET(req: NextRequest) {
  try {
    await DbConnection();

    const { searchParams } = new URL(req.url);
    const shouldPopulate = searchParams.get("populate") === "true";

    let query = Homepage.findOne();

    // ✅ FIX: ?populate=true hone par mostPopular.articleId ko real article
    // data se populate karo — /current page aur homepage dono ke liye zaroori hai
    if (shouldPopulate) {
      query = query.populate({
        path: "mostPopular.articleId",
        select: "articleTitle articleType abstract volume issue journalTitle",
      });
    }

    const doc = await query.lean();

    if (!doc) {
      return NextResponse.json({ success: false, msg: "No homepage data found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, data: JSON.parse(JSON.stringify(doc)) },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Homepage GET error:", error);
    return NextResponse.json(
      { success: false, msg: error.message || "Server error" },
      { status: 500 }
    );
  }
}

// ── Baaki methods (PUT/POST/etc.) apne existing file se copy karo ──
// Yahan sirf GET fix kiya gaya hai

// ─── POST: Create homepage data (first time) ──────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    await DbConnection();
    const payload = sanitizePayload(await request.json());

    const existing = await Homepage.findOne();
    if (existing) {
      const updated = await Homepage.findByIdAndUpdate(existing._id, payload, {
        returnDocument: "after",
        runValidators: true,
      });
      return NextResponse.json({ success: true, msg: "Homepage updated!", data: updated }, { status: 200 });
    }

    const newDoc = await Homepage.create(payload);
    return NextResponse.json({ success: true, msg: "Homepage created!", data: newDoc }, { status: 201 });

  } catch (error: any) {
    console.error("Homepage POST Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await DbConnection();
    const payload = sanitizePayload(await request.json());

    const doc = await Homepage.findOne();
    if (!doc) {
      const newDoc = await Homepage.create(payload);
      return NextResponse.json({ success: true, msg: "Homepage created!", data: newDoc }, { status: 201 });
    }

    const updated = await Homepage.findByIdAndUpdate(doc._id, payload, {
      returnDocument: "after",
      runValidators: true,
    });
    return NextResponse.json({ success: true, msg: "Homepage updated!", data: updated }, { status: 200 });

  } catch (error: any) {
    console.error("Homepage PUT Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}