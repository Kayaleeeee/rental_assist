"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/Button";
import { useEquipmentList } from "./hooks/useEquipmentList";
import {
  EquipmentCategory,
  EquipmentCategoryList,
  EquipmentListItemType,
} from "../types/equipmentType";
import { Margin } from "../components/Margin";
import { CategoryList } from "../components/Category/CategoryList";
import { useCallback, useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { EquipmentListItemState, useCartStore } from "../store/useCartStore";
import { Cart } from "../components/Cart";
import { EquipmentListTable } from "./modules/EquipmentListTable";
import styles from "./page.module.scss";
import formStyles from "@components/Form/index.module.scss";

export default function EquipmentPage() {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedEquipmentList, setSelectedEquipmentList] = useState<
    EquipmentListItemType[]
  >([]);
  const { addEquipment } = useCartStore();

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
  } = useEquipmentList();

  const handleAddToCart = useCallback(async () => {
    if (isEmpty(selectedEquipmentList)) return;

    const convertedList: EquipmentListItemState[] = selectedEquipmentList.map(
      (equipment) => ({
        equipmentId: equipment.id,
        title: equipment.title,
        price: equipment.price,
        quantity: 1,
        totalPrice: equipment.price,
      })
    );
    addEquipment(convertedList);
    setIsCartOpen(true);
  }, [addEquipment, selectedEquipmentList]);

  const toggleEquipmentList = useCallback(
    (itemList: EquipmentListItemType[]) => {
      setSelectedEquipmentList(itemList);
    },
    []
  );

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div>
      <div className={styles.headerTitleButtonWrapper}>
        <h3></h3>
        <div className={formStyles.rightAlignButtonWrapper}>
          <Button
            style={{ width: "150px" }}
            size="Medium"
            onClick={() => router.push("/equipments/create")}
          >
            장비 등록
          </Button>
          {!isEmpty(selectedEquipmentList) && (
            <Margin left={16}>
              <div>
                <Button
                  size="Medium"
                  variant="outlined"
                  style={{ width: "150px" }}
                  onClick={handleAddToCart}
                >
                  장바구니 추가
                </Button>
              </div>
            </Margin>
          )}
        </div>
      </div>

      <Margin top={40} />

      <CategoryList
        categoryList={EquipmentCategoryList}
        selectedCategory={selectedCategory}
        onChangeCategory={(key) =>
          toggleEquipmentCategory(key as EquipmentCategory)
        }
      />

      <EquipmentListTable
        list={list}
        searchMenu={searchMenu}
        selectedSearchKey={selectedSearchKey}
        keyword={keyword}
        onChangeKeyword={onChangeKeyword}
        onChangeSearchKey={onChangeSearchKey}
        onSearch={onSearch}
        onSelectCell={toggleEquipmentList}
      />

      {isCartOpen && <Cart onCloseCart={() => setIsCartOpen(false)} />}
    </div>
  );
}
