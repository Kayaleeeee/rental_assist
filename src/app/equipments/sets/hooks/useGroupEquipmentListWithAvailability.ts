import { getSetEquipmentListWithAvailability } from "@/app/api/equipments/setEquipments";
import {
  SetEquipmentWithAvailabilitySearchParams,
  SetEquipmentWithAvailabilityType,
} from "@/app/types/equipmentType";
import { DEFAULT_LIMIT, PageModelType } from "@/app/types/listType";
import { useCallback, useState } from "react";

const searchMenu = [{ key: "title", title: "장비명" }];

export const useGroupEquipmentListWithAvailability = ({
  startDate,
  endDate,
  excludeReservationId,
}: {
  startDate: string;
  endDate: string;
  excludeReservationId?: number;
}) => {
  const [selectedSearchKey, setSelectedSearchKey] = useState<string>(
    searchMenu[0].key
  );
  const [keyword, setKeyword] = useState<string>("");
  const [list, setList] = useState<SetEquipmentWithAvailabilityType[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [pageModel, setPageModel] = useState<PageModelType>({
    offset: 0,
    limit: DEFAULT_LIMIT,
  });

  const onChangeKeyword = (keyword: string) => {
    setKeyword(keyword);
  };

  const onChangeSearchKey = (key: string) => {
    setSelectedSearchKey(key);
  };

  const getSearchParams = useCallback(
    (
      params?: Partial<SetEquipmentWithAvailabilitySearchParams>
    ): SetEquipmentWithAvailabilitySearchParams => {
      const defaultParams = {
        ...pageModel,
        startDate,
        endDate,
        excludeReservationId,
      };

      const keywordParams =
        keyword && selectedSearchKey ? { [selectedSearchKey]: keyword } : {};

      return {
        ...defaultParams,
        ...keywordParams,
        ...params,
      };
    },
    [
      selectedSearchKey,
      keyword,
      pageModel,
      startDate,
      endDate,
      excludeReservationId,
    ]
  );

  const fetchList = useCallback(
    async (params?: Partial<SetEquipmentWithAvailabilitySearchParams>) => {
      try {
        const searchParams = getSearchParams(params);
        const result = await getSetEquipmentListWithAvailability(searchParams);

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
    [getSearchParams]
  );

  const onSearch = useCallback(() => {
    fetchList();
  }, [fetchList]);

  return {
    list,
    selectedSearchKey,
    keyword,
    searchMenu,
    onChangeKeyword,
    onChangeSearchKey,
    onSearch,
    fetchList,
    setPageModel,
    pageModel,
    totalElements,
  };
};
