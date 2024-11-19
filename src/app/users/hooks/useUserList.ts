import { getUserList } from "@/app/api/users";
import { UserType } from "@/app/types/userType";
import { showToast } from "@/app/utils/toastUtils";
import { useCallback, useEffect, useState } from "react";

export const useUserList = () => {
  const [list, setList] = useState<UserType[]>([]);

  const fetchUserList = useCallback(async () => {
    try {
      const result = await getUserList();
      setList(result);
    } catch {
      setList([]);
      showToast({
        message: "유저 목록을 불러오는데 실패했습니다.",
        type: "error",
      });
    }
  }, []);

  useEffect(() => {
    fetchUserList();
  }, []);

  return { list };
};
