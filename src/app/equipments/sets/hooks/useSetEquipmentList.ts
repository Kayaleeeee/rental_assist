import { getSetEquipmentList } from "@/app/api/equipments";
import {
  EquipmentCategory,
  SetEquipmentListItemType,
  SetEquipmentListParams,
} from "@/app/types/equipmentType";
import { useCallback, useMemo, useState } from "react";

const searchMenu = [{ key: "title", title: "장비명" }];

export const useSetEquipmentList = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    EquipmentCategory | undefined
  >(undefined);
  const [selectedSearchKey, setSelectedSearchKey] = useState<string>(
    searchMenu[0].key
  );
  const [keyword, setKeyword] = useState<string>("");
  const [list, setList] = useState<SetEquipmentListItemType[]>([]);

  const fetchList = useCallback(async (params?: SetEquipmentListParams) => {
    try {
      const result = await getSetEquipmentList(params);
      setList(result || []);
    } catch {
      setList([]);
    }
  }, []);

  const toggleEquipmentCategory = (
    categoryKey: EquipmentCategory | undefined
  ) => {
    if (selectedCategory === categoryKey) {
      setSelectedCategory(undefined);
      fetchList();
    } else {
      setSelectedCategory(categoryKey);
      fetchList(categoryKey ? { category: categoryKey } : undefined);
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
      const categoryParams = selectedCategory
        ? { category: selectedCategory }
        : {};

      const keywordParams =
        keyword && selectedSearchKey
          ? { [selectedSearchKey]: `ilike.%${keyword}%` }
          : {};

      return {
        ...categoryParams,
        ...keywordParams,
        ...params,
      };
    },
    [selectedCategory, selectedSearchKey, keyword]
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
  };
};
