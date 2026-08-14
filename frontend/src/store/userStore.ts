import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginResponse, User } from "../constants/index.type";

type userState = {
  user: LoginResponse | null;
  setUser: (user: LoginResponse) => void;
  logout: () => void;
};

export const useUserStore = create<userState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),

      logout: () => set({ user: null }), // ✅ clears persisted state automatically
    }),
    {
      name: "user-storage",
    },
  ),
);
