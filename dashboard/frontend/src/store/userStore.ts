import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LoginResponse, User } from "../constants/index.type";
import { isTokenValid } from "../utils/token";

type userState = {
  user: LoginResponse | null;
  setUser: (user: LoginResponse) => void;
  logout: () => void;
  clearUser: () => void;
};

export const useUserStore = create<userState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      logout: () => set({ user: null }), // ✅ clears persisted state automatically
    }),
    {
      name: "user-storage",

      onRehydrateStorage: () => (state) => {
        if (state?.user && !isTokenValid(state.user.token)) {
          state.clearUser();
        }
      },
    },
  ),
);
