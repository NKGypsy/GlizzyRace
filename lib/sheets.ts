export async function getSheetData(): Promise<string[][]> {
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    throw new Error("GOOGLE_SHEET_ID is missing from your .env.local file");
  }

  // Fetches the sheet as a plain CSV file — no API key needed
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=2138945325`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(
      `Could not load Google Sheet. Status: ${res.status}. Make sure the sheet is shared as "Anyone with the link can view".`
    );
  }

  const text = await res.text();

  // Parse CSV into a 2D array of strings
  // Handles quoted fields (e.g. "Smith, John") correctly
  const rows = text.trim().split("\n").map((line) => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });

  return rows;
}
