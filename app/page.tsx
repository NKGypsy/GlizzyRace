"use client";

import useSWR from "swr";
import Leaderboard from "@/components/Leaderboard";
import RaceTrack from "@/components/RaceTrack";
import SeasonCountdown from "@/components/SeasonCountdown";
import Commentary from "@/components/Commentary";
import { Racer } from "@/lib/standings";
import { getSeasonStats, addProjections, RacerWithProjection } from "@/lib/season";

const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error("Failed to fetch standings");
    return r.json();
  });

export default function Home() {
  const { data: rawStandings, error, isLoading } = useSWR<Racer[]>(
    "/api/standings",
    fetcher,
    {
      refreshInterval: 15000,
      onError: (err) => console.error("Standings fetch error:", err),
    }
  );

  // Calculate season stats and projections client-side
  const season   = getSeasonStats();
  const standings: RacerWithProjection[] = rawStandings
    ? addProjections(rawStandings, season)
    : [];

  if (error) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div
          className="max-w-md w-full rounded-2xl p-6 text-center"
          style={{
            background: "rgba(255,50,50,0.1)",
            border: "1px solid rgba(255,50,50,0.3)",
          }}
        >
          <div style={{ fontSize: "40px" }}>⚠️</div>
          <h2 className="text-red-400 font-black text-xl mt-3 mb-2 uppercase">
            Connection Error
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Could not load race data. Check that your{" "}
            <code className="text-red-300 bg-red-900/30 px-1 rounded">GOOGLE_SHEET_ID</code>{" "}
            in your <code className="text-red-300 bg-red-900/30 px-1 rounded">.env.local</code> is
            correct and the sheet is shared publicly.
          </p>
          <p className="text-slate-500 text-xs mt-3 font-mono">Error: {error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen py-10 px-4"
      style={{
        background: "#080814",
        backgroundImage:
          "radial-gradient(ellipse at 20% 20%, rgba(255,107,53,0.06) 0%, transparent 50%), " +
          "radial-gradient(ellipse at 80% 80%, rgba(255,215,0,0.05) 0%, transparent 50%)",
      }}
    >
      {/* ── Header ── */}
      <header className="text-center mb-10 space-y-2">
        <div className="text-5xl mb-3">🌭🏁</div>
        <h1
          className="font-black uppercase leading-none"
          style={{
            fontSize: "clamp(28px, 6vw, 52px)",
            color: "#FFD700",
            textShadow: "0 0 40px rgba(255,215,0,0.4)",
            letterSpacing: "-0.02em",
          }}
        >
          Hot Boi Glizzy Summer 
        </h1>
        <h2
          className="font-black uppercase"
          style={{
            fontSize: "clamp(18px, 3vw, 28px)",
            color: "#FF6B35",
            letterSpacing: "0.15em",
          }}
        >
          2026
        </h2>
        <p
          className="font-mono text-xs tracking-widest"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          NASCAR-STYLE GLIZZY RACING BROADCAST LEAGUE
        </p>

        {/* Live indicator */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              background: "#22c55e",
              boxShadow: "0 0 6px #22c55e",
              animation: "pulse 1.5s ease-in-out infinite",
            }}
          />
          <span className="text-green-400 text-xs font-mono font-bold tracking-widest">
            LIVE
          </span>
        </div>
      </header>

      {isLoading ? (
        <div className="text-center py-20">
          <div
            className="text-4xl mb-4"
            style={{ animation: "spin 1s linear infinite", display: "inline-block" }}
          >
            🌭
          </div>
          <p
            className="font-mono text-sm tracking-widest"
            style={{ color: "rgba(255,255,255,0.3)", animation: "pulse 1.5s infinite" }}
          >
            PREPARING THE GLIZZY TRACK...
          </p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-8">

          {/* Countdown */}
          <SeasonCountdown />

          {/* Race Track */}
          <RaceTrack racers={standings} />

          {/* AI Commentary */}
          <Commentary
            standings={standings}
            daysElapsed={season.daysElapsed}
            daysRemaining={season.daysRemaining}
          />

          {/* Leaderboard with projections */}
          <Leaderboard
            standings={standings}
            percentComplete={season.percentComplete}
          />

          <p
            className="text-center font-mono text-xs"
            style={{ color: "rgba(255,255,255,0.2)" }}
          >
            Standings update automatically every 15 seconds · Season ends Dec 31, 2026
          </p>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  );
}
