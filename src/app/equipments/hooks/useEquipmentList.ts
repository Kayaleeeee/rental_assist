import { getEquipmentList } from "@/app/api/equipments";
import {
  EquipmentCategory,
  EquipmentListItemType,
  EquipmentListParams,
} from "@/app/types/equipmentType";
import { DEFAULT_LIMIT, PageModelType } from "@/app/types/listType";
import { useCallback, useMemo, useState } from "react";

const searchMenu = [{ key: "title", title: "장비명" }];

export const useEquipmentList = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    EquipmentCategory | "full_set" | undefined
  >(undefined);
  const [selectedSearchKey, setSelectedSearchKey] = useState<string>(
    searchMenu[0].key
  );
  const [keyword, setKeyword] = useState<string>("");
  const [list, setList] = useState<EquipmentListItemType[]>([]);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [pageModel, setPageModel] = useState<PageModelType>({
    offset: 0,
    limit: DEFAULT_LIMIT,
  });

  const fetchList = useCallback(async (params?: EquipmentListParams) => {
    try {
      const result = await getEquipmentList(params);
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

  const toggleEquipmentCategory = (
    categoryKey: EquipmentCategory | undefined
  ) => {
    if (selectedCategory === categoryKey) {
      setSelectedCategory(undefined);
    } else {
      setSelectedCategory(categoryKey);
    }
  };

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

      const categoryParams = selectedCategory
        ? { category: selectedCategory }
        : {};

      const keywordParams =
        keyword && selectedSearchKey ? { [selectedSearchKey]: keyword } : {};

      return {
        ...defaultParams,
        ...categoryParams,
        ...keywordParams,
        ...params,
      };
    },
    [selectedCategory, selectedSearchKey, keyword, pageModel]
  );

  const onSearch = useCallback(() => {
    fetchList(searchParams);
  }, [searchParams, fetchList]);

  return {
    list,
    selectedCategory,
    selectedSearchKey,
    keyword,
    toggleEquipmentCategory,
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
