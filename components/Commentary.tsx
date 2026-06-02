"use client";

import { useState, useCallback } from "react";
import { RacerWithProjection } from "@/lib/season";

interface Props {
  standings: RacerWithProjection[];
  daysElapsed: number;
  daysRemaining: number;
}

export default function Commentary({ standings, daysElapsed, daysRemaining }: Props) {
  const [commentary, setCommentary] = useState<string>("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string>("");
  const [hasLoaded, setHasLoaded]   = useState(false);

  const fetchCommentary = useCallback(async () => {
    if (standings.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/commentary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ standings, daysElapsed, daysRemaining }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to get commentary");
      }

      setCommentary(data.commentary);
      setHasLoaded(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [standings, daysElapsed, daysRemaining]);

  return (
    <div
      className="w-full max-w-2xl mx-auto rounded-2xl overflow-hidden"
      style={{
        background: "rgba(10,10,25,0.95)",
        border: "1px solid rgba(123,104,238,0.3)",
        boxShadow: "0 0 40px rgba(123,104,238,0.08)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between py-3 px-5"
        style={{
          background: "rgba(123,104,238,0.1)",
          borderBottom: "1px solid rgba(123,104,238,0.2)",
        }}
      >
        <p
          className="font-black uppercase tracking-widest text-xs"
          style={{ color: "#7B68EE" }}
        >
          🎙 Live Broadcast — AI Commentator
        </p>

        {/* Regenerate button */}
        <button
          onClick={fetchCommentary}
          disabled={loading || standings.length === 0}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 font-black uppercase text-xs tracking-wider transition-all duration-200"
          style={{
            background: loading ? "rgba(123,104,238,0.2)" : "rgba(123,104,238,0.3)",
            border: "1px solid rgba(123,104,238,0.5)",
            color: loading ? "rgba(255,255,255,0.4)" : "#fff",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <>
              <span
                style={{
                  display: "inline-block",
                  animation: "spin 1s linear infinite",
                  fontSize: "14px",
                }}
              >
                🌭
              </span>
              Generating...
            </>
          ) : hasLoaded ? (
            "🎙 New Take"
          ) : (
            "🎙 Get Commentary"
          )}
        </button>
      </div>

      {/* Content area */}
      <div className="p-5 min-h-[100px] flex items-center justify-center">
        {!hasLoaded && !loading && !error && (
          <p
            className="text-center font-mono text-xs"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            Hit the button to get a live broadcast update from your AI commentator.
            <br />
            Results may cause emotional damage.
          </p>
        )}

        {loading && (
          <p
            className="text-center font-mono text-xs tracking-widest"
            style={{
              color: "#7B68EE",
              animation: "pulse 1s ease-in-out infinite",
            }}
          >
            YOUR COMMENTATOR IS REVIEWING THE TAPE...
          </p>
        )}

        {error && !loading && (
          <div className="text-center">
            <p className="text-red-400 text-sm font-bold mb-1">Broadcast failure</p>
            <p className="text-red-300/60 text-xs font-mono">{error}</p>
            {error.includes("ANTHROPIC_API_KEY") && (
              <p className="text-slate-400 text-xs mt-2">
                Add <code className="bg-slate-800 px-1 rounded">ANTHROPIC_API_KEY</code> to your{" "}
                <code className="bg-slate-800 px-1 rounded">.env.local</code> file.
              </p>
            )}
          </div>
        )}

        {commentary && !loading && (
          <div className="w-full">
            {/* Microphone decoration */}
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: "#ff4444",
                  boxShadow: "0 0 6px #ff4444",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              />
              <span
                className="font-mono text-xs font-bold tracking-widest"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                ON AIR
              </span>
            </div>

            {/* The commentary text */}
            <p
              className="leading-relaxed font-bold"
              style={{
                fontSize: "15px",
                color: "rgba(255,255,255,0.92)",
                fontStyle: "italic",
                lineHeight: "1.7",
              }}
            >
              &ldquo;{commentary}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
