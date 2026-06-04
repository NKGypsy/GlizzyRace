import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";
import { calculateRecords } from "@/lib/records";

export async function GET() {
  try {
    const rows    = await getSheetData();
    const records = calculateRecords(rows);
    return NextResponse.json(records);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Records API error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}