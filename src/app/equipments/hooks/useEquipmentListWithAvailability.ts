import { getEquipmentListWithAvailability } from "@/app/api/equipments";
import {
  EquipmentCategory,
  EquipmentListParams,
  EquipmentWithAvailabilitySearchParams,
} from "@/app/types/equipmentType";
import { DEFAULT_LIMIT, PageModelType } from "@/app/types/listType";
import { useCallback, useState } from "react";

const searchMenu = [{ key: "title", title: "장비명" }];

export const useEquipmentListWithAvailability = ({
  startDate,
  endDate,
  excludeReservationId,
}: {
  startDate: string | undefined;
  endDate: string | undefined;
  excludeReservationId?: number;
}) => {
  const [totalElements, setTotalElements] = useState<number>(0);
  const [pageModel, setPageModel] = useState<PageModelType>({
    offset: 0,
    limit: DEFAULT_LIMIT,
  });
  const [selectedSearchKey, setSelectedSearchKey] = useState<string>(
    searchMenu[0].key
  );
  const [keyword, setKeyword] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<
    EquipmentCategory | undefined
  >(undefined);
  const [list, setList] = useState<any[]>([]);

  const getSearchParams = useCallback(
    (
      params?: Partial<EquipmentListParams>
    ): EquipmentWithAvailabilitySearchParams | null => {
      if (!startDate || !endDate) return null;

      const defaultParams = {
        ...pageModel,
        order: "id",
      };

      const categoryParams = selectedCategory
        ? { category: selectedCategory }
        : {};

      const keywordParams =
        keyword && selectedSearchKey ? { title: keyword } : {};

      return {
        ...defaultParams,
        ...categoryParams,
        ...keywordParams,
        ...params,
        startDate,
        endDate,
        excludeReservationId,
      };
    },
    [
      startDate,
      endDate,
      selectedCategory,
      selectedSearchKey,
      keyword,
      pageModel,
      excludeReservationId,
    ]
  );

  const fetchList = useCallback(
    async (params?: Partial<EquipmentListParams>) => {
      try {
        const searchParams = getSearchParams(params);
        if (!searchParams) throw new Error("날짜가 선택되지 않았습니다.");

        const result = await getEquipmentListWithAvailability(searchParams);
        setList(result.data || []);
        setTotalElements(result.totalElements || 0);
      } catch {
        setList([]);
        setPageModel({
          offset: 0,
          limit: DEFAULT_LIMIT,
        });
      }
    },
    []
  );

  const toggleEquipmentCategory = useCallback(
    (categoryKey: EquipmentCategory | undefined) => {
      if (selectedCategory === categoryKey) {
        setSelectedCategory(undefined);
        fetchList({ category: undefined });
      } else {
        setSelectedCategory(categoryKey);
        fetchList({ category: categoryKey });
      }
    },
    [fetchList]
  );

  const onChangeKeyword = (keyword: string) => {
    setKeyword(keyword);
  };

  const onChangeSearchKey = (key: string) => {
    setSelectedSearchKey(key);
  };

  const onChangePage = useCallback(
    (pageModel: PageModelType) => {
      setPageModel(pageModel);
      fetchList(pageModel);
    },
    [fetchList, getSearchParams]
  );

  const onSearch = useCallback(() => {
    const searchParams = getSearchParams();

    if (searchParams) fetchList(searchParams);
  }, [getSearchParams, fetchList]);

  return {
    list,
    selectedCategory,
    selectedSearchKey,
    keyword,
    onChangeKeyword,
    onChangeSearchKey,
    onSearch,
    onChangePage,
    pageModel,
    toggleEquipmentCategory,
    fetchList,
    totalElements,
    searchMenu,
    getSearchParams,
  };
};
