import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    hasHydrated: boolean;
    setAuth: (user: User, accessToken: string) => void;
    clearAuth: () => void;
    setHasHydrated: (val: boolean) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            hasHydrated: false,
            setAuth: (user: User, accessToken: string) =>
                set({
                    user,
                    accessToken,
                    isAuthenticated: true,
                }),
            clearAuth: () => {
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                });
                useAuthStore.persist.clearStorage();  
                localStorage.removeItem('auth-storage');
            },
            setHasHydrated: (state) => {
                set({
                    hasHydrated: state
                })
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: (state) => {
                return () => state.setHasHydrated(true);
            },
        },
    )
);