import { getUserDetail } from "@/app/api/users";
import { UserType } from "@/app/types/userType";
import { useCallback, useEffect, useState } from "react";

export const useUserDetail = (id?: UserType["id"]) => {
  const [detail, setDetail] = useState<UserType>();

  const fetchUserDetail = useCallback(async (id: UserType["id"]) => {
    try {
      const result = await getUserDetail(id);
      setDetail(result);
    } catch {
      setDetail(undefined);
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    fetchUserDetail(id);
  }, [id]);

  return { detail };
};
