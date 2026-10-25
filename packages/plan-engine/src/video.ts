// Video görevinin süresi (rapor 2.6): video süresi / izleme hızı × (1 + not payı).

export const WATCH_SPEEDS = [1, 1.25, 1.5, 2] as const;
export type WatchSpeed = (typeof WATCH_SPEEDS)[number];
export const DEFAULT_WATCH_SPEED: WatchSpeed = 1;
/** Not alma ve durdurup düşünme payı; varsayılan %25. */
export const DEFAULT_NOTE_RATIO = 0.25;

export function videoMinutes(
  durationSeconds: number,
  speed: WatchSpeed = DEFAULT_WATCH_SPEED,
  noteRatio: number = DEFAULT_NOTE_RATIO,
): number {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new RangeError(`Geçersiz video süresi: ${durationSeconds}`);
  }
  if (!WATCH_SPEEDS.includes(speed)) throw new RangeError(`Geçersiz izleme hızı: ${speed}`);
  if (!Number.isFinite(noteRatio) || noteRatio < 0 || noteRatio > 1) {
    throw new RangeError(`Not payı 0-1 arası olmalı: ${noteRatio}`);
  }
  return (durationSeconds / 60 / speed) * (1 + noteRatio);
}
