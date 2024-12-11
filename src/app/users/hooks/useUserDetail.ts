import { getUserDetail } from "@/app/api/users";
import { UserType } from "@/app/types/userType";
import { useCallback, useEffect, useState } from "react";

export const useUserDetail = (id?: UserType["id"]) => {
  const [detail, setDetail] = useState<UserType>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUserDetail = useCallback(async (id: UserType["id"]) => {
    setIsLoading(true);
    try {
      const result = await getUserDetail(id);
      setDetail(result);
    } catch {
      setDetail(undefined);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    fetchUserDetail(id);
  }, [id]);

  return { detail, isLoading };
};
