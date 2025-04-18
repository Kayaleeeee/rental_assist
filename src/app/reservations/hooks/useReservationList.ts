import {
  getReservationList,
  getReservationStatusCount,
} from "@/app/api/reservation";
import { PageModelType } from "@/app/types/listType";
import {
  ReservationSearchParams,
  ReservationStatus,
  ReservationType,
} from "@/app/types/reservationType";

import { showToast } from "@utils/toastUtils";
import { useCallback, useState } from "react";

const allString = "all";
const initialCategoryList = [
  {
    key: allString,
    title: "전체",
    count: 0,
  },
  {
    key: ReservationStatus.pending,
    title: "대기",
    count: 0,
  },
  {
    key: ReservationStatus.confirmed,
    title: "확정",
    count: 0,
  },
  {
    key: ReservationStatus.canceled,
    title: "취소",
    count: 0,
  },
];

const searchMenu = [{ key: "userName", title: "회원이름" }];

export const useReservationList = () => {
  const [selectedSearchKey, setSelectedSearchKey] = useState<string>(
    searchMenu[0].key
  );
  const [keyword, setKeyword] = useState<string>("");
  const [list, setList] = useState<ReservationType[]>([]);
  const [categoryList, setCategoryList] =
    useState<{ key: string; title: string; count: number }[]>(
      initialCategoryList
    );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryList[0].key
  );
  const [totalElements, setTotalElements] = useState<number>(0);
  const [pageModel, setPageModel] = useState({
    offset: 0,
    limit: 50,
  });

  const [dateRange, setDateRange] = useState<{
    startDate: string | undefined;
    endDate: string | undefined;
  }>({
    startDate: undefined,
    endDate: undefined,
  });

  const getSearchParams = useCallback(
    (params = {}): ReservationSearchParams => {
      const defaultParams = {
        ...pageModel,
      };

      const dateParams = {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      };

      const categoryParams =
        selectedCategory === categoryList[0].key
          ? {}
          : { status: selectedCategory };

      const keywordParams =
        keyword && selectedSearchKey ? { [selectedSearchKey]: keyword } : {};

      return {
        ...defaultParams,
        ...categoryParams,
        ...keywordParams,
        ...dateParams,
        ...params,
      };
    },
    [dateRange, selectedCategory, pageModel, keyword, selectedSearchKey]
  );

  const fetchReservationList = useCallback(
    async (params?: ReservationSearchParams) => {
      try {
        const result = await getReservationList(params);
        setList(result.data);
        setTotalElements(result.totalElements);
      } catch {
        showToast({
          message: "예약 목록을 불러오는데 실패했습니다.",
          type: "error",
        });
      }
    },
    []
  );

  const fetchReservationCount = async () => {
    try {
      const result = await getReservationStatusCount();

      const allCount = result.reduce((prev, acc) => (prev += acc.count), 0);
      const changedCategoryList = [...initialCategoryList].map((category) => {
        if (category.key === allString) return { ...category, count: allCount };

        const statusCount =
          result.find((item) => item.status === category.key)?.count || 0;
        return { ...category, count: statusCount };
      });

      setCategoryList(changedCategoryList);
    } catch {
      setCategoryList(initialCategoryList);
    }
  };

  const onChangeCategory = (key: string) => {
    setSelectedCategory(key);
    fetchReservationList(
      key === categoryList[0].key ? {} : getSearchParams({ status: key })
    );
  };

  const onChangeKeyword = (keyword: string) => {
    setKeyword(keyword);
  };

  const onChangeSearchKey = (key: string) => {
    setSelectedSearchKey(key);
  };

  const onChangePage = useCallback(
    (pageModel: PageModelType) => {
      setPageModel(pageModel);
      fetchReservationList(getSearchParams(pageModel));
    },
    [fetchReservationList, getSearchParams]
  );

  return {
    list,
    setList,
    categoryList,
    selectedCategory,
    onChangeCategory,
    fetchReservationList,
    fetchReservationCount,
    getSearchParams,
    onChangeKeyword,
    onChangeSearchKey,
    keyword,
    selectedSearchKey,
    searchMenu,
    setDateRange,
    dateRange,
    onChangePage,
    pageModel,
    totalElements,
  };
};
