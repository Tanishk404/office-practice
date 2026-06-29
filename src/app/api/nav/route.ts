import { NextResponse } from "next/server";
import { DbConnection } from "@/lib/Db";
import NavMenu from "@/models/NavMenu";

// GET all nav menus
export async function GET(req: Request) {
  try {
    await DbConnection();
    const { searchParams } = new URL(req.url);
    const isAdmin = searchParams.get("admin") === "true";
    const filter = isAdmin ? {} : { isActive: true };
    // sort by order first, then createdAt as tiebreaker so same-order items are stable
    const menus = await NavMenu.find(filter).sort({ order: 1, createdAt: 1 }).lean();
    return NextResponse.json({ success: true, menus: JSON.parse(JSON.stringify(menus)) });
  } catch (err) {
    return NextResponse.json({ success: false, msg: "Failed to fetch nav" }, { status: 500 });
  }
}

// POST — create new nav menu group
// Auto-assigns order = max(existing order) + 1 so new items always go to the end
export async function POST(req: Request) {
  try {
    await DbConnection();
    const body = await req.json();

    // Always compute order server-side for new menus so frontend value is ignored
    const lastMenu = await NavMenu.findOne({}).sort({ order: -1 }).lean();
    body.order = lastMenu ? (lastMenu as any).order + 1 : 0;

    const menu = await NavMenu.create(body);
    return NextResponse.json({ success: true, menu });
  } catch (err) {
    return NextResponse.json({ success: false, msg: "Failed to create" }, { status: 500 });
  }
}