"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/Button";
import { useEquipmentList } from "./hooks/useEquipmentList";
import {
  EquipmentCategory,
  EquipmentCategoryList,
  EquipmentListItemType,
  SetEquipmentType,
} from "../types/equipmentType";
import { Margin } from "../components/Margin";
import { CategoryList } from "../components/Category/CategoryList";
import { useCallback, useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { EquipmentListTable } from "./modules/EquipmentListTable";
import styles from "./page.module.scss";
import formStyles from "@components/Form/index.module.scss";
import { SetEquipmentList } from "./sets/modules/SetEquipmentList";
import { showToast } from "../utils/toastUtils";
import { useEquipmentCart } from "./hooks/useEquipmentCart";
import { convertEquipmentItemToState } from "../types/mapper/convertEquipmentItemToState";
import { convertGroupEquipmentToState } from "../types/mapper/convertGropEquipmentToState";

export default function EquipmentPage() {
  const router = useRouter();
  const [selectedEquipmentList, setSelectedEquipmentList] = useState<
    EquipmentListItemType[]
  >([]);

  const [isFullSetSelected, setIsFullSetSelected] = useState<boolean>(false);
  const [selectedEquipmentSetList, setSelectedEquipmentSetList] = useState<
    SetEquipmentType[]
  >([]);

  const { handleAddEquipmentList, handleAddEquipmentGroup } =
    useEquipmentCart();

  const {
    list,
    selectedCategory,
    searchMenu,
    selectedSearchKey,
    keyword,
    toggleEquipmentCategory,
    onChangeKeyword,
    onChangeSearchKey,
    onSearch,
    fetchList,
    setPageModel,
    pageModel,
    searchParams,
    totalElements,
  } = useEquipmentList();

  const handleAddToCart = useCallback(async () => {
    if (isEmpty(selectedEquipmentList) && isEmpty(selectedEquipmentSetList))
      return;

    handleAddEquipmentList(
      selectedEquipmentList.map(convertEquipmentItemToState)
    );
    handleAddEquipmentGroup(
      selectedEquipmentSetList.map(convertGroupEquipmentToState)
    );

    showToast({
      message: "장바구니에 추가되었습니다.",
      type: "info",
    });

    setSelectedEquipmentList([]);
    setSelectedEquipmentSetList([]);
  }, [handleAddEquipmentList, selectedEquipmentList, selectedEquipmentSetList]);

  const toggleEquipmentList = useCallback(
    (itemList: EquipmentListItemType[]) => {
      setSelectedEquipmentList(itemList);
    },
    []
  );

  useEffect(() => {
    fetchList(searchParams);
  }, [searchParams]);

  return (
    <div className={styles.relativeWrapper}>
      <div className={styles.headerTitleButtonWrapper}>
        <h3></h3>
        <div className={formStyles.rightAlignButtonWrapper}>
          {isFullSetSelected ? (
            <Button
              style={{ width: "150px" }}
              size="Medium"
              onClick={() => router.push("/equipments/sets/create")}
            >
              풀세트 만들기
            </Button>
          ) : (
            <Button
              style={{ width: "150px" }}
              size="Medium"
              onClick={() => router.push("/equipments/create")}
            >
              장비 등록
            </Button>
          )}
        </div>
      </div>

      <Margin top={40} />

      <CategoryList
        categoryList={[
          ...EquipmentCategoryList,
          {
            key: "full_set",
            title: "풀세트 보기",
          },
        ]}
        selectedCategory={(isFullSetSelected && "full_set") || selectedCategory}
        onChangeCategory={(key) => {
          if (key === "full_set") {
            setIsFullSetSelected((prev) => !prev);
          } else {
            setIsFullSetSelected(false);
            toggleEquipmentCategory(key as EquipmentCategory);
          }
        }}
      />

      {!isFullSetSelected && (
        <Margin top={40}>
          <EquipmentListTable
            list={list}
            selectedList={selectedEquipmentList}
            searchMenu={searchMenu}
            selectedSearchKey={selectedSearchKey}
            keyword={keyword}
            onChangeKeyword={onChangeKeyword}
            onChangeSearchKey={onChangeSearchKey}
            onSearch={onSearch}
            onSelectCell={toggleEquipmentList}
            setPageModel={setPageModel}
            pageModel={pageModel}
            totalElements={totalElements}
          />
        </Margin>
      )}

      {isFullSetSelected && (
        <SetEquipmentList
          selectedEquipmentSetList={selectedEquipmentSetList}
          setSelectedEquipmentSetList={setSelectedEquipmentSetList}
        />
      )}
      <Margin top={120} />

      {!isEmpty([...selectedEquipmentList, ...selectedEquipmentSetList]) && (
        <div className={styles.fixedFooter}>
          <Button
            size="Medium"
            style={{
              width: "250px",
            }}
            onClick={handleAddToCart}
          >
            장바구니 추가
          </Button>
        </div>
      )}
    </div>
  );
}
