import { create } from "zustand";
import type { UserProfile } from "@/types/profile";

const DEFAULT_PROFILE: UserProfile = {
  weightKg: 70,
  heightCm: 170,
  age: 30,
  sex: "male",
  goal: "lose_weight",
  activityLevel: "light",
  dailyCaloriesMode: "auto",
  dailyCaloriesManual: 2000,
  mealTimes: {
    breakfast: "07:00",
    morningSnack: "09:30",
    lunch: "12:00",
    afternoonSnack: "15:00",
    dinner: "19:00",
  },
};

interface ProfileState {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: DEFAULT_PROFILE,
  setProfile: (profile) => set({ profile }),
  updateProfile: (partial) => set((s) => ({ profile: { ...s.profile, ...partial } })),
}));
