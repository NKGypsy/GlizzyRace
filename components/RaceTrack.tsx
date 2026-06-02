"use client";

import { motion } from "framer-motion";
import { Racer } from "@/lib/standings";

const KART_EMOJIS = ["🏎️", "🚗", "🚕", "🛻", "🚙", "🏍️", "🛵", "🚐"];
const HOTDOG_COLORS = [
  "#FF6B35", // orange-red
  "#FFD700", // gold
  "#FF69B4", // hot pink
  "#00CED1", // teal
  "#7B68EE", // purple
  "#32CD32", // lime
  "#FF4500", // orange
  "#1E90FF", // blue
];

export default function RaceTrack({ racers }: { racers: Racer[] }) {
  if (racers.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 font-mono text-sm">
        No racers yet — waiting for Google Form submissions...
      </div>
    );
  }

  const leaderTotal = Math.max(...racers.map((r) => r.total));

  return (
    <div className="relative w-full max-w-2xl mx-auto" style={{ paddingBottom: "100%" }}>
      <div className="absolute inset-0">
        {/* Outer track ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "repeating-conic-gradient(#1a1a2e 0deg 10deg, #16213e 10deg 20deg)",
            border: "6px solid #FFD700",
            boxShadow: "0 0 40px rgba(255,215,0,0.3), inset 0 0 40px rgba(0,0,0,0.5)",
          }}
        />

        {/* Infield grass */}
        <div
          className="absolute rounded-full flex flex-col items-center justify-center text-center"
          style={{
            inset: "18%",
            background: "radial-gradient(ellipse at center, #1a4a1a 0%, #0d2b0d 100%)",
            border: "3px dashed rgba(255,255,255,0.3)",
          }}
        >
          <div className="text-yellow-400 font-black text-lg leading-tight">🌭 HOT BOI</div>
          <div className="text-yellow-300 font-black text-lg leading-tight">CIRCUIT</div>
          <div className="text-green-400 text-xs font-mono mt-1 opacity-70">LIVE</div>
        </div>

        {/* Start / Finish line */}
        <div
          className="absolute"
          style={{
            top: "50%",
            right: "8%",
            width: "10%",
            height: "3px",
            background: "repeating-linear-gradient(90deg, white 0px, white 4px, black 4px, black 8px)",
            transform: "translateY(-50%)",
          }}
        />

        {/* Racers */}
        {racers.map((racer, i) => {
          // If leader has 0 dogs, spread racers evenly by rank
          const progress =
            leaderTotal === 0
              ? i / Math.max(racers.length - 1, 1)
              : racer.total / leaderTotal;

          // Map 0–1 progress to 0–300 degrees, starting at the top (–90°)
          const angleDeg = progress * 300 - 90;
          const angleRad = (angleDeg * Math.PI) / 180;

          // Radius as % of the container (track centre is at 50%, 50%)
          const radius = 34;
          const x = 50 + Math.cos(angleRad) * radius;
          const y = 50 + Math.sin(angleRad) * radius;

          const color = HOTDOG_COLORS[i % HOTDOG_COLORS.length];
          const kart = KART_EMOJIS[i % KART_EMOJIS.length];

          return (
            <motion.div
              key={racer.name}
              className="absolute flex flex-col items-center"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, -50%)",
                zIndex: 10,
              }}
              animate={{ left: `${x}%`, top: `${y}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 14 }}
            >
              {/* Kart bubble */}
              <div
                className="rounded-xl px-2 py-1 text-center shadow-lg"
                style={{
                  background: "rgba(10,10,20,0.92)",
                  border: `2px solid ${color}`,
                  minWidth: "56px",
                  boxShadow: `0 0 12px ${color}55`,
                }}
              >
                <div style={{ fontSize: "16px", lineHeight: 1 }}>{kart}</div>
                <div
                  className="font-black uppercase tracking-tight leading-tight"
                  style={{ fontSize: "9px", color: color, maxWidth: "60px" }}
                >
                  {racer.name.length > 8 ? racer.name.slice(0, 8) + "…" : racer.name}
                </div>
                <div className="font-bold" style={{ fontSize: "9px", color: "#FFD700" }}>
                  {racer.total} 🌭
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
