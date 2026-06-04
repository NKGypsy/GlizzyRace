export const NAME_COLUMN      = 2;
export const DOGS_COLUMN      = 4;
export const TIMESTAMP_COLUMN = 0;

export interface DayRecord {
  name: string;
  total: number;
  date: string;
}

export interface WeekRecord {
  name: string;
  total: number;
  weekLabel: string;
}

export interface MonthRecord {
  name: string;
  total: number;
  monthLabel: string;
}

export interface SeasonRecords {
  mostInDay:   DayRecord   | null;
  mostInWeek:  WeekRecord  | null;
  mostInMonth: MonthRecord | null;
}

function parseTimestamp(raw: string): Date | null {
  if (!raw) return null;
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return d;
  const match = raw.match(/(\d+)\/(\d+)\/(\d+)/);
  if (match) {
    const [, a, b, c] = match;
    return new Date(`${c}-${a.padStart(2, "0")}-${b.padStart(2, "0")}`);
  }
  return null;
}

function toDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toWeekKey(d: Date): string {
  const tmp = new Date(d);
  tmp.setHours(0, 0, 0, 0);
  tmp.setDate(tmp.getDate() - ((tmp.getDay() + 6) % 7));
  return toDateKey(tmp);
}

function toMonthKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatWeek(mondayStr: string): string {
  const monday = new Date(mondayStr + "T00:00:00");
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(monday)} – ${fmt(sunday)}`;
}

function formatMonth(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function calculateRecords(rows: string[][]): SeasonRecords {
  if (rows.length < 2) {
    return { mostInDay: null, mostInWeek: null, mostInMonth: null };
  }

  const dataRows = rows.slice(1);

  const dayTotals:   Record<string, number> = {};
  const weekTotals:  Record<string, number> = {};
  const monthTotals: Record<string, number> = {};

  dataRows.forEach((row) => {
    const name    = row[NAME_COLUMN]?.trim();
    const dogsRaw = row[DOGS_COLUMN]?.trim();
    const tsRaw   = row[TIMESTAMP_COLUMN]?.trim();
    const dogs    = parseFloat(dogsRaw) || 0;

    if (!name || !tsRaw || dogs === 0) return;

    const date = parseTimestamp(tsRaw);
    if (!date) return;

    const dayKey   = `${toDateKey(date)}|${name}`;
    const weekKey  = `${toWeekKey(date)}|${name}`;
    const monthKey = `${toMonthKey(date)}|${name}`;

    dayTotals[dayKey]     = (dayTotals[dayKey]   || 0) + dogs;
    weekTotals[weekKey]   = (weekTotals[weekKey]  || 0) + dogs;
    monthTotals[monthKey] = (monthTotals[monthKey]|| 0) + dogs;
  });

  function findMax(totals: Record<string, number>) {
    let best: { key: string; total: number } | null = null;
    for (const [key, total] of Object.entries(totals)) {
      if (!best || total > best.total) best = { key, total };
    }
    return best;
  }

  const bestDay   = findMax(dayTotals);
  const bestWeek  = findMax(weekTotals);
  const bestMonth = findMax(monthTotals);

  const mostInDay: DayRecord | null = bestDay ? {
    name:  bestDay.key.split("|")[1],
    total: bestDay.total,
    date:  formatDate(new Date(bestDay.key.split("|")[0] + "T00:00:00")),
  } : null;

  const mostInWeek: WeekRecord | null = bestWeek ? {
    name:      bestWeek.key.split("|")[1],
    total:     bestWeek.total,
    weekLabel: formatWeek(bestWeek.key.split("|")[0]),
  } : null;

  const mostInMonth: MonthRecord | null = bestMonth ? {
    name:       bestMonth.key.split("|")[1],
    total:      bestMonth.total,
    monthLabel: formatMonth(bestMonth.key.split("|")[0]),
  } : null;

  return { mostInDay, mostInWeek, mostInMonth };
}