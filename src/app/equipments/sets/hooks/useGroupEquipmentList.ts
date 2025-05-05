import { getSetEquipmentList } from "@/app/api/equipments/setEquipments";
import {
  EquipmentListParams,
  SetEquipmentType,
} from "@/app/types/equipmentType";
import { DEFAULT_LIMIT, PageModelType } from "@/app/types/listType";
import { useCallback, useMemo, useState } from "react";

const searchMenu = [{ key: "title", title: "장비명" }];

export const useGroupEquipmentList = () => {
  const [selectedSearchKey, setSelectedSearchKey] = useState<string>(
    searchMenu[0].key
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [keyword, setKeyword] = useState<string>("");
  const [list, setList] = useState<SetEquipmentType[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [pageModel, setPageModel] = useState<PageModelType>({
    offset: 0,
    limit: DEFAULT_LIMIT,
  });

  const fetchList = useCallback(async (params?: EquipmentListParams) => {
    try {
      setIsLoading(true);
      const result = await getSetEquipmentList(params);

      setList(result.data || []);
      setTotalElements(result.totalElements || 0);
    } catch {
      setList([]);
      setPageModel({
        offset: 0,
        limit: DEFAULT_LIMIT,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onChangeKeyword = (keyword: string) => {
    setKeyword(keyword);
  };

  const onChangeSearchKey = (key: string) => {
    setSelectedSearchKey(key);
  };

  const searchParams = useMemo(
    (params = {}) => {
      const defaultParams = {
        ...pageModel,
        order: "id",
      };

      const keywordParams =
        keyword && selectedSearchKey ? { [selectedSearchKey]: keyword } : {};

      return {
        ...defaultParams,

        ...keywordParams,
        ...params,
      };
    },
    [selectedSearchKey, keyword, pageModel]
  );

  const onSearch = useCallback(() => {
    fetchList(searchParams);
  }, [searchParams, fetchList]);

  return {
    list,
    isLoading,
    selectedSearchKey,
    keyword,
    searchMenu,
    onChangeKeyword,
    onChangeSearchKey,
    onSearch,
    fetchList,
    setPageModel,
    pageModel,
    searchParams,
    totalElements,
  };
};
