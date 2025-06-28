import { create } from 'zustand';

interface AuthState {
    user: { id: string; name: string; email: string } | null;
    accessToken: string | null;
    setAuth: (user: { id: string; name: string; email: string }, accessToken: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    setAuth: (user, accessToken) => set({ user, accessToken }),
    clearAuth: () => set({ user: null, accessToken: null }),
}));