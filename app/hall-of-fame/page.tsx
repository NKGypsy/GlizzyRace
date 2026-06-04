"use client";

import useSWR from "swr";
import Link from "next/link";
import { SeasonRecords } from "@/lib/records";

// ─── 2025 Historical Data ────────────────────────────────────────────────────
// To add future years, copy the 2025 block and add a new entry to PAST_SEASONS.
// The first racer in each year's array is treated as the champion.
// ─────────────────────────────────────────────────────────────────────────────
const PAST_SEASONS = [
  {
    year: 2025,
    racers: [
      { name: "Juan",  total: 107 },
      { name: "Ethan", total: 85 },
      { name: "Donte", total: 65 },
      { name: "Harry", total: 63.75 },
      { name: "Mario", total: 17 },
    ],
  },
];

const PLACE_LABELS  = ["🥇", "🥈", "🥉", "4th", "5th", "6th", "7th", "8th"];
const PODIUM_COLORS = ["#FFD700", "#C0C0C0", "#CD7F32", "#7B68EE", "#00CED1"];

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Failed to load records");
    return r.json();
  });

// ─── Record Card ─────────────────────────────────────────────────────────────
function RecordCard({
  icon,
  label,
  name,
  total,
  sublabel,
  color,
}: {
  icon: string;
  label: string;
  name: string;
  total: number;
  sublabel: string;
  color: string;
}) {
  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-2"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: `1px solid ${color}33`,
        boxShadow: `0 0 20px ${color}11`,
      }}
    >
      <div className="flex items-center gap-2">
        <span style={{ fontSize: "18px" }}>{icon}</span>
        <span
          className="font-black uppercase tracking-widest"
          style={{ fontSize: "10px", color: color, letterSpacing: "0.12em" }}
        >
          {label}
        </span>
      </div>
      <div className="flex items-end justify-between">
        <div>
          <div
            className="font-black uppercase tracking-wide"
            style={{ fontSize: "clamp(18px, 4vw, 24px)", color: "white", lineHeight: 1 }}
          >
            {name}
          </div>
          <div
            className="font-mono text-xs mt-1"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            {sublabel}
          </div>
        </div>
        <div className="text-right">
          <span
            className="font-black tabular-nums"
            style={{ fontSize: "clamp(24px, 5vw, 32px)", color, lineHeight: 1 }}
          >
            {total}
          </span>
          <span style={{ fontSize: "18px", marginLeft: "3px" }}>🌭</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HallOfFamePage() {
  const { data: records, error: recordsError, isLoading } =
    useSWR<SeasonRecords>("/api/records", fetcher, { refreshInterval: 30000 });

  return (
    <main
      className="min-h-screen py-10 px-4"
      style={{
        background: "#080814",
        backgroundImage:
          "radial-gradient(ellipse at 20% 20%, rgba(255,215,0,0.05) 0%, transparent 50%), " +
          "radial-gradient(ellipse at 80% 80%, rgba(255,107,53,0.04) 0%, transparent 50%)",
      }}
    >
      <div className="max-w-2xl mx-auto space-y-10">

        {/* ── Back button ── */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-widest transition-all duration-200"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          ← BACK TO LIVE RACE
        </Link>

        {/* ── Header ── */}
        <header className="text-center space-y-2">
          <div style={{ fontSize: "48px" }}>🏛️</div>
          <h1
            className="font-black uppercase leading-none"
            style={{
              fontSize: "clamp(28px, 6vw, 48px)",
              color: "#FFD700",
              textShadow: "0 0 40px rgba(255,215,0,0.4)",
              letterSpacing: "-0.01em",
            }}
          >
            Hall of Fame
          </h1>
          <p
            className="font-mono text-xs tracking-widest"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            LEGENDS OF THE GLIZZY
          </p>
        </header>

        {/* ── 2026 Season Records ── */}
        <section className="space-y-4">
          <div
            className="flex items-center gap-3"
            style={{ borderBottom: "1px solid rgba(255,107,53,0.2)", paddingBottom: "10px" }}
          >
            <span
              className="font-black uppercase tracking-widest"
              style={{ fontSize: "13px", color: "#FF6B35" }}
            >
              🏆 2026 Season Records
            </span>
            <span
              className="font-mono text-xs px-2 py-0.5 rounded"
              style={{
                background: "rgba(34,197,94,0.15)",
                color: "#22c55e",
                border: "1px solid rgba(34,197,94,0.3)",
              }}
            >
              LIVE
            </span>
          </div>

          {isLoading && (
            <div
              className="text-center py-8 font-mono text-xs tracking-widest"
              style={{ color: "rgba(255,255,255,0.25)", animation: "pulse 1.5s infinite" }}
            >
              LOADING RECORDS...
            </div>
          )}

          {recordsError && (
            <div
              className="rounded-xl p-4 text-center"
              style={{
                background: "rgba(255,50,50,0.08)",
                border: "1px solid rgba(255,50,50,0.2)",
              }}
            >
              <p className="text-red-400 text-sm font-bold">Could not load records</p>
              <p className="text-red-300/50 text-xs font-mono mt-1">{recordsError.message}</p>
            </div>
          )}

          {records && !isLoading && (
            <div className="space-y-3">
              {records.mostInDay ? (
                <RecordCard
                  icon="⚡"
                  label="Most Dogs in a Single Day"
                  name={records.mostInDay.name}
                  total={records.mostInDay.total}
                  sublabel={records.mostInDay.date}
                  color="#FF6B35"
                />
              ) : (
                <div
                  className="rounded-xl p-4 text-center font-mono text-xs"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.2)",
                  }}
                >
                  ⚡ Most Dogs in a Day — No submissions yet
                </div>
              )}

              {records.mostInWeek ? (
                <RecordCard
                  icon="📅"
                  label="Most Dogs in a Single Week"
                  name={records.mostInWeek.name}
                  total={records.mostInWeek.total}
                  sublabel={records.mostInWeek.weekLabel}
                  color="#7B68EE"
                />
              ) : (
                <div
                  className="rounded-xl p-4 text-center font-mono text-xs"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.2)",
                  }}
                >
                  📅 Most Dogs in a Week — No submissions yet
                </div>
              )}

              {records.mostInMonth ? (
                <RecordCard
                  icon="🗓️"
                  label="Most Dogs in a Single Month"
                  name={records.mostInMonth.name}
                  total={records.mostInMonth.total}
                  sublabel={records.mostInMonth.monthLabel}
                  color="#00CED1"
                />
              ) : (
                <div
                  className="rounded-xl p-4 text-center font-mono text-xs"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.2)",
                  }}
                >
                  🗓️ Most Dogs in a Month — No submissions yet
                </div>
              )}
            </div>
          )}
        </section>

        {/* ── Past Seasons ── */}
        {[...PAST_SEASONS].reverse().map((season) => {
          const winner = season.racers[0];
          const rest   = season.racers.slice(1);

          return (
            <section key={season.year} className="space-y-4">
              <div
                style={{ borderBottom: "1px solid rgba(255,215,0,0.15)", paddingBottom: "10px" }}
              >
                <span
                  className="font-black uppercase tracking-widest"
                  style={{ fontSize: "13px", color: "rgba(255,215,0,0.7)" }}
                >
                  🏁 {season.year} Season
                </span>
              </div>

              {/* Champion card */}
              <div
                className="rounded-xl p-5 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(255,215,0,0.12) 0%, rgba(255,107,53,0.06) 100%)",
                  border: "1px solid rgba(255,215,0,0.45)",
                  boxShadow: "0 0 40px rgba(255,215,0,0.08)",
                }}
              >
                {/* Shine */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 40%, rgba(255,215,0,0.05) 50%, transparent 60%)",
                  }}
                />
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="font-black uppercase tracking-widest px-2 py-0.5 rounded text-xs"
                    style={{
                      background: "rgba(255,215,0,0.15)",
                      color: "#FFD700",
                      border: "1px solid rgba(255,215,0,0.3)",
                      letterSpacing: "0.12em",
                      fontSize: "9px",
                    }}
                  >
                    Champion
                  </span>
                  <span style={{ fontSize: "22px" }}>👑</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div
                      className="font-black uppercase"
                      style={{
                        fontSize: "clamp(24px, 5vw, 36px)",
                        color: "#FFD700",
                        textShadow: "0 0 20px rgba(255,215,0,0.4)",
                        lineHeight: 1,
                      }}
                    >
                      {winner.name}
                    </div>
                    <div
                      className="font-mono text-xs mt-1"
                      style={{ color: "rgba(255,255,255,0.3)" }}
                    >
                      Final score
                    </div>
                  </div>
                  <div>
                    <span
                      className="font-black tabular-nums"
                      style={{
                        fontSize: "clamp(36px, 7vw, 52px)",
                        color: "#FFD700",
                        textShadow: "0 0 30px rgba(255,215,0,0.5)",
                        lineHeight: 1,
                      }}
                    >
                      {winner.total}
                    </span>
                    <span style={{ fontSize: "24px", marginLeft: "4px" }}>🌭</span>
                  </div>
                </div>
                {/* Full-width gold bar */}
                <div
                  className="w-full rounded-full mt-4 overflow-hidden"
                  style={{ height: "4px", background: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: "100%",
                      background: "#FFD700",
                      boxShadow: "0 0 8px rgba(255,215,0,0.6)",
                    }}
                  />
                </div>
              </div>

              {/* Rest of field */}
              <div className="space-y-2">
                {rest.map((racer, i) => {
                  const place    = i + 1;
                  const label    = PLACE_LABELS[place] ?? `${place + 1}th`;
                  const color    = PODIUM_COLORS[place] ?? "#7B68EE";
                  const barWidth = (racer.total / winner.total) * 100;

                  return (
                    <div
                      key={racer.name}
                      className="rounded-xl p-3"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <div
                        className="grid items-center gap-2 mb-2"
                        style={{ gridTemplateColumns: "2.5rem 1fr 5rem" }}
                      >
                        <div
                          className="text-center font-black"
                          style={{
                            fontSize: place < 3 ? "18px" : "12px",
                            color: place < 3 ? undefined : "rgba(255,255,255,0.4)",
                          }}
                        >
                          {label}
                        </div>
                        <span
                          className="font-black uppercase tracking-wide truncate"
                          style={{ fontSize: "13px", color: "rgba(255,255,255,0.85)" }}
                        >
                          {racer.name}
                        </span>
                        <div className="text-right">
                          <span
                            className="font-black tabular-nums"
                            style={{ fontSize: "18px", color }}
                          >
                            {racer.total}
                          </span>
                          <span style={{ fontSize: "13px" }}> 🌭</span>
                        </div>
                      </div>
                      <div
                        className="w-full rounded-full overflow-hidden"
                        style={{ height: "3px", background: "rgba(255,255,255,0.06)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${barWidth}%`, background: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        <p
          className="text-center font-mono text-xs pb-6"
          style={{ color: "rgba(255,255,255,0.15)" }}
        >
          Records update every 30 seconds · Hot Boi Glizzy Racing League
        </p>
      </div>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </main>
  );
}
