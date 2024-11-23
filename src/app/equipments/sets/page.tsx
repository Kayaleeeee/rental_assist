"use client";

import { useRouter } from "next/navigation";
import { Button } from "@components/Button";
import {
  EquipmentCategory,
  EquipmentCategoryList,
  SetEquipmentListItemType,
} from "../../types/equipmentType";
import { Margin } from "@components/Margin";
import formStyles from "@components/Form/index.module.scss";
import { CategoryList } from "@components/Category/CategoryList";
import { useCallback, useEffect, useState } from "react";
import { isEmpty, some } from "lodash";
// import { useCartStore } from "@stores/useCartStore";
import { Cart } from "@components/Cart";
import { useSetEquipmentList } from "./hooks/useSetEquipmentList";
import { FullSetListTable } from "./modules/FullSetListTable";

export default function EquipmentSetPage() {
  const router = useRouter();
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedEquipmentList, setSelectedEquipmentList] = useState<
    SetEquipmentListItemType[]
  >([]);
  // const { addEquipment } = useCartStore();

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
  } = useSetEquipmentList();

  // const handleAddToCart = useCallback(async () => {
  //   if (isEmpty(selectedEquipmentList)) return;

  //   const convertedList: EquipmentListItemState[] = selectedEquipmentList.map(
  //     (equipment) => ({
  //       equipmentId: equipment.id,
  //       title: equipment.title,
  //       price: equipment.price,
  //       quantity: 1,
  //       totalPrice: equipment.price,
  //     })
  //   );
  //   addEquipment(convertedList);
  //   setIsCartOpen(true);
  // }, [addEquipment, selectedEquipmentList]);

  const toggleEquipmentList = useCallback(
    (item: SetEquipmentListItemType) => {
      if (
        some(selectedEquipmentList, (equipment) => equipment.id === item.id)
      ) {
        setSelectedEquipmentList((prev) =>
          prev.filter((equipment) => equipment.id !== item.id)
        );
      } else {
        setSelectedEquipmentList((prev) => [...prev, item]);
      }
    },
    [selectedEquipmentList]
  );

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div>
      <div className={formStyles.rightAlignButtonWrapper}>
        <Button
          style={{ width: "200px" }}
          size="Medium"
          onClick={() => router.push("/equipments/create")}
        >
          풀세트 등록
        </Button>
        {!isEmpty(selectedEquipmentList) && (
          <Margin left={16}>
            <div>
              <Button
                size="Medium"
                variant="outlined"
                style={{ width: "200px" }}
                // onClick={handleAddToCart}
              >
                장바구니 추가
              </Button>
            </div>
          </Margin>
        )}
      </div>

      <Margin top={40} />

      <CategoryList
        categoryList={EquipmentCategoryList}
        selectedCategory={selectedCategory}
        onChangeCategory={(key) =>
          toggleEquipmentCategory(key as EquipmentCategory)
        }
      />
      <FullSetListTable
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
