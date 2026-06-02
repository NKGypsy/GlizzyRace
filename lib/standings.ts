export interface Racer {
  name: string;
  total: number;
}

export function calculateStandings(rows: string[][]): Racer[] {
  if (rows.length === 0) return [];

  // ─── IMPORTANT: READ THIS BEFORE RUNNING ───────────────────────────────────
  //
  // Your Google Form creates columns in the exact order you added the questions.
  // You MUST update the two numbers below to match YOUR form.
  //
  // HOW TO FIND YOUR COLUMN NUMBERS:
  // 1. Deploy the site and open: https://your-site.vercel.app/api/debug-columns
  // 2. That page will print every column with its number (0, 1, 2, 3...)
  // 3. Find the column that holds the racer's NAME and note its number
  // 4. Find the column that holds DOGS EATEN and note its number
  // 5. Replace the 0s below with those numbers and redeploy
  //
  // Example: if Name is column 2 and Dogs is column 4, write:
  //   const NAME_COLUMN  = 2;
  //   const DOGS_COLUMN  = 4;
  //
  // ───────────────────────────────────────────────────────────────────────────

  const NAME_COLUMN = 2; // <-- CHANGE THIS to your Name column number
  const DOGS_COLUMN = 4; // <-- CHANGE THIS to your Dogs Eaten column number

  // Row 0 is the header row (column titles) — skip it
  const dataRows = rows.slice(1);

  const totals: Record<string, number> = {};

  dataRows.forEach((row) => {
    const name = row[NAME_COLUMN]?.trim();
    const dogsRaw = row[DOGS_COLUMN]?.trim();
    const dogs = parseFloat(dogsRaw) || 0;

    if (!name) return; // skip blank rows

    totals[name] = (totals[name] || 0) + dogs;
  });

  return Object.entries(totals)
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);
}
