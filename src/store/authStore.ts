import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  token: string | null;
  name: string | null;
  email: string | null;
  role: string | null;
  isAuthenticated: boolean;
  setAuth: (data: {
    token: string;
    name: string;
    email: string;
    role: string;
  }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      name: null,
      email: null,
      role: null,
      isAuthenticated: false,
      setAuth: ({ token, name, email, role }) => {
        // Also write to localStorage for compatibility with existing components
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("role", role);
        set({ token, name, email, role, isAuthenticated: true });
      },
      logout: () => {
        localStorage.clear();
        set({ token: null, name: null, email: null, role: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
