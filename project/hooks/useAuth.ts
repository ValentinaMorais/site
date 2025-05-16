"use client";

import { create } from 'zustand';

interface AuthStore {
  isAuthenticated: boolean;
  user: null | {
    id: string;
    name: string;
    email: string;
  };
  login: (userData: { id: string; name: string; email: string }) => void;
  logout: () => void;
}

const useAuth = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (userData) => set({ isAuthenticated: true, user: userData }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));

export default useAuth;