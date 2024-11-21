"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/Button";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEquipmentList } from "./hooks/useEquipmentList";
import {
  EquipmentCategory,
  EquipmentCategoryList,
  EquipmentListItemType,
} from "../types/equipmentType";
import { formatLocaleString } from "../utils/priceUtils";
import { Margin } from "../components/Margin";
import formStyles from "@components/Form/index.module.scss";
import { HeaderName } from "../components/DataTable/HeaderName";
import { CategoryList } from "../components/Category/CategoryList";
import Link from "next/link";
import { useCallback, useState } from "react";
import { isEmpty, some } from "lodash";
import { EquipmentListItemState, useCartStore } from "../store/useCartStore";
import { Cart } from "../components/Cart";
import { SearchBar } from "../components/SearchBar";

const columns: GridColDef<EquipmentListItemType>[] = [
  {
    field: "id",
    width: 80,
    renderHeader: () => HeaderName("ID"),
  },
  {
    field: "title",
    renderHeader: () => HeaderName("장비명"),
    renderCell: ({ row }) => (
      <Link
        href={`/equipments/${row.id}`}
        style={{
          fontWeight: 700,
        }}
      >
        {row.title}
      </Link>
    ),
    flex: 1,
  },
  {
    field: "price",
    renderHeader: () => HeaderName("단가"),
    renderCell: ({ row }) => formatLocaleString(row.price),
  },
  { field: "detail", flex: 1, renderHeader: () => HeaderName("상세설명") },
];

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
    (item: EquipmentListItemType) => {
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

  return (
    <div>
      <div className={formStyles.rightAlignButtonWrapper}>
        <Button
          style={{ width: "200px" }}
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
                style={{ width: "200px" }}
                onClick={handleAddToCart}
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
      <Margin
        top={40}
        bottom={20}
        style={{
          maxWidth: "800px",
        }}
      >
        <SearchBar
          menuList={searchMenu}
          onChangeKeyword={onChangeKeyword}
          onChangeSearchKey={onChangeSearchKey}
          keyword={keyword}
          selectedKey={selectedSearchKey}
          onSearch={onSearch}
        />
      </Margin>

      <DataGrid<EquipmentListItemType>
        checkboxSelection
        onCellClick={({ row }) => toggleEquipmentList(row)}
        columns={columns}
        rows={list}
        getRowId={(cell) => cell.id}
        sx={{
          background: "white",
          width: "100%",
          height: "600px",
          borderRadius: "16px",
          marginTop: "24px",
        }}
      />
      {isCartOpen && <Cart onCloseCart={() => setIsCartOpen(false)} />}
    </div>
  );
}
