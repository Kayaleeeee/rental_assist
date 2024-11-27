import { getFullSetList } from "@/app/api/equipments";
import {
  SetEquipmentListItemType,
  EquipmentListParams,
} from "@/app/types/equipmentType";
import { DEFAULT_LIMIT, PageModelType } from "@/app/types/listType";
import { useCallback, useMemo, useState } from "react";

const searchMenu = [{ key: "title", title: "장비명" }];

export const useSetEquipmentList = () => {
  const [selectedSearchKey, setSelectedSearchKey] = useState<string>(
    searchMenu[0].key
  );
  const [keyword, setKeyword] = useState<string>("");
  const [list, setList] = useState<SetEquipmentListItemType[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [pageModel, setPageModel] = useState<PageModelType>({
    offset: 0,
    limit: DEFAULT_LIMIT,
  });

  const fetchList = useCallback(async (params?: EquipmentListParams) => {
    try {
      const result = await getFullSetList(params);
      setList(result.data || []);
      setTotalElements(result.totalElements || 0);
    } catch {
      setList([]);
      setPageModel({
        offset: 0,
        limit: DEFAULT_LIMIT,
      });
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
