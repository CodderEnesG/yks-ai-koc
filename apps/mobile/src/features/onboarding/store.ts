import { create } from 'zustand';

import type { Field, Grade, TargetKind } from './rules';

// Kurulum boyunca girilenler; son adımda doğrulanıp SQLite'a yazılır. Kalıcı değil:
// uygulama kapanırsa kurulum baştan başlar.
interface OnboardingDraft {
  birthYear?: number;
  birthMonth?: number;
  grade?: Grade;
  field?: Field;
  target?: { kind: TargetKind; value: number } | null;
  examDate?: string;
  weekdayMinutes?: number[];
}

interface OnboardingStore extends OnboardingDraft {
  set: (patch: OnboardingDraft) => void;
  reset: () => void;
}

export const useOnboarding = create<OnboardingStore>()((set) => ({
  set: (patch) => set(patch),
  reset: () =>
    set({
      birthYear: undefined,
      birthMonth: undefined,
      grade: undefined,
      field: undefined,
      target: undefined,
      examDate: undefined,
      weekdayMinutes: undefined,
    }),
}));
