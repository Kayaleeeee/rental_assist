import { AdminUserType } from "@/app/types/userType";
import { createClient } from "@/app/utils/supabase/client";
import { useCallback, useEffect, useState } from "react";

export const useClientAuthentication = () => {
  const [user, setUser] = useState<AdminUserType | undefined>();
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);

    const supabase = createClient();

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        setError(sessionError || new Error("No session found"));
        setUser(undefined);
        return;
      }

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        setError(userError);
        setUser(undefined);
      } else {
        setUser(userData.user || undefined);
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      setError(err);
      setUser(undefined);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, error, loading };
};
