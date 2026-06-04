"use client";

import { motion } from "framer-motion";
import { RacerWithProjection } from "@/lib/season";

const KART_EMOJIS  = ["🏎️", "🚗", "🚕", "🛻", "🚙", "🏍️", "🛵", "🚐"];
const LANE_COLORS  = [
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
  racers: RacerWithProjection[];
}

export default function RaceTrack({ racers }: Props) {
  if (racers.length === 0) {
    return (
      <div
        className="flex items-center justify-center h-32 rounded-2xl font-mono text-sm"
        style={{
          background: "rgba(10,10,25,0.95)",
          border: "1px solid rgba(255,255,255,0.06)",
          color: "rgba(255,255,255,0.25)",
        }}
      >
        No racers yet — waiting for submissions...
      </div>
    );
  }

  const leaderTotal = Math.max(...racers.map((r) => r.total), 1);

  return (
    <div
      className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden"
      style={{
        background: "rgba(10,10,25,0.95)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <span
          className="font-black uppercase tracking-widest"
          style={{ fontSize: "11px", color: "#FFD700", letterSpacing: "0.15em" }}
        >
          🏁 Live Race Track
        </span>
        <span
          className="font-mono text-xs"
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
           {racers.length > 1 && racers[1].total < leaderTotal
            ? `${leaderTotal - racers[1].total} 🌭 behind the lead`
            : "Tied for the lead"}
        </span>
      </div>

      {/* Lanes */}
      <div className="p-4 space-y-3">
        {racers.map((racer, i) => {
          const color    = LANE_COLORS[i % LANE_COLORS.length];
          const kart     = KART_EMOJIS[i % KART_EMOJIS.length];
          const progress = leaderTotal > 0 ? racer.total / leaderTotal : 0;

          // Kart sits at the end of the filled bar.
          // We clamp between 0 and ~88% so the kart bubble stays visible.
          const KART_WIDTH_PC = 10; // approximate width of kart bubble as % of track
          const kartLeft = Math.max(0, Math.min(progress * (100 - KART_WIDTH_PC), 100 - KART_WIDTH_PC));

          return (
            <div key={racer.name}>
              {/* Racer label row */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="font-black uppercase tracking-wide"
                    style={{ fontSize: "11px", color }}
                  >
                    {i === 0 ? "👑 " : `#${i + 1} `}
                    {racer.name}
                  </span>
                </div>
                <span
                  className="font-black tabular-nums font-mono"
                  style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}
                >
                  {racer.total} 🌭
                </span>
              </div>

              {/* Track lane */}
              <div
                className="relative w-full rounded-full overflow-visible"
                style={{
                  height: "28px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Filled progress bar */}
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${color}33 0%, ${color}66 100%)`,
                    borderRight: `2px solid ${color}`,
                  }}
                  animate={{ width: `${Math.max(progress * 100, 2)}%` }}
                  transition={{ type: "spring", stiffness: 40, damping: 18 }}
                />

                {/* Dashed centre line */}
                <div
                  className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none"
                  style={{ paddingLeft: "4px", paddingRight: "4px" }}
                >
                  <div
                    className="w-full"
                    style={{
                      height: "1px",
                      background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0px, rgba(255,255,255,0.08) 6px, transparent 6px, transparent 12px)",
                    }}
                  />
                </div>

                {/* Finish line at right edge */}
                <div
                  className="absolute right-0 top-0 bottom-0 w-3 rounded-r-full overflow-hidden flex flex-col"
                  style={{ gap: "0" }}
                >
                  {Array.from({ length: 7 }).map((_, j) => (
                    <div
                      key={j}
                      style={{
                        flex: 1,
                        background: j % 2 === 0 ? "rgba(255,255,255,0.25)" : "transparent",
                      }}
                    />
                  ))}
                </div>

                {/* Kart marker */}
                <motion.div
                  className="absolute top-0 bottom-0 flex items-center"
                  animate={{ left: `${kartLeft}%` }}
                  transition={{ type: "spring", stiffness: 40, damping: 18 }}
                  style={{ zIndex: 10 }}
                >
                  <div
                    className="flex items-center gap-1 px-1.5 rounded-lg"
                    style={{
                      background: "rgba(8,8,20,0.95)",
                      border: `1.5px solid ${color}`,
                      boxShadow: `0 0 10px ${color}66`,
                      height: "22px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span style={{ fontSize: "13px", lineHeight: 1 }}>{kart}</span>
                    <span
                      className="font-black"
                      style={{ fontSize: "9px", color, lineHeight: 1 }}
                    >
                      {racer.total}
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer — finish line label */}
      <div
        className="flex justify-end px-4 pb-3"
        style={{ marginTop: "-4px" }}
      >
        <span
          className="font-mono text-xs"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          🏁 finish
        </span>
      </div>
    </div>
  );
}
