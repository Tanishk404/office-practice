import { NextResponse } from "next/server";
import { DbConnection } from "@/lib/Db";
import NavMenu from "@/models/NavMenu";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ✅ await
    await DbConnection();
    const body = await req.json();
    const updated = await NavMenu.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, menu: updated });
  } catch (err) {
    return NextResponse.json({ success: false, msg: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // ✅ await
    await DbConnection();
    await NavMenu.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: false, msg: "Delete failed" }, { status: 500 });
  }
}