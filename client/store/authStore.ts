import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  location?: string;
  totalDonated: number;
  donationCount: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User, token: string) => void;
  updateUser: (user: User, token?: string) => void; // ✅ Added
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      login: async (email, password) => {
        try {
          const response = await api.post('/auth/login', {
            email,
            password,
          });

          const { user, token } = response.data;
          set({ user, token, isLoggedIn: true });
          localStorage.setItem('token', token);
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null, isLoggedIn: false });
        localStorage.removeItem('token');
      },

      setUser: (user, token) => {
        set({ user, token, isLoggedIn: true });
        if (token) localStorage.setItem('token', token);
      },

      // ✅ FIXED: Proper update method
      updateUser: (user, token = get().token) => {
        set({ user, token, isLoggedIn: true });
        if (token) localStorage.setItem('token', token);
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
