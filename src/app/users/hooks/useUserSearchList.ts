import { getUserList } from "@/app/api/users";
import { UserType } from "@/app/types/userType";
import { showToast } from "@/app/utils/toastUtils";
import { useCallback, useState } from "react";

export const useUserSearchList = () => {
  const [searchKey, setSearchKey] = useState<string>("name");
  const [keyword, setKeyword] = useState<string>("");
  const [list, setList] = useState<UserType[]>([]);

  const getSearchParams = useCallback(() => {
    if (!keyword || !searchKey) return {};

    return {
      [searchKey]: `ilike.%${keyword}%`,
    };
  }, [keyword, searchKey]);

  const fetchUserList = useCallback(async () => {
    try {
      const result = await getUserList(getSearchParams());
      setList(result);
    } catch {
      showToast({
        message: "유저 목록을 불러오는데 실패했습니다.",
        type: "error",
      });
    }
  }, [getSearchParams]);

  return { list, setKeyword, keyword, searchKey, setSearchKey, fetchUserList };
};
