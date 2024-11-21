import { getEquipmentList } from "@/app/api/equipments";
import {
  EquipmentCategory,
  EquipmentListItemType,
  EquipmentListParams,
} from "@/app/types/equipmentType";
import { useCallback, useEffect, useMemo, useState } from "react";

const searchMenu = [{ key: "title", title: "장비명" }];

export const useEquipmentList = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    EquipmentCategory | undefined
  >(undefined);
  const [selectedSearchKey, setSelectedSearchKey] = useState<string>(
    searchMenu[0].key
  );
  const [keyword, setKeyword] = useState<string>("");
  const [list, setList] = useState<EquipmentListItemType[]>([]);

  const fetchList = useCallback(async (params?: EquipmentListParams) => {
    try {
      const result = await getEquipmentList(params);
      setList(result || []);
    } catch {
      setList([]);
    }
  }, []);

  useEffect(() => {
    fetchList();
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

  const searchParams = useMemo(() => {
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
    };
  }, [selectedCategory, selectedSearchKey, keyword]);

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
  };
};
