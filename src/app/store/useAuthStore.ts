import { AdminUserType } from "@/app/types/userType";
import { clientSupabase } from "@/app/utils/supabase/client";
import { create } from "zustand";

interface AuthState {
  user: AdminUserType | undefined;
  error: any;
  loading: boolean;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
  getUser: () => Promise<AdminUserType | undefined>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: undefined,
  error: null,
  loading: true,
  isAuthenticated: false,
  getUser: async () => {
    const currentUser = get().user;
    if (currentUser) return currentUser;

    await get().fetchUser();
    return get().user;
  },
  fetchUser: async () => {
    set({ loading: true });

    try {
      const { data: sessionData, error: sessionError } =
        await clientSupabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        set({
          error: sessionError || new Error("No session found"),
          user: undefined,
          loading: false,
        });
        return;
      }

      const { data: userData, error: userError } =
        await clientSupabase.auth.getUser();

      if (userError) {
        set({
          error: userError,
          user: undefined,
          loading: false,
          isAuthenticated: false,
        });
      } else {
        set({
          user: userData.user || undefined,
          error: null,
          loading: false,
          isAuthenticated: true,
        });
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      set({ error: err, user: undefined, loading: false });
    } finally {
      set((prev) => ({ ...prev, loading: false }));
    }
  },
  logout: async () => {
    await clientSupabase.auth.signOut();
    set((prev) => ({ ...prev, user: undefined, isAuthenticated: false }));
  },
}));
