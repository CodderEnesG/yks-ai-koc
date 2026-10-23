import { diffDays, parseCivilDate } from './civil-date.ts';
import type { PlanInput } from './types.ts';

export class PlanInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PlanInputError';
  }
}

const MAX_DAY_MINUTES = 24 * 60;

// YKS en fazla iki sezon ileride; daha uzak bir sınav tarihi büyük ihtimalle yanlış girilmiştir.
export const MAX_PLAN_DAYS = 3 * 366;

function isUnitScore(value: number | undefined): boolean {
  return value === undefined || (Number.isFinite(value) && value >= 0 && value <= 1);
}

/** Girdi geçersizse `PlanInputError` fırlatır. Motor geçersiz girdiyle sessizce plan üretmez. */
export function validatePlanInput(input: PlanInput): void {
  parseCivilDate(input.from);
  parseCivilDate(input.examDate);
  if (diffDays(input.examDate, input.from) > MAX_PLAN_DAYS) {
    throw new PlanInputError(`Sınav tarihi en fazla ${MAX_PLAN_DAYS} gün ileride olabilir`);
  }

  if (input.weekdayMinutes.length !== 7) {
    throw new PlanInputError('weekdayMinutes 7 eleman olmalı (Pazartesi-Pazar)');
  }
  for (const minutes of input.weekdayMinutes) {
    if (!Number.isInteger(minutes) || minutes < 0 || minutes > MAX_DAY_MINUTES) {
      throw new PlanInputError(`Geçersiz günlük dakika: ${minutes}`);
    }
  }

  const sourceIds = new Set<string>();
  const unitIds = new Set<string>();
  for (const source of input.sources) {
    if (sourceIds.has(source.id)) throw new PlanInputError(`Tekrarlanan kaynak: ${source.id}`);
    sourceIds.add(source.id);
    if (!Number.isFinite(source.order)) {
      throw new PlanInputError(`Geçersiz kaynak sırası: ${source.id}`);
    }
    for (const unit of source.units) {
      if (unitIds.has(unit.id)) throw new PlanInputError(`Tekrarlanan birim: ${unit.id}`);
      unitIds.add(unit.id);
      if (!Number.isInteger(unit.first) || !Number.isInteger(unit.last) || unit.first < 1) {
        throw new PlanInputError(`Geçersiz aralık: ${unit.id}`);
      }
      if (unit.last < unit.first) throw new PlanInputError(`Aralık ters: ${unit.id}`);
      if (!Number.isFinite(unit.minutes) || unit.minutes <= 0) {
        throw new PlanInputError(`Geçersiz süre: ${unit.id}`);
      }
      if (!isUnitScore(unit.examWeight) || !isUnitScore(unit.weakness)) {
        throw new PlanInputError(`Ağırlık 0-1 arası olmalı: ${unit.id}`);
      }
    }
  }

  for (const [unitId, count] of Object.entries(input.completed ?? {})) {
    if (!unitIds.has(unitId)) throw new PlanInputError(`Bilinmeyen birim: ${unitId}`);
    if (!Number.isInteger(count) || count < 0) {
      throw new PlanInputError(`Geçersiz tamamlanan sayısı: ${unitId}`);
    }
  }
}
