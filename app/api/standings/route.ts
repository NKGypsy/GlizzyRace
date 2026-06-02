import { NextResponse } from "next/server";
import { getSheetData } from "@/lib/sheets";
import { calculateStandings } from "@/lib/standings";

export async function GET() {
  try {
    const rows = await getSheetData();
    const standings = calculateStandings(rows);
    return NextResponse.json(standings);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Standings API error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
