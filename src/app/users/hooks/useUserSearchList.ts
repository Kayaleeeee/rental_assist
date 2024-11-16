import { getUserList } from "@/app/api/users";
import { UserType } from "@/app/types/userType";
import { showToast } from "@/app/utils/toastUtils";
import { isEmpty } from "lodash";
import { useCallback, useState } from "react";

export const useUserSearchList = () => {
  const [searchKey, setSearchKey] = useState<string>("name");
  const [keyword, setKeyword] = useState<string>("");
  const [list, setList] = useState<UserType[]>([]);

  const getSearchParams = useCallback(() => {
    if (!keyword || !searchKey) return {};

    return {
      [searchKey]: keyword,
    };
  }, [keyword, searchKey]);

  const fetchUserList = useCallback(async () => {
    try {
      const result = await getUserList(getSearchParams());
      setList(result);

      if (isEmpty(result))
        showToast({
          message: "해당하는 고객이 없습니다.",
          type: "info",
        });
    } catch {
      showToast({
        message: "유저 목록을 불러오는데 실패했습니다.",
        type: "error",
      });
    }
  }, [getSearchParams]);

  return { list, setKeyword, keyword, searchKey, setSearchKey, fetchUserList };
};
