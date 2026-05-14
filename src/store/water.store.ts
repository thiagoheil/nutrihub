import { create } from "zustand";
import * as SecureStore from "expo-secure-store";
import { format } from "date-fns";

const WATER_KEY = "water_intake";

interface Persisted {
  intakeMl: number;
  goalMl: number;
  date: string;
}

interface WaterState extends Persisted {
  addWater: (ml: number) => void;
  removeWater: (ml: number) => void;
  setGoal: (ml: number) => void;
}

function load(): Persisted {
  const today = format(new Date(), "yyyy-MM-dd");
  const raw = SecureStore.getItem(WATER_KEY);
  if (raw) {
    const parsed: Persisted = JSON.parse(raw);
    if (parsed.date === today) return parsed;
    // New day — reset intake but keep goal
    return { intakeMl: 0, goalMl: parsed.goalMl, date: today };
  }
  return { intakeMl: 0, goalMl: 2000, date: today };
}

function persist(state: Persisted) {
  SecureStore.setItem(WATER_KEY, JSON.stringify(state));
}

const initial = load();

export const useWaterStore = create<WaterState>((set, get) => ({
  ...initial,

  addWater: (ml) => {
    const { intakeMl, goalMl, date } = get();
    const next = { intakeMl: intakeMl + ml, goalMl, date };
    persist(next);
    set({ intakeMl: next.intakeMl });
  },

  removeWater: (ml) => {
    const { intakeMl, goalMl, date } = get();
    const next = { intakeMl: Math.max(0, intakeMl - ml), goalMl, date };
    persist(next);
    set({ intakeMl: next.intakeMl });
  },

  setGoal: (ml) => {
    const { intakeMl, date } = get();
    const next = { intakeMl, goalMl: ml, date };
    persist(next);
    set({ goalMl: ml });
  },
}));
