"use client";

import { RacerWithProjection } from "@/lib/season";

const MEDALS = ["🥇", "🥈", "🥉"];
const HOTDOG_COLORS = [
  "#FF6B35",
  "#FFD700",
  "#FF69B4",
  "#00CED1",
  "#7B68EE",
  "#32CD32",
  "#FF4500",
  "#1E90FF",
];

interface Props {
  standings: RacerWithProjection[];
  percentComplete: number;
}

export default function Leaderboard({ standings, percentComplete }: Props) {
  if (standings.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto text-center text-slate-500 py-8 font-mono text-sm">
        Leaderboard will appear once racers submit their forms.
      </div>
    );
  }

  const leader = standings[0].total || 1;

  return (
    <div
      className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden"
      style={{
        background: "rgba(10,10,25,0.95)",
        border: "1px solid rgba(255,215,0,0.3)",
        boxShadow: "0 0 60px rgba(255,215,0,0.1)",
      }}
    >
      {/* Header */}
      <div
        className="text-center py-4 px-6"
        style={{
          background: "linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,107,53,0.1) 100%)",
          borderBottom: "1px solid rgba(255,215,0,0.2)",
        }}
      >
        <h2
          className="font-black uppercase tracking-widest"
          style={{ fontSize: "18px", color: "#FFD700", letterSpacing: "0.15em" }}
        >
          🏆 Current Standings
        </h2>
        <p className="text-xs font-mono mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
          Season {Math.round(percentComplete)}% complete · Refreshes every 15s
        </p>
      </div>

      {/* Column headers */}
      <div
        className="grid px-4 py-2"
        style={{
          gridTemplateColumns: "2rem 1fr 5rem 6rem",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <span />
        <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>RACER</span>
        <span className="font-mono text-xs text-right" style={{ color: "rgba(255,255,255,0.25)" }}>TOTAL</span>
        <span className="font-mono text-xs text-right" style={{ color: "rgba(255,255,255,0.25)" }}>PROJECTED</span>
      </div>

      {/* Rows */}
      <div className="p-4 space-y-3">
        {standings.map((racer, index) => {
          const medal    = MEDALS[index] ?? null;
          const color    = HOTDOG_COLORS[index % HOTDOG_COLORS.length];
          const barWidth = leader > 0 ? (racer.total / leader) * 100 : 0;

          return (
            <div
              key={racer.name}
              className="rounded-xl p-3 transition-all duration-300"
              style={{
                background: index === 0
                  ? "rgba(255,215,0,0.08)"
                  : "rgba(255,255,255,0.03)",
                border: `1px solid ${index === 0
                  ? "rgba(255,215,0,0.3)"
                  : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <div
                className="grid items-center gap-2 mb-2"
                style={{ gridTemplateColumns: "2rem 1fr 5rem 6rem" }}
              >
                {/* Rank */}
                <div className="font-black text-center" style={{ fontSize: "18px" }}>
                  {medal ?? (
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>
                      #{index + 1}
                    </span>
                  )}
                </div>

                {/* Name */}
                <span
                  className="font-black uppercase tracking-wide truncate"
                  style={{ fontSize: "13px", color: index === 0 ? "#FFD700" : "white" }}
                >
                  {racer.name}
                </span>

                {/* Total */}
                <div className="text-right">
                  <span
                    className="font-black tabular-nums"
                    style={{ fontSize: "20px", color }}
                  >
                    {racer.total}
                  </span>
                  <span style={{ fontSize: "14px" }}> 🌭</span>
                </div>

                {/* Projected */}
                <div className="text-right">
                  <span
                    className="font-bold tabular-nums"
                    style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)" }}
                  >
                    ~{racer.projected}
                  </span>
                  <span
                    className="font-mono text-xs ml-1"
                    style={{ color: "rgba(255,255,255,0.25)" }}
                  >
                    proj
                  </span>
                </div>
              </div>

              {/* Progress bar + pace */}
              <div className="flex items-center gap-2">
                <div
                  className="flex-1 rounded-full overflow-hidden"
                  style={{ height: "3px", background: "rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${barWidth}%`,
                      background: color,
                      boxShadow: `0 0 6px ${color}`,
                    }}
                  />
                </div>
                <span
                  className="font-mono flex-shrink-0"
                  style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)" }}
                >
                  {racer.dogsPerDay.toFixed(2)}/day
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
