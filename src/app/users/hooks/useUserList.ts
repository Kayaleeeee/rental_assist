import { getUserList } from "@/app/api/users";
import { PageModelType } from "@/app/types/listType";
import { UserListParams, UserType } from "@/app/types/userType";
import { showToast } from "@/app/utils/toastUtils";
import { useCallback, useEffect, useState } from "react";

export const useUserList = () => {
  const [totalElements, setTotalElements] = useState<number>(0);
  const [pageModel, setPageModel] = useState({
    offset: 0,
    limit: 50,
  });
  const [list, setList] = useState<UserType[]>([]);

  const getSearchParams = useCallback(
    (params = {}): UserListParams => {
      const defaultParams = {
        ...pageModel,
      };

      return {
        ...defaultParams,
        ...params,
      };
    },
    [pageModel]
  );

  const fetchUserList = useCallback(async (params?: UserListParams) => {
    try {
      const result = await getUserList(params);
      setList(result.data);
      setTotalElements(result.totalElements);
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

  const onChangePage = useCallback(
    (pageModel: PageModelType) => {
      setPageModel(pageModel);
      fetchUserList(getSearchParams(pageModel));
    },
    [fetchUserList, getSearchParams]
  );

  return {
    list,
    totalElements,
    onChangePage,
    getSearchParams,
    fetchUserList,
    pageModel,
  };
};
