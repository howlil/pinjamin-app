import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Pengguna } from "@/apis/interfaces/IAuth";

interface AuthState {
  pengguna: Pengguna | null;
  token: string | null;
  setAuth: (data: { pengguna: Pengguna; token: string }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      pengguna: null,
      token: null,
      setAuth: ({ pengguna, token }) =>
        set({
          pengguna,
          token,
        }),
      clearAuth: () =>
        set({
          pengguna: null,
          token: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
