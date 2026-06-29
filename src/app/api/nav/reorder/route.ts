import { NextResponse } from "next/server";
import { DbConnection } from "@/lib/Db";
import NavMenu from "@/models/NavMenu";

// PATCH — drag-drop ke baad sab items ka naya order ek saath save karta hai
export async function PATCH(req: Request) {
  try {
    await DbConnection();
    const body = await req.json();
    const items = body.items as { id: string; order: number }[];

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, msg: "No items to reorder" }, { status: 400 });
    }

    // ✅ sab updates ek saath, parallel — single round-trip
    await Promise.all(
      items.map((item) => NavMenu.findByIdAndUpdate(item.id, { order: item.order }))
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reorder error:", err);
    return NextResponse.json({ success: false, msg: "Reorder failed" }, { status: 500 });
  }
}