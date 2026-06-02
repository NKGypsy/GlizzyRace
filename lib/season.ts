import { Racer } from "./standings";

export interface RacerWithProjection extends Racer {
  projected: number;      // projected total dogs by Dec 31
  dogsPerDay: number;     // current pace
  daysWithData: number;   // how many days of season they've been active
}

export interface SeasonStats {
  daysElapsed: number;
  daysRemaining: number;
  totalDays: number;
  percentComplete: number;
  seasonEndDate: Date;
  seasonStartDate: Date;
}

// Season runs May 1 2026 → Dec 31 2026
const SEASON_START = new Date("2026-05-01T00:00:00");
const SEASON_END   = new Date("2026-12-31T23:59:59");

export function getSeasonStats(): SeasonStats {
  const now = new Date();

  const totalMs    = SEASON_END.getTime() - SEASON_START.getTime();
  const elapsedMs  = Math.max(0, now.getTime() - SEASON_START.getTime());
  const remainingMs = Math.max(0, SEASON_END.getTime() - now.getTime());

  const totalDays     = Math.ceil(totalMs / (1000 * 60 * 60 * 24));
  const daysElapsed   = Math.floor(elapsedMs / (1000 * 60 * 60 * 24));
  const daysRemaining = Math.ceil(remainingMs / (1000 * 60 * 60 * 24));

  return {
    daysElapsed,
    daysRemaining,
    totalDays,
    percentComplete: Math.min(100, (daysElapsed / totalDays) * 100),
    seasonEndDate:   SEASON_END,
    seasonStartDate: SEASON_START,
  };
}

export function addProjections(
  racers: Racer[],
  season: SeasonStats
): RacerWithProjection[] {
  return racers.map((racer) => {
    // Avoid divide-by-zero if season just started
    const daysActive = Math.max(season.daysElapsed, 1);
    const dogsPerDay = racer.total / daysActive;

    // Project total = current + (pace × remaining days)
    const projected = Math.round(racer.total + dogsPerDay * season.daysRemaining);

    return {
      ...racer,
      projected,
      dogsPerDay: Math.round(dogsPerDay * 100) / 100,
      daysWithData: season.daysElapsed,
    };
  });
}
