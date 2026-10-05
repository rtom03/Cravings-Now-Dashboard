// lib/duration.ts
export const DEACTIVATION_DURATIONS = [
  { label: "30 minutes", minutes: 30 },
  { label: "1 hour", minutes: 60 },
  { label: "4 hours", minutes: 240 },
  { label: "24 hours", minutes: 1440 },
] as const;

export function durationToReactivateAt(minutes: number): string {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}
