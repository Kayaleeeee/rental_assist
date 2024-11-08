"use client";

import { useRouter } from "next/navigation";
import { Button } from "../components/Button";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEquipmentList } from "./hooks/useEquipmentList";
import { EquipmentListItemType } from "../types/equipmentType";
import styles from "./page.module.scss";

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
  },
  { field: "detail", flex: 1, renderHeader: () => HeaderName("상세설명") },
];

export default function EquipmentPage() {
  const router = useRouter();
  const { list } = useEquipmentList();
  console.log(list);

  return (
    <div>
      <div className={styles.rightAlignButtonWrapper}>
        <Button
          style={{ width: "200px" }}
          size="Medium"
          onClick={() => router.push("/equipments/create")}
        >
          장비 추가
        </Button>
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
