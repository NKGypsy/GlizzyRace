"use client";

import { useEffect, useState } from "react";

const SEASON_END = new Date("2026-12-31T23:59:59");

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function getTimeLeft(): TimeLeft {
  const now = new Date();
  const diff = SEASON_END.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, expired: false };
}

export default function SeasonCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (timeLeft.expired) {
    return (
      <div className="text-center py-4">
        <span className="text-yellow-400 font-black text-2xl uppercase tracking-widest">
          🏁 Season Over — Final Standings!
        </span>
      </div>
    );
  }

  const units = [
    { label: "DAYS",    value: timeLeft.days },
    { label: "HOURS",   value: timeLeft.hours },
    { label: "MINS",    value: timeLeft.minutes },
    { label: "SECS",    value: timeLeft.seconds },
  ];

  return (
    <div
      className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden"
      style={{
        background: "rgba(10,10,25,0.95)",
        border: "1px solid rgba(255,107,53,0.3)",
        boxShadow: "0 0 40px rgba(255,107,53,0.08)",
      }}
    >
      {/* Header */}
      <div
        className="text-center py-3 px-6"
        style={{
          background: "rgba(255,107,53,0.1)",
          borderBottom: "1px solid rgba(255,107,53,0.2)",
        }}
      >
        <p
          className="font-black uppercase tracking-widest text-xs"
          style={{ color: "#FF6B35" }}
        >
          ⏱ Season Ends Dec 31, 2026
        </p>
      </div>

      {/* Countdown blocks */}
      <div className="grid grid-cols-4 gap-0 p-4">
        {units.map((unit, i) => (
          <div key={unit.label} className="flex flex-col items-center py-3 relative">
            {/* Divider between units */}
            {i > 0 && (
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-px"
                style={{ background: "rgba(255,255,255,0.08)" }}
              />
            )}
            <span
              className="font-black tabular-nums leading-none"
              style={{
                fontSize: "clamp(28px, 6vw, 44px)",
                color: unit.label === "SECS" ? "#FF6B35" : "white",
                textShadow: unit.label === "SECS"
                  ? "0 0 20px rgba(255,107,53,0.5)"
                  : "none",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {String(unit.value).padStart(2, "0")}
            </span>
            <span
              className="font-mono font-bold tracking-widest mt-1"
              style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
