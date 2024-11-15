"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/Button";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEquipmentList } from "./hooks/useEquipmentList";
import {
  EquipmentCategoryList,
  EquipmentListItemType,
} from "../types/equipmentType";
import styles from "./page.module.scss";
import { formatLocaleString } from "../utils/priceUtils";
import { Margin } from "../components/Margin";
import formStyles from "@components/Form/index.module.scss";

const HeaderName = (name: string) => {
  return (
    <div
      style={{
        fontWeight: 900,
      }}
    >
      {name}
    </div>
  );
};

const columns: GridColDef<EquipmentListItemType>[] = [
  {
    field: "id",
    width: 80,
    renderHeader: () => HeaderName("ID"),
  },
  {
    field: "title",
    renderHeader: () => HeaderName("장비명"),
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
  const { list, selectedCategory, toggleEquipmentCategory } =
    useEquipmentList();

  return (
    <div>
      <div className={formStyles.rightAlignButtonWrapper}>
        <Button
          style={{ width: "200px" }}
          size="Medium"
          onClick={() => router.push("/equipments/create")}
        >
          장비 추가
        </Button>
      </div>

      <Margin top={40} />

      <div className={styles.listCategoryWrapper}>
        {EquipmentCategoryList.map((category) => {
          return (
            <div
              className={
                category.key === selectedCategory
                  ? styles.activeCategoryItem
                  : styles.categoryItem
              }
              key={category.key}
              onClick={() => toggleEquipmentCategory(category.key)}
            >
              {category.title}
            </div>
          );
        })}
      </div>

      <DataGrid<EquipmentListItemType>
        columns={columns}
        rows={list}
        getRowId={(cell) => cell.id}
        onCellClick={(cell) => router.push(`/equipments/${cell.id}`)}
        sx={{
          background: "white",
          width: "100%",
          height: "600px",
          borderRadius: "16px",
          marginTop: "24px",
        }}
      />
    </div>
  );
}
