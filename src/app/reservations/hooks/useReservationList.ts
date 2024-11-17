import {
  getReservationList,
  getReservationStatusCount,
} from "@/app/api/reservation";
import {
  ReservationSearchParams,
  ReservationStatus,
  ReservationType,
} from "@/app/types/reservationType";
import { showToast } from "@utils/toastUtils";
import { useCallback, useEffect, useState } from "react";

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

export const useReservationList = () => {
  const [list, setList] = useState<ReservationType[]>([]);
  const [categoryList, setCategoryList] =
    useState<{ key: string; title: string; count: number }[]>(
      initialCategoryList
    );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categoryList[0].key
  );

  const getSearchParams = useCallback((): ReservationSearchParams => {
    if (selectedCategory === categoryList[0].key) return {};
    return { status: selectedCategory };
  }, [categoryList, selectedCategory]);

  const fetchReservationList = useCallback(
    async (params?: ReservationSearchParams) => {
      try {
        const result = await getReservationList(params);
        setList(result);
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

  useEffect(() => {
    fetchReservationCount();
    fetchReservationList();
  }, []);

  const onChangeCategory = (key: string) => {
    setSelectedCategory(key);
    fetchReservationList(key === allString ? {} : { status: key });
  };

  return {
    list,
    setList,
    categoryList,
    selectedCategory,
    onChangeCategory,
  };
};
